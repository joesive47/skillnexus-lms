import JSZip from 'jszip'
import { contentType } from 'mime-types'
import prisma from '@/lib/prisma'
import { AccessError, requireEnrollment, requireUser } from '@/lib/access-control'
import { requirePreviousLessons } from '@/lib/learning-evidence'

const maxArchiveBytes = 50 * 1024 * 1024

type RuntimePackage = Awaited<ReturnType<typeof findPackage>>

async function findPackage(lessonId: string) {
  const scormPackage = await prisma.scormPackage.findUnique({
    where: { lessonId },
    include: { lesson: true },
  })
  if (!scormPackage) throw new AccessError('Learning package not found', 404)
  return scormPackage
}

function normalizeAssetPath(value: string) {
  const path = value.replaceAll('\\', '/').replace(/^\/+/, '')
  const segments = path.split('/')
  if (!path || segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    throw new AccessError('Invalid learning asset path', 400)
  }
  return segments.join('/')
}

export async function getRuntimePackage(lessonId: string) {
  const user = await requireUser()
  const scormPackage = await findPackage(lessonId)

  if (user.role !== 'ADMIN' && user.role !== 'TEACHER') {
    await requireEnrollment(user.id, scormPackage.lesson.courseId)
    await requirePreviousLessons(user.id, lessonId)
  }
  return scormPackage
}

export function getLaunchPath(manifest: string | null) {
  try {
    const parsed = JSON.parse(manifest || '{}') as {
      resources?: { resource?: Array<{ href?: string; $?: { href?: string } }> }
    }
    const launchPath = parsed.resources?.resource?.find((resource) => resource.$?.href || resource.href)?.$?.href
      || parsed.resources?.resource?.find((resource) => resource.href)?.href
    return normalizeAssetPath(launchPath || 'index.html')
  } catch {
    return 'index.html'
  }
}

async function fetchArchive(scormPackage: NonNullable<RuntimePackage>) {
  const sourceUrl = new URL(scormPackage.packagePath)
  if (sourceUrl.protocol !== 'https:' || !sourceUrl.hostname.endsWith('.blob.vercel-storage.com')) {
    throw new AccessError('Learning package storage is not supported', 409)
  }

  const source = await fetch(sourceUrl, { cache: 'no-store' })
  if (!source.ok) throw new AccessError('Learning package is unavailable', 502)

  const contentLength = Number(source.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > maxArchiveBytes) {
    throw new AccessError('Learning package is too large', 413)
  }

  const archive = await source.arrayBuffer()
  if (archive.byteLength > maxArchiveBytes) throw new AccessError('Learning package is too large', 413)
  return JSZip.loadAsync(archive)
}

export async function getRuntimeAsset(scormPackage: NonNullable<RuntimePackage>, requestedPath: string) {
  const assetPath = normalizeAssetPath(requestedPath)
  const archive = await fetchArchive(scormPackage)
  const asset = archive.file(assetPath)
  if (!asset || asset.dir) throw new AccessError('Learning asset not found', 404)

  return {
    body: Buffer.from(await asset.async('uint8array')),
    contentType: contentType(assetPath) || 'application/octet-stream',
  }
}

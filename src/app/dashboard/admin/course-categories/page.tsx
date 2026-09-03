import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/access-control'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function refreshCategoryPages() {
  revalidatePath('/dashboard/admin/course-categories')
  revalidatePath('/dashboard/admin/courses')
  revalidatePath('/dashboard/admin/courses/new')
  revalidatePath('/admin/course-analytics')
}

async function createCategory(formData: FormData) {
  'use server'
  await requireAdmin()
  const name = String(formData.get('name') || '').trim()
  const parentId = String(formData.get('parentId') || '').trim() || null
  const requestedSlug = slugify(String(formData.get('slug') || ''))
  if (!name || name.length > 100) throw new Error('ชื่อหมวดหมู่ต้องมี 1–100 ตัวอักษร')
  if (parentId && !await prisma.courseCategory.findFirst({ where: { id: parentId, parentId: null, active: true } })) {
    throw new Error('ไม่พบหมวดหมู่หลักที่ใช้งานอยู่')
  }
  const baseSlug = requestedSlug || slugify(name) || `category-${Date.now()}`
  let slug = baseSlug
  for (let suffix = 2; await prisma.courseCategory.findUnique({ where: { slug } }); suffix += 1) slug = `${baseSlug}-${suffix}`
  const highest = await prisma.courseCategory.aggregate({ where: { parentId }, _max: { sortOrder: true } })
  await prisma.courseCategory.create({ data: { name, slug, parentId, sortOrder: (highest._max.sortOrder || 0) + 10 } })
  refreshCategoryPages()
}

async function updateCategory(formData: FormData) {
  'use server'
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const name = String(formData.get('name') || '').trim()
  const requestedSlug = slugify(String(formData.get('slug') || ''))
  const sortOrder = Number(formData.get('sortOrder'))
  if (!id || !name || name.length > 100 || !requestedSlug || !Number.isInteger(sortOrder)) throw new Error('ข้อมูลหมวดหมู่ไม่ถูกต้อง')
  const duplicate = await prisma.courseCategory.findFirst({ where: { slug: requestedSlug, NOT: { id } }, select: { id: true } })
  if (duplicate) throw new Error('Slug นี้ถูกใช้งานแล้ว')
  await prisma.courseCategory.update({ where: { id }, data: { name, slug: requestedSlug, sortOrder } })
  refreshCategoryPages()
}

async function toggleCategory(formData: FormData) {
  'use server'
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const category = await prisma.courseCategory.findUnique({ where: { id }, select: { active: true, parentId: true } })
  if (!category) throw new Error('ไม่พบหมวดหมู่')
  const active = !category.active
  await prisma.$transaction(async tx => {
    await tx.courseCategory.update({ where: { id }, data: { active } })
    // Archiving a main category also archives its children; existing courses keep their links.
    if (!category.parentId && !active) await tx.courseCategory.updateMany({ where: { parentId: id }, data: { active: false } })
  })
  refreshCategoryPages()
}

export default async function CourseCategoriesPage() {
  try { await requireAdmin() } catch { redirect('/login') }
  const categories = await prisma.courseCategory.findMany({ where: { parentId: null },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { courses: true } }, children: { orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { courses: true } } } } } })

  return <div className="mx-auto max-w-6xl space-y-6 p-6">
    <div><h1 className="text-3xl font-bold">จัดการหมวดหมู่หลักสูตร</h1>
      <p className="text-muted-foreground">เพิ่ม แก้ไข จัดลำดับ หรือปิดใช้งานได้ 2 ระดับ โดยไม่ลบประวัติหลักสูตรเดิม</p></div>
    <div className="grid gap-6 md:grid-cols-2">
      <Card><CardHeader><CardTitle>เพิ่มหมวดหมู่หลัก</CardTitle></CardHeader><CardContent><CategoryForm action={createCategory} /></CardContent></Card>
      <Card><CardHeader><CardTitle>เพิ่มหมวดหมู่ย่อย</CardTitle></CardHeader><CardContent>
        <form action={createCategory} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="new-parent">หมวดหมู่หลัก</Label><select id="new-parent" name="parentId" required className="h-10 w-full rounded-md border bg-background px-3">
            <option value="">เลือกหมวดหมู่หลัก</option>{categories.filter(item => item.active).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
          <CategoryFields />
        </form></CardContent></Card>
    </div>
    <div className="space-y-4">{categories.map(category => <Card key={category.id} className={!category.active ? 'opacity-60' : ''}>
      <CardHeader><CardTitle className="flex items-center justify-between gap-3"><span>{category.name}</span>
        <span className="text-sm font-normal text-muted-foreground">{category._count.courses + category.children.reduce((sum, child) => sum + child._count.courses, 0)} หลักสูตร · {category.active ? 'ใช้งาน' : 'ปิดใช้งาน'}</span></CardTitle></CardHeader>
      <CardContent className="space-y-4"><CategoryRow category={category} />
        <div className="space-y-2 border-l-2 pl-4">{category.children.map(child => <CategoryRow key={child.id} category={child} />)}
          {!category.children.length && <p className="text-sm text-muted-foreground">ยังไม่มีหมวดหมู่ย่อย</p>}</div>
      </CardContent></Card>)}
      {!categories.length && <Card><CardContent className="py-10 text-center text-muted-foreground">ยังไม่มีหมวดหมู่</CardContent></Card>}
    </div>
  </div>
}

type CategoryRowData = { id: string; name: string; slug: string; sortOrder: number; active: boolean; _count: { courses: number } }
function CategoryRow({ category }: { category: CategoryRowData }) {
  return <div className="flex flex-wrap items-end gap-2 rounded-md border p-3">
    <form action={updateCategory} className="flex flex-1 flex-wrap items-end gap-2">
      <input type="hidden" name="id" value={category.id} />
      <div className="min-w-44 flex-1"><Label>ชื่อ</Label><Input name="name" defaultValue={category.name} required /></div>
      <div className="min-w-40 flex-1"><Label>Slug</Label><Input name="slug" defaultValue={category.slug} required /></div>
      <div className="w-24"><Label>ลำดับ</Label><Input name="sortOrder" type="number" defaultValue={category.sortOrder} required /></div>
      <Button type="submit" variant="outline">บันทึก</Button>
    </form>
    <form action={toggleCategory}><input type="hidden" name="id" value={category.id} />
      <Button type="submit" variant={category.active ? 'destructive' : 'default'}>{category.active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}</Button></form>
    <span className="w-full text-xs text-muted-foreground">ใช้อยู่ {category._count.courses} หลักสูตร</span>
  </div>
}

function CategoryFields() {
  return <><div className="space-y-2"><Label htmlFor="new-name">ชื่อ *</Label><Input id="new-name" name="name" maxLength={100} required /></div>
    <div className="space-y-2"><Label htmlFor="new-slug">Slug ภาษาอังกฤษ</Label><Input id="new-slug" name="slug" placeholder="data-and-ai" /></div>
    <Button type="submit">เพิ่มหมวดหมู่</Button></>
}
function CategoryForm({ action }: { action: (data: FormData) => Promise<void> }) {
  return <form action={action} className="space-y-4"><CategoryFields /></form>
}

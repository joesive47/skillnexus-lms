const { normalizePrismaSchema, prismaClientCurrent } = require('../scripts/run-all.cjs')

describe('RunAll Prisma client detection', () => {
  it('ignores formatting-only differences in Prisma schemas', () => {
    const source = `model User {\n  id String @id\n  email String @unique\n}`
    const generated = `model User {\n  id      String @id\n  email   String @unique\n}\n`

    expect(normalizePrismaSchema(source)).toBe(normalizePrismaSchema(generated))
  })

  it('still detects a real schema difference', () => {
    const source = 'model User { id String @id }'
    const generated = 'model User { id Int @id }'

    expect(normalizePrismaSchema(source)).not.toBe(normalizePrismaSchema(generated))
  })

  it('preserves meaningful whitespace inside mapped database names', () => {
    const source = 'model User { id String @map("external  id") }'
    const generated = 'model User { id String @map("external id") }'

    expect(normalizePrismaSchema(source)).not.toBe(normalizePrismaSchema(generated))
  })

  it('recognizes the checked-in schema as matching the generated client', () => {
    expect(prismaClientCurrent()).toBe(true)
  })
})

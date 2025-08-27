import { fakerPT_BR } from '@faker-js/faker'
import { db } from '#app/database/client.ts'
import { courses } from '#app/database/schema.ts'

interface Course {
  id: string
  title: string
  description?: string | null
}

export async function makeCourse(overrides: Partial<Course> = {}): Promise<Course> {
  const result = await db
    .insert(courses)
    .values({
      title: fakerPT_BR.lorem.words(4),
      description: fakerPT_BR.lorem.sentence(),
      ...overrides,
    })
    .returning()

  return result[0]
}

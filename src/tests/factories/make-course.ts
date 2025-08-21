import { fakerPT_BR } from '@faker-js/faker'
import { db } from '#app/database/client.ts'
import { courses } from '#app/database/schema.ts'

export async function makeCourse(title?: string) {
  const result = await db.insert(courses).values({
    title: title ?? fakerPT_BR.lorem.words(4),
    description: fakerPT_BR.lorem.sentence(),
  }).returning()

  return result[0]
}

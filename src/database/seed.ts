import { fakerPT_BR } from '@faker-js/faker'
import { hash } from 'argon2'
import { db } from './client.ts'
import { courses, enrollments, users } from './schema.ts'

async function seed() {
  const passwordHash = await hash('123456')

  const usersInsert = await db
    .insert(users)
    .values([
      {
        name: fakerPT_BR.person.fullName(),
        email: fakerPT_BR.internet.email(),
        password: passwordHash,
        role: 'manager',
      },
      {
        name: fakerPT_BR.person.fullName(),
        email: fakerPT_BR.internet.email(),
        password: passwordHash,
        role: 'student',
      },
      {
        name: fakerPT_BR.person.fullName(),
        email: fakerPT_BR.internet.email(),
        password: passwordHash,
        role: 'student',
      },
    ])
    .returning()

  const coursesInsert = await db
    .insert(courses)
    .values([
      { title: fakerPT_BR.lorem.words(4), description: fakerPT_BR.lorem.sentence() },
      { title: fakerPT_BR.lorem.words(4), description: fakerPT_BR.lorem.sentence() },
    ])
    .returning()

  await db.insert(enrollments).values([
    { userId: usersInsert[0].id, courseId: coursesInsert[0].id },
    { userId: usersInsert[1].id, courseId: coursesInsert[0].id },
    { userId: usersInsert[2].id, courseId: coursesInsert[1].id },
  ])

  console.log('Seeded successfully!')
  process.exit(0)
}

seed()

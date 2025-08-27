import { randomUUID } from 'node:crypto'
import { fakerPT_BR } from '@faker-js/faker'
import { hash } from 'argon2'
import jwt from 'jsonwebtoken'
import { db } from '#app/database/client.ts'
import { users } from '#app/database/schema.ts'

interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'manager' | 'student'
}

export async function makeUser(overrides: Partial<User> = {}): Promise<{ user: User; password: string }> {
  const passwordBeforeHash = randomUUID()

  const result = await db
    .insert(users)
    .values({
      name: fakerPT_BR.person.fullName(),
      email: fakerPT_BR.internet.email(),
      password: await hash(passwordBeforeHash),
      role: 'student',
      ...overrides,
    })
    .returning()

  return {
    user: result[0],
    password: passwordBeforeHash,
  }
}

export async function makeAuthenticatedUser(overrides: Partial<User> = {}): Promise<{ token: string }> {
  const { user } = await makeUser(overrides)

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)

  return {
    token,
  }
}

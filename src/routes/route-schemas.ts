import z from 'zod'

export const getCoursesRouteSchema = {
  tags: ['Courses'],
  summary: 'Get all courses',
  description: 'This route returns all courses in database',
  querystring: z.object({
    search: z.string().optional(),
    orderBy: z.enum(['id', 'title']).optional().default('id'),
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional(),
  }),
  response: {
    200: z
      .object({
        courses: z.array(
          z.object({
            id: z.uuid(),
            title: z.string(),
            enrollments: z.number(),
          }),
        ),
        total: z.number(),
      })
      .describe('List of courses'),
  },
} as const

export const getCourseByIdRouteSchema = {
  tags: ['Courses'],
  summary: 'Get a course by ID',
  description: 'This route returns a course by ID, it receives the course ID as a parameter',
  params: z.object({
    id: z.uuid(),
  }),
  response: {
    200: z
      .object({
        course: z.object({
          id: z.uuid(),
          title: z.string(),
          description: z.string().nullable(),
        }),
      })
      .describe('Course'),
    404: z
      .object({
        message: z.string(),
      })
      .describe('Course not found'),
  },
} as const

export const createCourseRouteSchema = {
  tags: ['Courses'],
  summary: 'Create a new course',
  description:
    'This route receive a title and description,  creates a new course in database, it returns the course ID',
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters long'),
    description: z.string().nullish(),
  }),
  response: {
    201: z
      .object({
        courseId: z.uuid(),
      })
      .describe('Course Created'),
    500: z.object({
      message: z.string(),
    }),
  },
} as const

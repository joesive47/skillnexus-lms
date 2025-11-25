import { NextResponse } from 'next/server'

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'SkillNexus LMS API',
    version: '1.0.0',
    description: 'Learning Management System API'
  },
  paths: {
    '/api/auth/signin': {
      post: {
        summary: 'User authentication',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    '/api/courses': {
      get: {
        summary: 'Get all courses',
        responses: {
          '200': {
            description: 'List of courses'
          }
        }
      }
    }
  }
}

export async function GET() {
  return NextResponse.json(swaggerSpec)
}
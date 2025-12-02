export const swaggerOptions = {
  definition: {
    openapi: '3.1.0', 
    info: {
      title: 'BetterBoxd API',
      version: '1.0.0',
      description: 'API documentation for BetterBoxd',
    },

    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Local development server',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Stories', description: 'Story management endpoints' },
    ],

    paths: {
      // ------------------- Auth -------------------
      '/auth/signup': {
        post: {
          tags: ['Auth'],
          summary: 'Signup a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    joinDate: { type: 'string', format: 'date-time' },
                    profile: { type: 'string' },
                  },
                  required: ['username', 'email', 'password', 'name'],
                },
              },
            },
          },
          responses: {
            201: { description: 'User signed up successfully' },
            409: { description: 'Conflict — user already exists' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login a user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful, returns JWT token',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      user: {
                        type: 'object',
                        properties: {
                          userId: { type: 'string' },
                          username: { type: 'string' },
                          name: { type: 'string' },
                          email: { type: 'string' },
                          role: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized — invalid credentials' },
          },
        },
      },

      // ------------------- Users -------------------
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users',
          responses: {
            200: { description: 'List of users' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User details' }, 404: { description: 'Not found' } },
        },
        put: {
          tags: ['Users'],
          summary: 'Update user by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                    profile: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'User updated successfully' },
            404: { description: 'Not found' },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Soft delete user by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'User deleted successfully' },
            404: { description: 'Not found' },
          },
        },
      },

      // ------------------- Stories -------------------
      '/stories': {
        get: {
          tags: ['Stories'],
          summary: 'Get all stories',
          responses: { 200: { description: 'List of stories' } },
        },
        post: {
          tags: ['Stories'],
          summary: 'Create a new story',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    body: { type: 'string' },
                  },
                  required: ['title', 'body'],
                },
              },
            },
          },
          responses: { 201: { description: 'Story created successfully' } },
        },
      },
      '/stories/{id}': {
        get: {
          tags: ['Stories'],
          summary: 'Get story by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Story details' }, 404: { description: 'Not found' } },
        },
        put: {
          tags: ['Stories'],
          summary: 'Update story by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { title: { type: 'string' }, body: { type: 'string' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Story updated successfully' },
            404: { description: 'Not found' },
          },
        },
        delete: {
          tags: ['Stories'],
          summary: 'Delete story by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Story deleted successfully' },
            404: { description: 'Not found' },
          },
        },
      },

      // ------------------- Health -------------------
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Check server health',
          responses: { 200: { description: 'Server is healthy' } },
        },
      },
    },
  },
};

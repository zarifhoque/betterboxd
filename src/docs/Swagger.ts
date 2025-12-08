// src/docs/swagger.ts
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'BetterBoxd API',
    description: 'Auto-generated Swagger documentation',
  },
  host: 'localhost:3000',
  basePath: '/api/v1',
  schemes: ['http'],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Users', description: 'User-related endpoints' },
    { name: 'Stories', description: 'Story-related endpoints' },
  ],
  definitions: {
    UserResponseDTO: {
      userId: 'uuid',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'USER',
    },
    UserUpdateDTO: {
      username: 'new_username',
      email: 'new_email@example.com',
    },
    UserUpdateRoleDTO: {
      role: 'ADMIN',
    },
  },
};

const outputFile = './src/docs/swagger-output.json';

const endpointsFiles = [
  './src/index.ts',
  './src/routes/UserRoutes.ts',
  './src/routes/StoryRoutes.ts',
  './src/routes/AuthRoutes.ts',
];

swaggerAutogen()(outputFile, endpointsFiles, doc);

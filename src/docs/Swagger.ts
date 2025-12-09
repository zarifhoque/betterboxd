// src/docs/swagger.ts
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'BetterBoxd API',
    description: 'This will list of all the API exposed by this backend',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Users', description: 'User-related endpoints' },
    { name: 'Stories', description: 'Story-related endpoints' },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: "Enter 'Bearer <token>'",
    },
  },
  security: [{ bearerAuth: [] }],
  definitions: {
    UserResponseDTO: {
      userId: 'uuid',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'USER',
    },
    UserUpdateDTO: {
      name: 'new name',
    },
    UserUpdateRoleDTO: {
      role: 'ADMIN',
    },
    UserSignupDTO: {
      username: 'exampleUsername',
      name: 'Example Name',
      email: 'example-mail@gmail.com',
      password: 'strongPass@123',
    },
    UserSigninDTO: {
      email: 'example-mail@yahoo.com',
      password: 'StrongPassword@123',
    },
    UserSigninResponseDTO: {
      token: 'Bearer <<tokenval>>',
      user: { $ref: '#/definitions/UserResponseDTO' },
    },
    StoryResponseDTO: {
      storyId: 'uuid',
      userId: 'uuid',
      title: 'Title Name',
      body: 'Some Body Text',
      updatedAt: 'Some Date',
      username: 'Username',
    },
    StoryCreateDTO: {
      title: 'Title Name',
      body: 'Some Body Text',
    },
  },
};

const outputFile = './src/docs/swagger-output.json';

const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);

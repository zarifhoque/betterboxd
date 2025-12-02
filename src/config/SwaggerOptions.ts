export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BetterBoxd API',
      version: '1.0.0',
      description: 'API documentation for BetterBoxd',
    },
    servers: [{ url: 'http://localhost:3000/api/v1' }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwtSecret: process.env.JWT_SECRET ?? 'dev-only-secret-do-not-use-in-prod',
});

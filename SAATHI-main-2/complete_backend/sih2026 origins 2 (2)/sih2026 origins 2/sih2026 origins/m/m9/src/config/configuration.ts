export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  corsOrigins: string[];
  database: {
    url?: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
  };
  services: {
    m3RetrievalUrl: string;
    m5GenerationUrl: string;
  };
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173'],
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'bis_db',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
    logging: process.env.DB_LOGGING === 'true',
  },
  services: {
    m3RetrievalUrl: process.env.M3_RETRIEVAL_URL || 'http://localhost:8003/api/v1/retrieval',
    m5GenerationUrl: process.env.M5_GENERATION_URL || 'http://localhost:8005/api/v1/generate',
  },
});

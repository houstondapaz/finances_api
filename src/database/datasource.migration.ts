import { hostname } from 'node:os';
import { config } from 'dotenv';
import { baseDatabaseConfig } from './database-base.config';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

const migrationConfig = {
  ...baseDatabaseConfig,
  applicationName: hostname(),
  url: process.env.DATABASE_URL,
  cli: {
    migrationsDir: './src/database/migrations',
  },
};

const dataSource = new DataSource(migrationConfig as DataSourceOptions); // config is one that is defined in datasource.config.ts file
dataSource.initialize();

export default dataSource;

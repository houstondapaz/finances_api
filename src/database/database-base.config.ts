import { resolve } from 'node:path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const entitiesPath = resolve(__dirname, '..', '**/entities/*.entity{.ts,.js}');

export const baseDatabaseConfig = {
  type: 'postgres',
  url: '',
  applicationName: '',
  migrationsTableName: '__migrations__',
  schema: 'public',
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: false,
  synchronize: true,
  entities: [entitiesPath],
  logging: process.env.NODE_ENV === 'development',
  namingStrategy: new SnakeNamingStrategy(),
};

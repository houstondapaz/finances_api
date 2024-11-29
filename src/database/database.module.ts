import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'src/shared/config/database.config';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DatabaseConfig],
      useFactory(databaseConfig: DatabaseConfig) {
        return {
          type: 'postgres',
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.username,
          password: databaseConfig.password,
          database: databaseConfig.database,
          ssl: databaseConfig.ssl,
          entities: ['dist/**/*.entity{.ts,.js}'],
          migrationsRun: databaseConfig.migrationsRun,
          synchronize: true,
          logging: databaseConfig.logging,
        };
      },
    }),
  ],
})
export class DatabaseModule {}

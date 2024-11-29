import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig } from 'src/shared/config/database.config';
import { SharedModule } from 'src/shared/shared.module';
import { baseDatabaseConfig } from 'src/database/database-base.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [SharedModule],
      inject: [DatabaseConfig],
      useFactory(databaseConfig: DatabaseConfig) {
        return {
          ...baseDatabaseConfig,
          url: databaseConfig.connectionString,
          applicationName: process.env.APPLICATION_NAME || 'finances_control',
        } as TypeOrmModuleOptions;
      },
    }),
  ],
})
export class DatabaseModule {}

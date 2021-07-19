import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      database: configService.get<string>('DB_NAME'),
      port: +configService.get<number>('DB_PORT') || 5432,
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      host: configService.get<string>('DB_HOST'),
      synchronize: false,
      migrationsRun: false,
      logging: configService.get<LoggerOptions>('DB_LOGGING') || false,
      entities: ["dist/**/*.entity{.ts,.js}"],
      migrations: ["dist/migrations/**/*{.ts,.js}"],
      cli: { "migrationsDir": "migrations" }
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService]
};

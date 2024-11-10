import { Module, ValidationPipe, MiddlewareConsumer, ClassSerializerInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { DonorsModule } from './donors/donors.module';
import { SeederModule } from './seeder/seeder.module';
import { ChangeHistoryModule } from './change-history/change-history.module';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_NAME,
      synchronize: true, // For test and dev purposes
      migrations: ['migrations/*.js'],
      entities: ['**/*.entity.js'],
      migrationsRun: process.env.NODE_ENV == 'test',
    }),
    UsersModule,
    EventsModule,
    DonorsModule,
    SeederModule,
    ChangeHistoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}

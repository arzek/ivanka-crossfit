import { ConfigModule } from 'nestjs-dotenv';
import { TelegrafModule } from 'nestjs-telegraf';

import { Module } from '@nestjs/common';

import { SpreadsheetsService } from './services/spreadsheets.service';
import { TelegrafConfigService } from './services/telegraf-config.service';
import { TelegramService } from './services/telegram.service';
import { AppService } from './services/app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      useClass: TelegrafConfigService,
    }),
  ],
  providers: [
    AppService,
    SpreadsheetsService,
    TelegrafConfigService,
    TelegramService,
  ],
})
export class AppModule {}

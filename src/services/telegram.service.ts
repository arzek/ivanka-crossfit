import { Injectable } from '@nestjs/common';
import { Context, Hears, Start } from 'nestjs-telegraf';
import * as Keyboard from 'telegraf-keyboard';
import { AppService } from './app.service';

enum MODE {
  home,
  street,
}

@Injectable()
export class TelegramService {
  morning = 'Програма для дому';
  evening = 'Програма для вулиці';

  constructor(private readonly appService: AppService) {}

  @Start()
  start(ctx: Context) {
    const options = {
      inline: false, // default
      duplicates: false, // default
      newline: false, // default
    };
    const keyboard = new Keyboard(options);
    keyboard.add(this.morning, this.evening); // first line
    ctx.reply('Привіт!', keyboard.draw());
  }

  @Hears('Програма для дому')
  async onHome(ctx: Context) {
    await this.main(MODE.home, ctx);
  }

  @Hears('Програма для вулиці')
  async onStreet(ctx: Context) {
    await this.main(MODE.street, ctx);
  }

  private async main(mode: MODE, ctx: Context): Promise<void> {
    ctx.reply('Завантаження...');

    let rounds = 0;
    let exercises = [];

    if (mode === MODE.home) {
      const res = await this.appService.getHomeProgram();
      rounds = res.rounds;
      exercises = res.exercises;
    } else if (mode === MODE.street) {
      const res = await this.appService.getStreetProgram();
      rounds = res.rounds;
      exercises = res.exercises;
    }

    await ctx.replyWithMarkdown(`*${rounds} круга/кругів.*`);

    for (const exercise of exercises) {
      await ctx.replyWithMarkdown(`- ${exercise}`);
    }

    await ctx.replyWithMarkdown(`*В тебе все вийде ❤️*`);
  }
}

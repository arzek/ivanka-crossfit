import { Injectable } from '@nestjs/common';
import { Context, Hears, Start } from 'nestjs-telegraf';
import * as Keyboard from 'telegraf-keyboard';
import { AppService } from './app.service';

enum MODE {
  morning,
  evening,
}

@Injectable()
export class TelegramService {
  morning = 'Програма на ранок';
  evening = 'Програма для вечора';

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

  @Hears('Програма на ранок')
  async onMorning(ctx: Context) {
    await this.main(MODE.morning, ctx);
  }

  @Hears('Програма для вечора')
  async onEvening(ctx: Context) {
    await this.main(MODE.evening, ctx);
  }

  private async main(mode: MODE, ctx: Context): Promise<void> {
    ctx.reply('Завантаження...');

    let rounds = 0;
    let exercises = [];

    if (mode === MODE.evening) {
      const res = await this.appService.getEveningWorkoutProgram();
      rounds = res.rounds;
      exercises = res.exercises;
    } else if (mode === MODE.morning) {
      const res = await this.appService.getMorningWorkoutProgram();
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

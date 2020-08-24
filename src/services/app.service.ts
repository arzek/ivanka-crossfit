import * as _ from 'lodash';

const { sample } = _;

import { Injectable } from '@nestjs/common';
import { SpreadsheetsService } from './spreadsheets.service';

@Injectable()
export class AppService {
  rounds = [2, 3, 4, 5];
  countExercises = [3, 4, 5, 6];

  constructor(private readonly spreadsheetsService: SpreadsheetsService) {}

  async getMorningWorkoutProgram() {
    const exercisesFromDb = await this.spreadsheetsService.getOnlyCardioExercises();
    return this.getWorkoutProgram(exercisesFromDb);
  }

  async getEveningWorkoutProgram() {
    const exercisesFromDb = await this.spreadsheetsService.getAllExercises();
    return this.getWorkoutProgram(exercisesFromDb);
  }

  private async getWorkoutProgram(
    exercisesFromDb: string[],
  ): Promise<{
    rounds: number;
    exercises: string[];
  }> {
    const exercises = [];

    const rounds = sample(this.rounds);
    const countExercises = sample(this.countExercises);

    for (let i = 0; i < countExercises; i++) {
      const exercise = sample(exercisesFromDb);
      exercises.push(exercise);
      exercisesFromDb = exercisesFromDb.filter(item => item !== exercise);
    }

    return { rounds, exercises };
  }
}

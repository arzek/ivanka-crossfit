import * as Spreadsheet from 'google-spreadsheet';

import { ConfigService } from 'nestjs-dotenv';

import { Injectable } from '@nestjs/common';

@Injectable()
export class SpreadsheetsService {
  private doc: any;
  constructor(private readonly configService: ConfigService) {
    this.doc = new Spreadsheet.GoogleSpreadsheet(this.configService.get('ID'));
    this.doc.useApiKey(this.configService.get('API_KEY'));
  }

   async getHomeExercises(): Promise<string[]> {
     const names = [];

     await this.doc.loadInfo();

     const sheet = this.doc.sheetsByIndex[0];
     const rows = await sheet.getRows();
     for (const row of rows) {
       const name = row._rawData[0];
       names.push(name);
     }

     return names;
   }

   async getStreetExercises(): Promise<string[]> {
     const names = [];

     await this.doc.loadInfo();

     const sheet = this.doc.sheetsByIndex[1];
     const rows = await sheet.getRows();
     for (const row of rows) {
       const name = row._rawData[0];
       names.push(name);
     }

     return names;
   }
}

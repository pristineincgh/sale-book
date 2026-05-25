import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client.js';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private configService: ConfigService) {
    const databaseUrl = configService.get<string>('databaseUrl');

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });
    super({ adapter });
  }
}

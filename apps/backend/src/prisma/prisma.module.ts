import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '../config/config.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
	providers: [
		{
			provide: PrismaService,
			useFactory: async (config: ConfigService) => {

				return new PrismaClient({
					datasourceUrl: config.values.mongoURL,
					errorFormat: 'pretty',
					log: ['query', 'error', 'warn'],
				});
			},
			inject: [ConfigService],
		},
	],
	exports: [PrismaService],
})
export class PrismaModule { }

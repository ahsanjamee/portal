import { Global, Module } from '@nestjs/common';
import { readFile } from 'fs/promises';
import yaml from 'yaml';
import { ConfigService, ConfigZod } from './config.service';

@Global()
@Module({
	providers: [
		{
			provide: ConfigService,
			useFactory: async () => {
				const yml = await readFile('env.yaml', 'utf-8');
				const config = yaml.parse(yml);

				const parsed = ConfigZod.parse(config);

				return new ConfigService(parsed);
			},
		},
	],
	exports: [ConfigService],
})
export class ConfigModule {}

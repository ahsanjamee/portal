import { readFileSync, writeFileSync } from 'fs';
import { LoggerService } from 'src/libs/logger/logger.service';
import yaml from 'yaml';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const ConfigZod = z.object({
    port: z.number().default(4000),
    dev: z.boolean().default(true),
    frontendURL: z.string().default('http://localhost:3000'),
    backendURL: z.string().default('http://localhost:4000'),

    redis: z
        .object({
            host: z.string(),
            port: z.number(),
            password: z.string(),
        })
        .default({
            host: 'localhost',
            port: 6379,
            password: '',
        }),

    mongoURL: z.string().default('mongodb://127.0.0.1:27017/portal'),

    auth: z.object({
        jwtSecret: z.string().default('secret@!@@~'),
        accessTokenExpiresIn: z.string().default('1h'),
        refreshTokenExpiresIn: z.string().default('1y'),
    }),

    adminCredential: z.object({
        email: z.string().email(),
        password: z.string(),
    }),

    sms: z.object({
        apiUrl: z.string().default('https://api.mimsms.com/api/SmsSending/SMS'),
        username: z.string().email(),
        apiKey: z.string(),
        senderId: z.string(),
    }),
});

type ConfigType = z.infer<typeof ConfigZod>;

export class ConfigService {
    constructor(public values: ConfigType) { }
}

//if this program is run with --generate argument then generate json schema from above object to env.schema.json file
if (process.argv.includes('--generate')) {
    const jsonSchema = zodToJsonSchema(ConfigZod, 'SaaS Starter Config');

    writeFileSync('env.schema.json', JSON.stringify(jsonSchema, null, 2));

    new LoggerService().log('wrote env schema. exiting...');

    process.exit(0);
}

export function injectEnvToService() {
    console.log('injectEnvToService has been called');

    const yml = readFileSync('env.yaml', 'utf-8');
    const config = yaml.parse(yml);

    return new ConfigService(ConfigZod.parse(config));
}

export const ParsedConfigs = injectEnvToService();

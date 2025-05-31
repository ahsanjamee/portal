//eslint-disable

import { INestiaConfig } from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

const config: INestiaConfig = {
    input: async () => {
        return NestFactory.create(AppModule);
    },
    swagger: {
        output: 'swagger.json',
        security: {
            bearer: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            basic: {
                type: 'http',
                scheme: 'basic',
            },
        },
        servers: [],
    },
};
export default config;

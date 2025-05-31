import { NestiaSwaggerComposer } from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { LoggerService } from './libs/logger/logger.service';
import { GlobalResponseTransformer } from './libs/utils/src';

const setupSwagger = async (app: NestExpressApplication, _config: ConfigService) => {
    const document = await NestiaSwaggerComposer.document(app, {
        info: {
            title: 'Portal',
            description: 'Portal API',
            version: '0.1.0',
        },
        servers: [
            {
                url: _config.values.backendURL,
            },
        ],
        security: {
            bearer: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        decompose: true,
    });

    SwaggerModule.setup('swagger', app, document as any, {
        swaggerOptions: {
            persistAuthorization: true,

            syntaxHighlight: {
                activate: true,
                theme: 'obsidian',
            },
            docExpansion: 'none',
            displayRequestDuration: true,
            defaultModelExpandDepth: 8,
            defaultModelsExpandDepth: 8,
        },
        customSiteTitle: 'Portal swagger doc',
    });
};

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const appConfig = app.get<ConfigService>(ConfigService);

    const logger = new LoggerService({
        context: '[APP]',
        showTrace: false,
    });

    app.useLogger(logger);

    app.useGlobalInterceptors(new GlobalResponseTransformer());
    app.enableCors();

    app.disable('x-powered-by');
    app.useBodyParser('json', { limit: '50mb' });

    await setupSwagger(app, appConfig);

    await app.listen(appConfig.values.port, '127.0.0.1');

    const url = await app.getUrl();
    const socketURL = url.replace(/http|https/, (m) => (m.includes('s') ? 'wss' : 'ws'));

    logger.log(`Application is running on: ${url}`);
    logger.log(`Swagger is running on: ${url}/swagger`);
    logger.log(`Socket.IO is running on: ${socketURL}`);
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});

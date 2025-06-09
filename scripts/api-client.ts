import { exec } from 'child_process';
import fs from 'fs';

console.log('Building API Client');

const execCommand = (command: string, cwd?: string) => {
    return new Promise((resolve, reject) => {
        let start = Date.now();
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.log(stdout);
                console.log(stderr);
                reject(error);
                return;
            }
            // console.log(`stdout: ${stdout}`);
            // console.error(`stderr: ${stderr}`);
            console.log(`Command ${command} took ${Date.now() - start}ms`);
            resolve(stdout);
        });
    });
};

const buildPortal = async () => {
    await execCommand('pnpm prisma:generate & turbo run build --filter=@portal/backend');
    await execCommand('pnpm swagger', 'apps/backend');
    fs.renameSync('apps/backend/swagger.json', 'libs/portal-api-client/swagger.json');
    const text = fs.readFileSync('libs/portal-api-client/swagger.json', 'utf-8');

    const parsed = JSON.parse(text);

    parsed.components.schemas['JsonArray'] = {
        type: 'array',
        items: {
            oneof: [
                {
                    type: 'null',
                },
                {
                    type: 'string',
                },
                {
                    type: 'number',
                },
                {
                    type: 'boolean',
                },
                {
                    type: 'object',
                },
                {
                    type: 'array',
                },
            ],
        },
    };

    parsed.components.schemas['JsonObject'] = {
        type: 'object',
        properties: {},
        additionalProperties: {
            oneOf: [
                {
                    type: 'null',
                },
                {
                    type: 'string',
                },
                {
                    type: 'number',
                },
                {
                    type: 'boolean',
                },
                {
                    type: 'object',
                },
                {
                    type: 'array',
                },
            ],
        },
    };

    fs.writeFileSync('libs/portal-api-client/swagger.json', JSON.stringify(parsed, null, 2));

    await execCommand('pnpm turbo run build --filter=@portal/portal-api-client');
};

Promise.allSettled([buildPortal()]).then(([portal]) => {
    if (portal.status === 'rejected') {
        console.error('Failed to build Portal API Client');
    }

    if (portal.status === 'fulfilled') {
        console.log('API Client Built');
    }
});

import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import chalk, { Color } from 'chalk';
import { inspect } from 'util';

type LoggerConfig = {
    context: string;
    showTrace?: boolean;
};

@Injectable()
export class LoggerService implements NestLogger {
    private readonly context: string;
    private readonly showTrace: boolean;

    private ctx(type: 'log' | 'warn' | 'error' = 'log') {
        let color: typeof Color = 'green';

        switch (type) {
            case 'error':
                color = 'red';
                break;
            case 'warn':
                color = 'yellow';
                break;
        }

        return chalk[color](`[${this.context}]`);
    }

    constructor(
        config: LoggerConfig = {
            context: 'LoggerService',
            showTrace: true,
        },
    ) {
        this.context = config.context;
        this.showTrace = config.showTrace ?? true;
    }

    logObject(obj: any) {
        console.log(this.ctx(), inspect(obj, false, null, true));

        if (this.showTrace) console.error(this.getTrace());
    }

    log(...args: any[]) {
        console.log(this.ctx(), ...args);

        if (this.showTrace) console.error(this.getTrace());
    }

    error(...args: any[]) {
        console.error(this.ctx('error'), ...args);

        if (this.showTrace) console.error(this.getTrace());
    }

    warn(...args: any[]) {
        console.warn(this.ctx(), ...args);

        if (this.showTrace) console.error(this.getTrace());
    }

    private getTrace() {
        const trace = new Error().stack
            ?.split('\n')
            .slice(3, 4)
            .map((e) => e.trim().match(/(?<=\().*(?=\))/)?.[0])
            .join('\n');

        return `${trace}\n${'-'.repeat(this.ctx.length)}`;
    }
}

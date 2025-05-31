import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type LangValue = 'en' | 'no';
export type LangHeader = {
	lang?: LangValue;
	language?: LangValue;
};

export const Lang = createParamDecorator((_, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();

	const lang: LangValue = request.headers['lang'] || request.headers['language'] || 'en';

	return lang;
});

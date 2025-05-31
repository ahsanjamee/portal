// import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { ForceUpdatePlatformTypeEnum } from '@prisma/client';

// export const Platform = createParamDecorator((_, ctx: ExecutionContext) => {
// 	const request = ctx.switchToHttp().getRequest();

// 	const appAgent = request.headers['app-agent'];
// 	if (!appAgent) throw new BadRequestException('missing_app_agent');

// 	// “app/iOS/mobile/1”
// 	const splitAppAgent = appAgent.split('/');

// 	// todo: for other types need to update everything
// 	const platform = splitAppAgent[1]?.toUpperCase();
// 	if (!platform) throw new BadRequestException('missing_app_agent');

// 	return platform as ForceUpdatePlatformTypeEnum;
// });

import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
	data: T;
}

export class GlobalResponseTransformer<T> implements NestInterceptor<T, Response<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
		return next.handle().pipe(
			map((data) => {
				let parsedData: any;

				try {
					parsedData = typeof data === 'string' ? JSON.parse(data) : data;
				} catch (err) {
					console.error('Failed to parse response data:', err);
					parsedData = data; // fallback to raw data
				}

				return {
					success: true,
					data: parsedData,
					error: null,
					message: null,
				};
			}),
		);
	}
}

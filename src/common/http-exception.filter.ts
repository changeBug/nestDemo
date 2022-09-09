import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    console.log(exception);
    

    if (status === 500) {
      response
        .status(status)
        .json({
          statusCode: status,
          message: 'Internal Server Error',
        });
    } else {
      response
        .status(status)
        .json(exception.message);
    }
  }
}

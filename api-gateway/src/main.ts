import { NestFactory } from '@nestjs/core';
import * as momentTimezone from 'moment-timezone';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { TimeoutInterceptor } from './interceptors/timeout.inteceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  Date.prototype.toJSON = () => {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };
  await app.listen(8080);
}
bootstrap();

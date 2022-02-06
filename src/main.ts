import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { sessionMiddleware } from './session.middleware';
import { WsAdapter } from './WsAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(sessionMiddleware);
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(process.env.PORT, process.env.HOST);
}
bootstrap();

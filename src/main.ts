import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { sessionMiddleware } from './session.middleware';
import { WsAdapter } from './WsAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  app.useWebSocketAdapter(new WsAdapter(app));
  console.log(`app started at ${process.env.HOST}:${process.env.PORT}`);
  await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? 'localhost');
}
bootstrap();

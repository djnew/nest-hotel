import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import * as sharedSession from 'express-socket.io-session';
import { sessionMiddleware } from './session.middleware';
/**
 * Enable session tokens for web sockets by using express-socket.io-session
 */
export class WsAdapter extends IoAdapter {
  private app: INestApplication;

  constructor(app: INestApplication) {
    super(app);
    this.app = app;
  }

  createIOServer(port: number, options?: any): any {
    const server: Server = super.createIOServer(port, options);
    this.app.use(sessionMiddleware);
    server.use(
      sharedSession(sessionMiddleware, {
        autoSave: true,
      }),
    );
    return server;
  }
}

import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  private readonly user = process.env.RABBITMQ_USER;
  private readonly password = process.env.RABBITMQ_PASSWORD;
  private readonly host = process.env.RABBITMQ_HOST;
  private readonly queueName = process.env.RABBITMQ_QUEUE_NAME;

  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqps://${this.user}:${this.password}@${this.host}`],
        queue: `${this.queueName}`,
      },
    });
  }
}

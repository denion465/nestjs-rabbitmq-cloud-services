import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CriarCategoriaDto } from './dtos';

@Controller('api/v1')
export class AppController {
  private readonly user = process.env.RABBITMQ_USER;
  private readonly password = process.env.RABBITMQ_PASSWORD;
  private readonly host = process.env.RABBITMQ_HOST;
  private readonly queueName = process.env.RABBITMQ_QUEUE_NAME;
  private logger = new Logger(AppController.name);
  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqps://${this.user}:${this.password}@${this.host}`],
        queue: `${this.queueName}`,
      },
    });
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    return this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto);
  }
}

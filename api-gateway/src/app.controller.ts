import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AtualizarCategoriaDto, CriarCategoriaDto } from './dtos';

@Controller('api/v1')
export class AppController {
  private readonly user = process.env.RABBITMQ_USER;
  private readonly password = process.env.RABBITMQ_PASSWORD;
  private readonly host = process.env.RABBITMQ_HOST;
  private readonly queueName = process.env.RABBITMQ_QUEUE_NAME;
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

  @Get('categorias')
  consultarCategorias(@Query('idCategoria') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-categorias', _id ?? '');
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto);
  }

  @Put('categorias/:_id')
  @UsePipes(ValidationPipe)
  atualizarCategorias(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: atualizarCategoriaDto,
    });
  }
}

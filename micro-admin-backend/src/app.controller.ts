import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Categoria } from './interfaces/categorias/categoria.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return this.appService.consultarCategoriaPorId(_id);
      } else {
        return this.appService.consultarTodasCategorias();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`categoria: ${JSON.stringify(categoria, null, 2)}`);
    try {
      await this.appService.criarCategoria(categoria);
      await channel.ack(originalMsg);
    } catch (err) {
      this.logger.log(`error: ${JSON.stringify(err.message)}`);
      for (const ackError of ackErrors) {
        if (err.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      }
    }
  }

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`data: ${JSON.stringify(data, null, 2)}`);
    try {
      const _id: string = data.id;
      const categoria: Categoria = data.categoria;
      await this.appService.atualizarCategoria(_id, categoria);
      await channel.ack(originalMsg);
    } catch (err) {
      for (const ackError of ackErrors) {
        if (err.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      }
    }
  }
}

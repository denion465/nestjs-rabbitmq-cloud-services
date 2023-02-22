import { Controller, Logger } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
  EventPattern,
} from '@nestjs/microservices';
import { CategoriasService } from './categorias.service';
import { Categoria } from './interfaces/categoria.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class CategoriasController {
  private readonly logger = new Logger(CategoriasController.name);

  constructor(private readonly categoriasService: CategoriasService) {}

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return this.categoriasService.consultarCategoriaPorId(_id);
      } else {
        return this.categoriasService.consultarTodasCategorias();
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
    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);
    try {
      await this.categoriasService.criarCategoria(categoria);
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
    this.logger.log(`data: ${JSON.stringify(data)}`);
    try {
      const _id: string = data.id;
      const categoria: Categoria = data.categoria;
      await this.categoriasService.atualizarCategoria(_id, categoria);
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

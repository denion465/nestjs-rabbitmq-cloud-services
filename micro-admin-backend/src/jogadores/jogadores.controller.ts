import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class JogadoresController {
  private readonly logger = new Logger(JogadoresController.name);

  constructor(private readonly jogadoresService: JogadoresService) {}

  @MessagePattern('consultar-jogadores')
  async consultarJogadores(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return this.jogadoresService.consultarJogadorPorId(_id);
      } else {
        return this.jogadoresService.consultarTodosJogadores();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('criar-jogador')
  async criarJogador(@Payload() jogador: Jogador, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`jogador: ${JSON.stringify(jogador)}`);
      await this.jogadoresService.criarJogador(jogador);
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

  @EventPattern('atualizar-jogador')
  async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`data: ${JSON.stringify(data)}`);
      const _id: string = data.id;
      const jogador: Jogador = data.jogador;
      await this.jogadoresService.atualizarJogador(_id, jogador);
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

  @EventPattern('deletar-jogador')
  async deletarJogador(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.jogadoresService.deletarJogador(_id);
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

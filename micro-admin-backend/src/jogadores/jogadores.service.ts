import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async consultarTodosJogadores(): Promise<Jogador[]> {
    try {
      return this.jogadorModel.find().populate('categoria').exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async consultarJogadorPorId(_id: string): Promise<Jogador> {
    try {
      return this.jogadorModel.findOne({ _id }).populate('categoria').exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async criarJogador(jogador: Jogador): Promise<void> {
    try {
      const jogadorCriado = new this.jogadorModel(jogador);
      await jogadorCriado.save();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async atualizarJogador(_id: string, jogador: Jogador): Promise<void> {
    try {
      await this.jogadorModel
        .findByIdAndUpdate({ _id }, { $set: jogador })
        .exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async deletarJogador(_id: string): Promise<void> {
    try {
      await this.jogadorModel.deleteOne({ _id }).exec();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }
}

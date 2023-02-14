import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto, CriarJogadorDto } from './dtos';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return this.jogadorModel.find().exec();
  }

  async consultarJogadorPorId(_id: string): Promise<Jogador> {
    const jogador = await this.jogadorModel.findOne({ _id }).exec();
    if (!jogador) {
      throw new NotFoundException(`Jogador com _id ${_id} não encontrado.`);
    }
    return jogador;
  }

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;
    const jogador = await this.jogadorModel.findOne({ email }).exec();
    if (jogador) {
      throw new BadRequestException(`Jogador com e-mail ${email} já cadatrado`);
    }
    return new this.jogadorModel(criarJogadorDto).save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<void> {
    const jogador = await this.jogadorModel.findOne({ _id }).exec();
    if (!jogador) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado.`);
    }
    await this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: atualizarJogadorDto })
      .exec();
  }

  async deletarJogador(_id: string): Promise<void> {
    const jogador = await this.jogadorModel.findOne({ _id }).exec();
    if (!jogador) {
      throw new NotFoundException(`Jogador com _id ${_id} não encontrado.`);
    }
    await this.jogadorModel.deleteOne({ _id }).exec();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return this.jogadorModel.find().exec();
  }

  async consultarJogadoresPorEmail(email: string): Promise<Jogador> {
    const jogador = await this.jogadorModel.findOne({ email }).exec();
    if (!jogador) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} não encontrado.`,
      );
    }
    return jogador;
  }

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogador = await this.jogadorModel.findOne({ email }).exec();
    if (!jogador) this.criar(criarJogadorDto);
    else this.atualizar(criarJogadorDto);
  }

  async deletarJogador(email: string): Promise<void> {
    await this.jogadorModel.deleteOne({ email }).exec();
  }

  private criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogador = new this.jogadorModel(criarJogadorDto);
    return jogador.save();
  }

  private atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return this.jogadorModel
      .findOneAndUpdate(
        { email: criarJogadorDto.email },
        { $set: criarJogadorDto },
      )
      .exec();
  }
}

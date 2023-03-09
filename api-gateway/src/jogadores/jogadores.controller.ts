import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { lastValueFrom, Observable } from 'rxjs';
import { AwsService } from 'src/aws/aws.service';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { AtualizarJogadorDto, CriarJogadorDto } from './dtos';

@Controller('api/v1/jogadores')
export class JogadoresController {
  private logger = new Logger();

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Get()
  consultarJogadores(@Query('idJogador') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', _id ?? '');
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    this.logger.log(`criarJogador: ${JSON.stringify(criarJogadorDto)}`);
    const categoria = await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-categorias',
        criarJogadorDto.categoria,
      ),
    );
    if (categoria) {
      this.clientAdminBackend.emit('criar-jogador', criarJogadorDto);
    } else {
      throw new BadRequestException('Categoria não cadastrada.');
    }
  }

  @Post(':_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(@UploadedFile() file, @Param('_id') _id: string) {
    const jogador = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', _id),
    );
    if (!jogador) {
      throw new BadRequestException(`Jogador não encontrado!`);
    }
    const urlFotoJogador = await this.awsService.uploadArquivo(file, _id);
    const atualizarJogadorDto: AtualizarJogadorDto = {};
    atualizarJogadorDto.urlFotoJogador = urlFotoJogador.url;
    this.clientAdminBackend.emit('atualizar-jogador', {
      id: _id,
      jogador: atualizarJogadorDto,
    });
    return this.clientAdminBackend.send('consultar-jogadores', _id);
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    this.logger.log(
      `atualizarJogadorDto: ${JSON.stringify(atualizarJogadorDto)}`,
    );
    const categoria = await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-categorias',
        atualizarJogadorDto.categoria,
      ),
    );
    if (categoria) {
      this.clientAdminBackend.emit('atualizar-jogador', {
        id: _id,
        jogador: atualizarJogadorDto,
      });
    } else {
      throw new BadRequestException('Categoria não cadastrada.');
    }
  }

  @Delete(':_id')
  deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    this.clientAdminBackend.emit('deletar-jogador', _id);
  }
}

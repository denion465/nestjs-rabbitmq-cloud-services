import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriasController } from './categorias/categorias.controller';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [CategoriasController],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}

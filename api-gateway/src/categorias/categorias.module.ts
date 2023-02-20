import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { CategoriasController } from './categorias.controller';

@Module({
  providers: [ProxyRMQModule],
  exports: [CategoriasController],
})
export class CategoriasModule {}

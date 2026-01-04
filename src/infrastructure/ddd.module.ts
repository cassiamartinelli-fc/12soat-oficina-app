import { Module } from '@nestjs/common'

// Tokens para injeção de dependência
export const CLIENTE_REPOSITORY_TOKEN = 'IClienteRepository'
export const VEICULO_REPOSITORY_TOKEN = 'IVeiculoRepository'
export const PECA_REPOSITORY_TOKEN = 'IPecaRepository'
export const SERVICO_REPOSITORY_TOKEN = 'IServicoRepository'
export const ORDEM_SERVICO_REPOSITORY_TOKEN = 'IOrdemServicoRepository'

@Module({
  providers: [
    // Os providers serão adicionados conforme implementamos os repositórios
  ],
  exports: [
    // Os exports serão adicionados conforme implementamos os repositórios
  ],
})
export class DddModule {}

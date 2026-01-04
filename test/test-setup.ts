// Configuração global para testes de integração

// Aumenta o timeout padrão para operações de banco de dados
jest.setTimeout(30000)

// Configuração de logs durante testes
process.env.NODE_ENV = 'test'

// Suprime logs desnecessários durante os testes
const originalConsoleLog = console.log
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

beforeAll(() => {
  // Silencia logs durante os testes, exceto erros importantes
  console.log = jest.fn()
  console.warn = jest.fn()
  console.error = jest.fn((message) => {
    // Mantém apenas erros críticos
    if (message && typeof message === 'string' && message.includes('CRITICAL')) {
      originalConsoleError(message)
    }
  })
})

afterAll(() => {
  // Restaura os logs originais
  console.log = originalConsoleLog
  console.warn = originalConsoleWarn
  console.error = originalConsoleError
})

// Configurações globais para TypeORM em testes
global.testDatabaseConfig = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  logging: false,
  dropSchema: true,
}

// Utilitário para limpar dados entre testes
export const cleanupDatabase = async (repositories: any[]) => {
  for (const repository of repositories) {
    if (repository && typeof repository.clear === 'function') {
      await repository.clear()
    }
  }
}

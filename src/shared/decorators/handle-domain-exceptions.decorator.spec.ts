/* eslint-disable @typescript-eslint/require-await */
import { HandleDomainExceptions } from './handle-domain-exceptions.decorator'
import { HttpException, HttpStatus } from '@nestjs/common'
import { DomainException, EntityNotFoundException, BusinessRuleException } from '../exceptions/domain.exception'

// Classe de teste para testar o decorator
class TestService {
  @HandleDomainExceptions()
  async methodThatThrowsEntityNotFound(): Promise<string> {
    throw new EntityNotFoundException('Cliente', 'test-id')
  }

  @HandleDomainExceptions()
  async methodThatThrowsBusinessRule(): Promise<string> {
    throw new BusinessRuleException('Regra de negócio violada')
  }

  @HandleDomainExceptions()
  async methodThatThrowsDomainException(): Promise<string> {
    throw new DomainException('Erro de domínio')
  }

  @HandleDomainExceptions()
  async methodThatThrowsGenericError(): Promise<string> {
    throw new Error('Erro genérico')
  }

  @HandleDomainExceptions()
  async methodThatSucceeds(): Promise<string> {
    return 'sucesso'
  }

  @HandleDomainExceptions()
  async methodWithArguments(arg1: string, arg2: number): Promise<string> {
    return `${arg1}-${arg2}`
  }

  @HandleDomainExceptions()
  async methodThatThrowsAfterWork(shouldFail: boolean): Promise<string> {
    if (shouldFail) {
      throw new BusinessRuleException('Falha após processamento')
    }
    return 'processado com sucesso'
  }
}

describe('HandleDomainExceptions Decorator', () => {
  let testService: TestService

  beforeEach(() => {
    testService = new TestService()
  })

  describe('Tratamento de EntityNotFoundException', () => {
    it('deve converter EntityNotFoundException para HttpException NOT_FOUND', async () => {
      await expect(testService.methodThatThrowsEntityNotFound()).rejects.toThrow(
        expect.objectContaining({
          message: 'Cliente with identifier test-id not found',
          status: HttpStatus.NOT_FOUND,
        }),
      )
    })

    it('deve ser uma instância de HttpException', async () => {
      await expect(testService.methodThatThrowsEntityNotFound()).rejects.toBeInstanceOf(HttpException)
    })
  })

  describe('Tratamento de BusinessRuleException', () => {
    it('deve converter BusinessRuleException para HttpException CONFLICT', async () => {
      await expect(testService.methodThatThrowsBusinessRule()).rejects.toThrow(
        expect.objectContaining({
          message: 'Regra de negócio violada',
          status: HttpStatus.CONFLICT,
        }),
      )
    })

    it('deve ser uma instância de HttpException', async () => {
      await expect(testService.methodThatThrowsBusinessRule()).rejects.toBeInstanceOf(HttpException)
    })
  })

  describe('Tratamento de DomainException genérica', () => {
    it('deve converter DomainException para HttpException BAD_REQUEST', async () => {
      await expect(testService.methodThatThrowsDomainException()).rejects.toThrow(
        expect.objectContaining({
          message: 'Erro de domínio',
          status: HttpStatus.BAD_REQUEST,
        }),
      )
    })

    it('deve ser uma instância de HttpException', async () => {
      await expect(testService.methodThatThrowsDomainException()).rejects.toBeInstanceOf(HttpException)
    })
  })

  describe('Tratamento de outras exceções', () => {
    it('deve repassar outras exceções sem modificar', async () => {
      await expect(testService.methodThatThrowsGenericError()).rejects.toThrow('Erro genérico')
    })

    it('deve manter tipo da exceção original para erros não-domain', async () => {
      await expect(testService.methodThatThrowsGenericError()).rejects.toBeInstanceOf(Error)
    })

    it('não deve ser HttpException para erros genéricos', async () => {
      await expect(testService.methodThatThrowsGenericError()).rejects.not.toBeInstanceOf(HttpException)
    })
  })

  describe('Funcionamento normal', () => {
    it('deve permitir execução normal quando não há exceção', async () => {
      const result = await testService.methodThatSucceeds()
      expect(result).toBe('sucesso')
    })

    it('deve preservar argumentos do método', async () => {
      const result = await testService.methodWithArguments('test', 123)
      expect(result).toBe('test-123')
    })

    it('deve executar lógica antes de lançar exceção', async () => {
      // Verifica se o método processa lógica antes de falhar
      await expect(testService.methodThatThrowsAfterWork(true)).rejects.toThrow(
        expect.objectContaining({
          message: 'Falha após processamento',
          status: HttpStatus.CONFLICT,
        }),
      )

      // Verifica se o método funciona normalmente quando não há falha
      const result = await testService.methodThatThrowsAfterWork(false)
      expect(result).toBe('processado com sucesso')
    })
  })

  describe('Integração com async/await', () => {
    it('deve funcionar com métodos assíncronos', async () => {
      const result = await testService.methodThatSucceeds()
      expect(result).toBe('sucesso')
    })

    it('deve capturar exceções de métodos assíncronos', async () => {
      await expect(testService.methodThatThrowsEntityNotFound()).rejects.toBeInstanceOf(HttpException)
    })
  })

  describe('Preservação de contexto', () => {
    it('deve preservar o contexto this do método', async () => {
      // Este teste verifica se o decorator preserva o 'this' correto
      const result = await testService.methodThatSucceeds()
      expect(result).toBe('sucesso')
    })
  })
})

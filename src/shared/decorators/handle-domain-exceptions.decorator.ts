import { HttpException, HttpStatus } from '@nestjs/common'
import { DomainException, EntityNotFoundException, BusinessRuleException } from '../exceptions/domain.exception'

export function HandleDomainExceptions() {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      try {
        return await method.apply(this, args)
      } catch (error) {
        if (error instanceof EntityNotFoundException) {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND)
        }

        if (error instanceof BusinessRuleException) {
          throw new HttpException(error.message, HttpStatus.CONFLICT)
        }

        if (error instanceof DomainException) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }

        // Re-throw outras exceções
        throw error
      }
    }

    return descriptor
  }
}

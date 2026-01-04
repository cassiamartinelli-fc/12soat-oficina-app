export class DomainException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainException'
  }
}

export class InvalidValueObjectException extends DomainException {
  constructor(valueObjectName: string, value: any, reason: string) {
    super(`Invalid ${valueObjectName}: ${value}. Reason: ${reason}`)
    this.name = 'InvalidValueObjectException'
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, identifier: string) {
    super(`${entityName} with identifier ${identifier} not found`)
    this.name = 'EntityNotFoundException'
  }
}

export class BusinessRuleException extends DomainException {
  constructor(message: string) {
    super(message)
    this.name = 'BusinessRuleException'
  }
}

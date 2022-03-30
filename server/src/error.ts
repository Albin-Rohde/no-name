import {ValidationError} from "yup";

export class WrappedValidationError extends ValidationError {
  public extra

  constructor(err: ValidationError, extra?: Record<string, string | number | undefined | null>) {
    super(err);
    this.name = this.constructor.name
    this.extra = extra
  }
}

export class ExpectedError extends Error {
  public message
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name
  }
}

export class BadRequestError extends ExpectedError {
  public message
  public name

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    this.message = message
  }
}

export class AuthenticationError extends ExpectedError {
  public message
  public name

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    this.message = message
  }
}

export class GameRequiredError extends ExpectedError {
  public message
  public name

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    this.message = message
  }
}

export class CreateError extends ExpectedError {
  public message
  public name

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    this.message = message
  }
}

export class DbError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends DbError{
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name
  }
}

export class GameRuleError extends ExpectedError {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotAllowedError extends GameRuleError {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class GameStateError extends GameRuleError {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

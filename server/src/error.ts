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
  public extra

  constructor(message: string, extra?: Record<string, string | number | undefined | null>) {
    super(message);
    this.name = this.constructor.name
    this.extra = extra
  }
}

export class BadRequestError extends ExpectedError {
  public message
  public name
  public extra

  constructor(message: string, extra: Record<string, string | number | undefined | null> = {}) {
    super(message, extra)
    this.name = this.constructor.name
    this.extra = extra
    this.message = message
  }
}

export class AuthenticationError extends ExpectedError {
  public message
  public name
  public extra

  constructor(message: string, extra: Record<string, string | number | undefined | null> = {}) {
    super(message, extra)
    this.name = this.constructor.name
    this.extra = extra
    this.message = message
  }
}

export class GameRequiredError extends ExpectedError {
  public message
  public name
  public extra

  constructor(message: string, extra: Record<string, string | number | undefined | null> = {}) {
    super(message, extra)
    this.name = this.constructor.name
    this.extra = extra
    this.message = message
  }
}

export class CreateError extends ExpectedError {
  public message
  public name
  public extra

  constructor(message: string, extra: Record<string, string | number | undefined | null> = {}) {
    super(message, extra)
    this.name = this.constructor.name
    this.extra = extra
    this.message = message
  }
}

export class DbError extends Error {
  public extra

  constructor(message: string, extra: Record<string, string | number | undefined | null> = {}) {
    super(message)
    this.name = this.constructor.name
    this.extra = extra
  }
}

export class NotFoundError extends DbError{
  public extra

  constructor(message: string, extra: Record<string, string | number | undefined | null> = {}) {
    super(message, extra);
    this.name = this.constructor.name
    this.extra = extra
  }
}

export class GameRuleError extends ExpectedError {
  public extra

  constructor(message: string, extra: Record<string, string | number | undefined | null> = {}) {
    super(message)
    this.name = this.constructor.name
    this.extra = extra
  }
}

export class NotAllowedError extends GameRuleError {
  constructor(message: string, extra: Record<string, string | number | undefined | null> = {}) {
    super(message, extra)
    this.name = this.constructor.name
    this.extra = extra
  }
}

export class GameStateError extends GameRuleError {
  constructor(message: string, extra: Record<string, string | number | undefined | null> = {}) {
    super(message, extra)
    this.name = this.constructor.name
    this.extra = extra
  }
}

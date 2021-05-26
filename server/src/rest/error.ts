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

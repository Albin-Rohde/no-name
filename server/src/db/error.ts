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

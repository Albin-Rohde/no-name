export class DbError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends DbError{
  constructor(entity: string, id: string | number) {
    super(`Could not find <${entity.constructor.name}> with id ${id}`);
    this.name = this.constructor.name
  }
}

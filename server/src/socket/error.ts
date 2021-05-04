export class GameRuleError extends Error {
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

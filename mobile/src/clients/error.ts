export class ExpectedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends ExpectedError {
  constructor(message: string) {
    super(message);
  }
}

export class GameRuleError extends ExpectedError {
  constructor(message: string) {
    super(message);
    this.name = 'GameRuleError';
  }
}

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
  }
}

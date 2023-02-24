const ClientError = require('./ClientError');

class AuthenticationsError extends ClientError {
  constructor(message) {
    super(message, 401);
    this._name = 'AuthenticationError';
  }
}

module.exports = AuthenticationsError;

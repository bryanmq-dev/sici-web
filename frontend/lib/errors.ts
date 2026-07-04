export class AuthError extends Error {
  constructor(message = 'No autorizado') {
    super(message);
    this.name = 'AuthError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'No tienes permiso para realizar esta acción') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Recurso no encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message = 'Datos inválidos') {
    super(message);
    this.name = 'ValidationError';
  }
}

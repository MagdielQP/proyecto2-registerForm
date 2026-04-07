const { randomUUID } = require('crypto');
const institutionService = require('./institutionService');
const notificationService = require('./notificationService');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function register(data) {
  const { nombreCompleto, email, institucionEducativa } = data;

  if (!nombreCompleto || !email || !institucionEducativa) {
    throw new Error(
      'Faltan campos requeridos: nombreCompleto, email, institucionEducativa',
    );
  }

  if (!emailRegex.test(email)) {
    throw new Error('El email no es valido');
  }

  institutionService.addIfNotExists(institucionEducativa);

  const docente = {
    id: randomUUID(),
    nombreCompleto,
    email,
    institucionEducativa,
  };

  notificationService.sendConfirmation(docente);

  return docente;
}

module.exports = { register };

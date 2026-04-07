function sendConfirmation(docente) {
  console.log(
    `[NOTIFICACION] Registro exitoso. Estimado/a ${docente.nombreCompleto}, su registro fue completado correctamente. Institucion: ${docente.institucionEducativa}.`,
  );
}

module.exports = { sendConfirmation };

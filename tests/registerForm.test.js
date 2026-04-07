const request = require('supertest');
const app = require('../src/app');
const institutionService = require('../src/services/institutionService');
const notificationService = require('../src/services/notificationService');

jest.mock('../src/services/notificationService');

describe('Teacher Registration API', () => {
  beforeEach(() => {
    institutionService.resetCatalog();
    jest.clearAllMocks();
  });

  // --- FORMULARIO DE REGISTRO ---
  describe('POST /api/register', () => {
    it('registra un docente con exito y retorna 201', async () => {
      const nuevoDocente = {
        nombreCompleto: 'Juan Perez',
        email: 'juan@gmail.com',
        institucionEducativa: 'Colegio SADOSA',
      };

      const res = await request(app).post('/api/register').send(nuevoDocente);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.nombreCompleto).toBe(nuevoDocente.nombreCompleto);
      expect(res.body.email).toBe(nuevoDocente.email);
      expect(res.body.institucionEducativa).toBe(nuevoDocente.institucionEducativa);
    });

    it('retorna 400 si faltan campos requeridos', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({ email: 'docente@gmail.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('retorna 400 si el email es invalido', async () => {
      const res = await request(app).post('/api/register').send({
        nombreCompleto: 'Maria Lopez',
        email: 'no-es-un-email',
        institucionEducativa: 'Colegio Nacional',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    // --- CATALOGO DE INSTITUCIONES ---
    it('agrega una nueva institucion al catalogo si no existe', async () => {
      const nuevoDocente = {
        nombreCompleto: 'Carlos Gomez',
        email: 'carlos@edu.pe',
        institucionEducativa: 'Instituto LAREDO',
      };

      const res = await request(app).post('/api/register').send(nuevoDocente);

      expect(res.statusCode).toBe(201);
      const catalogo = institutionService.getCatalog();
      expect(catalogo).toContain('Instituto LAREDO');
    });

    it('no duplica institucion si ya existe en el catalogo', async () => {
      const docente = {
        nombreCompleto: 'Ana Torres',
        email: 'ana@edu.pe',
        institucionEducativa: 'Universidad Nacional',
      };

      await request(app).post('/api/register').send(docente);

      const catalogo = institutionService.getCatalog();
      const ocurrencias = catalogo.filter((i) => i === 'Universidad Nacional').length;
      expect(ocurrencias).toBe(1);
    });

    // --- NOTIFICACION DE CONFIRMACION ---
    it('envia notificacion de confirmacion al registrar un docente', async () => {
      const docente = {
        nombreCompleto: 'Pedro Ruiz',
        email: 'pedro@edu.pe',
        institucionEducativa: 'Colegio San Juan',
      };

      await request(app).post('/api/register').send(docente);

      expect(notificationService.sendConfirmation).toHaveBeenCalledTimes(1);
      expect(notificationService.sendConfirmation).toHaveBeenCalledWith(
        expect.objectContaining({
          email: docente.email,
          nombreCompleto: docente.nombreCompleto,
        }),
      );
    });
  });

  // --- CATALOGO DE INSTITUCIONES ---
  describe('GET /api/instituciones', () => {
    it('retorna el catalogo de instituciones predefinidas', async () => {
      const res = await request(app).get('/api/instituciones');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });
});

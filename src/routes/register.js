const { Router } = require('express');
const registerService = require('../services/registerService');
const institutionService = require('../services/institutionService');

const router = Router();

router.post('/register', (req, res) => {
  try {
    const docente = registerService.register(req.body);
    res.status(201).json(docente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/instituciones', (req, res) => {
  res.status(200).json(institutionService.getCatalog());
});

module.exports = router;

const express = require('express');
const path    = require('path');
const app     = express();
const port    = process.env.PORT || 3000;

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API de estado del sistema
app.get('/api/status', (req, res) => {
  res.json({
    status:  'HorseBit Backend Node.js Operativo',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Ruta raíz → sirve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(port, () => {
  console.log(`🐎 Servidor HorseBit corriendo en el puerto ${port}`);
});

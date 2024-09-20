const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos (CSS, JS, imágenes, etc.)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

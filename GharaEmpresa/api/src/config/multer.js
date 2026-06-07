const multer = require('multer');

// Almacenamiento EN MEMORIA — nunca toca disco sin validar
const storage = multer.memoryStorage();

// Filtro de extensiones permitidas (primera capa)
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/webp', 
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo Imágenes, PDF o Word.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
    files: 10,                  // Máximo 10 archivos por request
  },
});

module.exports = upload;

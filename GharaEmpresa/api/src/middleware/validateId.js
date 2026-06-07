const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ success: false, message: 'ID inválido. Debe ser un número entero positivo.' });
  }
  next();
};

module.exports = { validateId };

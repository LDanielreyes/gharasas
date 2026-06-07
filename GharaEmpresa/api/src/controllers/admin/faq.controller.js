const prisma = require('../../config/database');

async function getFaqs(req, res, next) {
  try {
    const faqs = await prisma.preguntaFrecuente.findMany({
      orderBy: [{ ordenVisualizacion: 'asc' }, { idFaq: 'desc' }]
    });
    res.json({ success: true, data: faqs });
  } catch (error) {
    next(error);
  }
}

async function createFaq(req, res, next) {
  try {
    const { categoria, pregunta, respuesta, estadoPublicacion, ordenVisualizacion } = req.body;
    const faq = await prisma.preguntaFrecuente.create({
      data: { categoria, pregunta, respuesta, estadoPublicacion, ordenVisualizacion: ordenVisualizacion || 0 }
    });
    res.json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
}

async function updateFaq(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { categoria, pregunta, respuesta, estadoPublicacion, ordenVisualizacion } = req.body;
    const faq = await prisma.preguntaFrecuente.update({
      where: { idFaq: id },
      data: { categoria, pregunta, respuesta, estadoPublicacion, ordenVisualizacion }
    });
    res.json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
}

async function deleteFaq(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    await prisma.preguntaFrecuente.delete({ where: { idFaq: id } });
    res.json({ success: true, message: 'Faq eliminado' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getFaqs, createFaq, updateFaq, deleteFaq };

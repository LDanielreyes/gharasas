const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const logger = require('../../config/logger');
const { saveRawFile, deleteFile } = require('../../services/fileService');

const prisma = new PrismaClient();

const createDescargableSchema = z.object({
  titulo: z.string().min(3),
  descripcion: z.string().optional(),
  categoria: z.string(),
  version: z.string().optional().transform(v => v ? parseInt(v) : 2026),
  tags: z.string().optional()
});

const updateDescargableSchema = z.object({
  titulo: z.string().min(3).optional(),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
  version: z.string().optional().transform(v => v ? parseInt(v) : 2026),
  tags: z.string().optional()
});

const descargablesController = {
  // GET público y admin
  getAll: async (req, res, next) => {
    try {
      const { search, categoria, year } = req.query;
      const where = {};

      if (categoria) where.categoria = categoria;
      if (year) where.version = parseInt(year);
      if (search) {
        where.OR = [
          { titulo: { contains: search } },
          { tags: { contains: search } },
          { descripcion: { contains: search } }
        ];
      }

      const descargables = await prisma.descargable.findMany({
        where,
        orderBy: { idDescargable: 'desc' }
      });

      res.json(descargables);
    } catch (error) {
      next(error);
    }
  },


  // POST bulk admin
  createBulk: async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Se requiere al menos un archivo adjunto." });
      }

      // Validar datos compartidos para todos los archivos subidos
      const validData = createDescargableSchema.parse({
        titulo: "BulkUpload", // Placeholder, se sobrescribe con el nombre original
        categoria: req.body.categoria,
        version: req.body.version,
        tags: req.body.tags
      });

      const creados = [];

      // Procesar de manera secuencial o paralela
      for (const file of req.files) {
        const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        let extension = file.originalname.split('.').pop().toUpperCase();
        if (extension === 'DOCUMENT') extension = 'DOCX';
        
        // El titulo sera el nombre del archivo sin extension
        const originalName = file.originalname;
        const fileTitle = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;

        const rutaArchivo = await saveRawFile(file.buffer, originalName);

        const nuevoDescargable = await prisma.descargable.create({
          data: {
            titulo: fileTitle,
            categoria: validData.categoria,
            version: validData.version,
            tags: validData.tags,
            rutaArchivo,
            tipoArchivo: extension,
            pesoArchivo: fileSizeMb
          }
        });
        creados.push(nuevoDescargable);
      }

      logger.info(`Carga masiva de descargables (${creados.length} archivos)`, { service: 'ghara-api', adminId: req.admin.idAdmin });
      res.status(201).json({ success: true, count: creados.length, data: creados });
    } catch (error) {
      next(error);
    }
  },
  // POST admin
  create: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Se requiere un archivo adjunto." });
      }

      const validData = createDescargableSchema.parse(req.body);

      const fileSizeMb = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
      let extension = req.file.originalname.split('.').pop().toUpperCase();
      if (extension === 'DOCUMENT') extension = 'DOCX'; // fix for long mime name

      // Guardar archivo
      const rutaArchivo = await saveRawFile(req.file.buffer, req.file.originalname);

      const nuevoDescargable = await prisma.descargable.create({
        data: {
          titulo: validData.titulo,
          descripcion: validData.descripcion,
          categoria: validData.categoria,
          version: validData.version,
          tags: validData.tags,
          rutaArchivo,
          tipoArchivo: extension,
          pesoArchivo: fileSizeMb
        }
      });

      logger.info(`Nuevo descargable creado: ${nuevoDescargable.titulo}`, { service: 'ghara-api', adminId: req.admin.idAdmin });
      res.status(201).json(nuevoDescargable);
    } catch (error) {
      next(error);
    }
  },

  // PUT admin
  update: async (req, res, next) => {
    try {
      const idDescargable = parseInt(req.params.id);
      const validData = updateDescargableSchema.parse(req.body);

      const descargable = await prisma.descargable.findUnique({ where: { idDescargable } });
      if (!descargable) return res.status(404).json({ message: "Descargable no encontrado" });

      const dataToUpdate = { ...validData };

      // Si subió un nuevo archivo, reemplazamos el anterior
      if (req.file) {
        await deleteFile(descargable.rutaArchivo); // borrar viejo

        const fileSizeMb = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
        let extension = req.file.originalname.split('.').pop().toUpperCase();
        if (extension === 'DOCUMENT') extension = 'DOCX';
        
        dataToUpdate.rutaArchivo = await saveRawFile(req.file.buffer, req.file.originalname);
        dataToUpdate.tipoArchivo = extension;
        dataToUpdate.pesoArchivo = fileSizeMb;
      }

      const actualizado = await prisma.descargable.update({
        where: { idDescargable },
        data: dataToUpdate
      });

      res.json(actualizado);
    } catch (error) {
      next(error);
    }
  },

  // DELETE admin
  delete: async (req, res, next) => {
    try {
      const idDescargable = parseInt(req.params.id);
      const descargable = await prisma.descargable.findUnique({ where: { idDescargable } });
      if (!descargable) return res.status(404).json({ message: "Descargable no encontrado" });

      await deleteFile(descargable.rutaArchivo);
      await prisma.descargable.delete({ where: { idDescargable } });

      logger.info(`Descargable eliminado: ${idDescargable}`, { service: 'ghara-api', adminId: req.admin.idAdmin });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = descargablesController;

const XLSX = require('xlsx');

/**
 * Genera un buffer de archivo Excel (.xlsx) a partir de datos
 * @param {Array<Object>} data - Array de objetos a exportar
 * @param {string} sheetName - Nombre de la hoja
 * @param {Array<{header: string, key: string}>} columns - Definición de columnas
 * @returns {Buffer} Buffer del archivo xlsx
 */
function generateExcel(data, sheetName, columns) {
  // Mapear datos según columnas definidas
  const rows = data.map((item) => {
    const row = {};
    for (const col of columns) {
      row[col.header] = item[col.key] ?? '';
    }
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Ajustar ancho de columnas
  const colWidths = columns.map((col) => ({
    wch: Math.max(col.header.length, 15),
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

// Columnas predefinidas para PQR
const PQR_COLUMNS = [
  { header: 'Radicado', key: 'radicado' },
  { header: 'Tipo', key: 'tipoSolicitud' },
  { header: 'Nombre', key: 'nombreRemitente' },
  { header: 'Email', key: 'emailRemitente' },
  { header: 'Teléfono', key: 'telefonoRemitente' },
  { header: 'Asunto', key: 'asunto' },
  { header: 'Mensaje', key: 'mensaje' },
  { header: 'Estado', key: 'estadoTicket' },
  { header: 'Fecha Radicado', key: 'fechaRadicado' },
  { header: 'Fecha Resolución', key: 'fechaResolucion' },
];

// Columnas predefinidas para Ventas
const VENTAS_COLUMNS = [
  { header: 'ID Venta', key: 'idVenta' },
  { header: 'Cliente', key: 'nombreCliente' },
  { header: 'Total', key: 'total' },
  { header: 'Canal', key: 'canalCierre' },
  { header: 'Estado', key: 'estadoVenta' },
  { header: 'Fecha', key: 'fechaVenta' },
  { header: 'Productos', key: 'productosResumen' },
];

module.exports = { generateExcel, PQR_COLUMNS, VENTAS_COLUMNS };

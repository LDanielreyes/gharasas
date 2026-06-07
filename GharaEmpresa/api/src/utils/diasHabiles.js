/**
 * Calcula los días hábiles entre dos fechas
 * Excluye sábados, domingos y festivos colombianos
 */
function calcularDiasHabiles(fechaInicio, fechaFin) {
  let count = 0;
  const current = new Date(fechaInicio);
  current.setHours(0, 0, 0, 0);

  const end = new Date(fechaFin);
  end.setHours(0, 0, 0, 0);

  while (current < end) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();

    // Excluir sábados (6) y domingos (0)
    if (day !== 0 && day !== 6) {
      // Excluir festivos colombianos
      if (!esFestivoColombia(current)) {
        count++;
      }
    }
  }

  return count;
}

/**
 * Festivos colombianos (Ley 51 de 1983)
 * Incluye festivos fijos y los que se mueven al lunes siguiente
 */
function esFestivoColombia(fecha) {
  const year = fecha.getFullYear();
  const month = fecha.getMonth(); // 0-indexed
  const day = fecha.getDate();

  // Festivos fijos
  const fijos = [
    [0, 1],   // Año Nuevo
    [4, 1],   // Día del Trabajo
    [6, 20],  // Independencia
    [7, 7],   // Batalla de Boyacá
    [11, 8],  // Inmaculada Concepción
    [11, 25], // Navidad
  ];

  for (const [m, d] of fijos) {
    if (month === m && day === d) return true;
  }

  // Festivos que se mueven al lunes (Ley Emiliani)
  // Se calculan para el año actual
  const festivosMovibles = calcularFestivosMovibles(year);

  return festivosMovibles.some(
    (f) => f.getMonth() === month && f.getDate() === day
  );
}

/**
 * Calcula los festivos movibles de Colombia para un año dado
 * Basados en la Ley Emiliani (se trasladan al lunes siguiente)
 */
function calcularFestivosMovibles(year) {
  const movibles = [];

  // Fechas base que se mueven al lunes
  const baseMovibles = [
    [0, 6],   // Reyes Magos (6 ene)
    [2, 19],  // San José (19 mar)
    [5, 29],  // San Pedro y San Pablo (29 jun)
    [7, 15],  // Asunción (15 ago)
    [9, 12],  // Día de la Raza (12 oct)
    [10, 1],  // Todos los Santos (1 nov)
    [10, 11], // Independencia de Cartagena (11 nov)
  ];

  for (const [month, day] of baseMovibles) {
    movibles.push(moverAlLunes(new Date(year, month, day)));
  }

  // Festivos basados en Pascua
  const pascua = calcularPascua(year);

  // Jueves Santo (Pascua - 3 días)
  const juevesSanto = new Date(pascua);
  juevesSanto.setDate(pascua.getDate() - 3);
  movibles.push(juevesSanto);

  // Viernes Santo (Pascua - 2 días)
  const viernesSanto = new Date(pascua);
  viernesSanto.setDate(pascua.getDate() - 2);
  movibles.push(viernesSanto);

  // Ascensión (Pascua + 43 días, movido al lunes)
  const ascension = new Date(pascua);
  ascension.setDate(pascua.getDate() + 43);
  movibles.push(moverAlLunes(ascension));

  // Corpus Christi (Pascua + 64 días, movido al lunes)
  const corpus = new Date(pascua);
  corpus.setDate(pascua.getDate() + 64);
  movibles.push(moverAlLunes(corpus));

  // Sagrado Corazón (Pascua + 71 días, movido al lunes)
  const sagrado = new Date(pascua);
  sagrado.setDate(pascua.getDate() + 71);
  movibles.push(moverAlLunes(sagrado));

  return movibles;
}

/**
 * Mueve una fecha al lunes siguiente si no cae en lunes
 */
function moverAlLunes(fecha) {
  const day = fecha.getDay();
  if (day === 1) return fecha; // Ya es lunes
  const diff = day === 0 ? 1 : 8 - day;
  const lunes = new Date(fecha);
  lunes.setDate(fecha.getDate() + diff);
  return lunes;
}

/**
 * Calcula la fecha de Pascua usando el algoritmo de Gauss/Meeus
 */
function calcularPascua(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month, day);
}

module.exports = { calcularDiasHabiles };

const prisma = require('./src/config/database');
const { generarSlug } = require('./src/utils/slugGenerator');

const data = `MIRAGE,Xlife 13,ON OFF,Xlife,9000,110V,R410A,13,E,FALSO,Blanco,1126400,DISPONIBLES,
MIRAGE,Xlife 13,ON OFF,Xlife,12000,220V,R410A,13,E,FALSO,Blanco,1240000,DISPONIBLES,
MIRAGE,X32 S17.5,INVERTER,X32,12000,110V,R32,17.5,C,FALSO,Blanco,1350000,DISPONIBLES,
MIRAGE,Magnum 22,INVERTER,Magnum,18000,220V,R410A,22,C,VERDADERO,Blanco,2450000,DISPONIBLES,
MIRAGE,Platinum 21,INVERTER,Platinum,12000,220V,R410A,21,C,FALSO,Gris,1799000,DISPONIBLES,
HISENSE,Perla 13,ON OFF,Perla,12000,110V,R410A,13,E,FALSO,Blanco,1280000,DISPONIBLES,
HISENSE,Uni 20,INVERTER,Uni,24000,220V,R32,20,B,VERDADERO,Blanco,2990000,DISPONIBLES,
HISENSE,Energy Pro X,INVERTER,Energy Pro X,12000,220V,R32,23,A,VERDADERO,Negro,2890000,DISPONIBLES,
HISENSE,Portatil,PORTATIL,Portatil,12000,110V,R32,,,VERDADERO,Blanco,1399000,DISPONIBLES,
MIDEA,Silk 17,INVERTER,Silk,12000,220V,R410A,17,C,FALSO,Blanco,1499000,DISPONIBLES,
MIDEA,Convencional,ON OFF,Convencional,12000,220V,R410A,,,FALSO,Blanco,0,AGOTADO,
PANASONIC,YS,INVERTER,YS,18000,220V,R410A,,C,FALSO,Blanco,2699000,UNA UNIDAD EN BAQ,
MABE,Convencional,ON OFF,Convencional,12000,110V,R410A,13,E,FALSO,Blanco,1280000,DISPONIBLES,
MABE,Premium Espejo,INVERTER,Premium,12000,220V,R32,,B,VERDADERO,Tipo Espejo,2199000,DISPONIBLES,`;

async function run() {
  const lines = data.trim().split('\n');
  
  for (let line of lines) {
    if (!line.trim()) continue;
    
    const [
      marcaStr, modelo, tecnologia, lineaSerie, capacidadBtuStr, voltaje, refrigerante,
      seerStr, claseEnergetica, tieneWifiStr, color, precioContadoStr, estadoInventario, targetSlug // last is trailing comma usually
    ] = line.split(',');

    // Fetch marca
    let marca = await prisma.marca.findFirst({
      where: { nombre: marcaStr.toUpperCase() }
    });

    if (!marca) {
      marca = await prisma.marca.create({ data: { nombre: marcaStr.toUpperCase() } });
    }

    const capacidadBtu = parseInt(capacidadBtuStr, 10);
    const precio = parseFloat(precioContadoStr);
    const seer = seerStr ? parseFloat(seerStr) : null;
    const tieneWifi = tieneWifiStr === 'VERDADERO';

    const slugBase = generarSlug(marca.nombre, tecnologia, modelo, capacidadBtu);
    let slug = slugBase;
    let intento = 1;
    while (true) {
      const exists = await prisma.producto.findUnique({ where: { slug: slug } });
      if (!exists) break;
      slug = `${slugBase}-${intento++}`;
    }

    await prisma.producto.create({
      data: {
        idMarca: marca.idMarca,
        modelo: modelo.trim(),
        tecnologia: tecnologia.trim(),
        lineaSerie: lineaSerie.trim(),
        capacidadBtu,
        voltaje: voltaje.trim(),
        refrigerante: refrigerante ? refrigerante.trim() : null,
        seer,
        claseEnergetica: claseEnergetica ? claseEnergetica.trim() : null,
        tieneWifi,
        color: color.trim(),
        precioContado: precio,
        estadoInventario: estadoInventario.trim(),
        slug: slug
      }
    });
    console.log(`Guardado: ${marca.nombre} - ${modelo}`);
  }
}

run().then(() => {
  console.log('Finalizado.');
  process.exit();
}).catch(console.error);

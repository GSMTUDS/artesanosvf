// const fs = require("fs");
// const path = require("path");
// const { Imagen } = require("../models");

// (async () => {
//   try {
//     const imagenes = await Imagen.findAll();
//     let eliminadas = 0;

//     for (const img of imagenes) {
//       const ruta = path.join(__dirname, "..", img.ruta_archivo);
//       if (!fs.existsSync(ruta)) {
//         console.log("🗑️ Eliminando registro de imagen sin archivo:", img.ruta_archivo);
//         await img.destroy();
//         eliminadas++;
//       }
//     }

//     console.log(`✅ ${eliminadas} imágenes sin archivo eliminadas.`);
//     process.exit();
//   } catch (err) {
//     console.error("❌ Error al limpiar imágenes:", err);
//     process.exit(1);
//   }
// })();

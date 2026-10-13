import fs from 'fs';
import path from 'path';
import assimpjsModule from 'assimpjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assimpjs = assimpjsModule();

const inputFolder = path.join(__dirname, '../frontend/public/models');
const outputFolder = path.join(__dirname, '../frontend/public/models');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath, callback);
        } else {
            callback(fullPath);
        }
    });
}

assimpjs.then((ajs) => {
    const allFiles = [];

    // Recorre todo el directorio y sus subcarpetas y va añadiendo los
    // ficheros uno a uno en el array
    walkDir(inputFolder, (fullPath) => {
        allFiles.push(fullPath);
    });

    const models = allFiles.filter((f) => path.extname(f).toLowerCase() === '.gltf');

    models.forEach((modelPath) => {
        // Obtiene el directorio del modelo
        const modelDir = path.dirname(modelPath);

        // Obtiene el nombre del modelo sin extensión
        const modelName = path.basename(modelPath, '.gltf');

        const gltf = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
        const allBounds = [];

        // Recorremos mallas y sus primitivas para obtener los min/max de los accessors
        gltf.meshes.forEach((m) => {
            m.primitives.forEach((p) => {
                const accessorIdx = p.attributes.POSITION;
                const accessor = gltf.accessors[accessorIdx];
                allBounds.push({
                    min: accessor.min,
                    max: accessor.max,
                });
            });
        });

        // Construye un array con el modelo y el binario si tuviese
        const modelFiles = [modelPath, path.join(modelDir, `${modelName}.bin`)].filter(
            (f) => fs.existsSync(f)
        );

        // Crea una lista de archivos vacía
        const fileList = new ajs.FileList();

        // Lee cada archivo y lo añade a la lista
        modelFiles.forEach((fullPath) => {
            const buffer = fs.readFileSync(fullPath);
            fileList.AddFile(path.basename(fullPath), buffer);
        });

        // Inicia el cronómetro
        const start = process.hrtime.bigint();

        // Convierte el archivo a assjson (el formato JSON interno de Assimp)
        const result = ajs.ConvertFileList(fileList, 'assjson');

        // Para el cronómetro
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1_000_000;


        if (!result.IsSuccess() || result.FileCount() === 0) {
            return;
        }

        // Se obtiene el contenido del JSON generado por Assimp
        const resultFile = result.GetFile(0);
        const jsonContent = new TextDecoder().decode(resultFile.GetContent());

        // Parse del json
        const json = JSON.parse(jsonContent);

        // Arreglar las tangentes porque assimp las cambia a vec3 en lugar de vec4
        json.meshes.forEach((mesh, index) => {
            if (allBounds[index]) {
                mesh.boundingBox = allBounds[index];
            }

            const vertexCount = mesh.vertices.length / 3;

            if (mesh.tangents) {
                const isVec3 = mesh.tangents.length === vertexCount * 3;

                if (isVec3) {

                    const newTangents = [];

                    for (let i = 0; i < vertexCount; i++) {
                        newTangents.push(
                            mesh.tangents[i * 3],
                            mesh.tangents[i * 3 + 1],
                            mesh.tangents[i * 3 + 2],
                            1.0
                        );
                    }

                    mesh.tangents = newTangents;
                }
            }
        });

        // Serializar de nuevo
        const finalJSON = JSON.stringify(json);

        // Se obtiene la ruta relativa para replicar la estructura de carpetas
        const relativeModelPath = path.relative(inputFolder, modelPath);
        const outputPath = path.join(
            outputFolder,
            relativeModelPath.replace('.gltf', '.json')
        );

        // Se escribe el json en la ruta de salida
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, finalJSON);

    });
});
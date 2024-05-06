import multer from "multer";
import { __dirname } from "./utils.js";

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const destinationPath = __dirname + '/Public/uploads';
        console.log('Destination Path:', destinationPath); // Agregar un log para la ruta de destino
        callback(null, destinationPath);
    },
    filename: function (req, file, callback) {
        const fileName = `${Date.now()}-${file.originalname}`;
        console.log('File Name:', fileName); // Agregar un log para el nombre del archivo
        callback(null, fileName);
    }
});

const multerUploader = multer({ storage });

export const multerSingleUploader = multerUploader.single('myfile');
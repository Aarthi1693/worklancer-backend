import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const type = req.params.type;

      let folder = './src/kyc/uploads';

      switch (type) {
        case 'aadhaar':
          folder += '/aadhaar';
          break;

        case 'pan':
          folder += '/pan';
          break;

        case 'selfie':
          folder += '/selfie';
          break;

        default:
          folder += '/others';
      }

      cb(null, folder);
    },

    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);

      cb(null, unique + extname(file.originalname));
    },
  }),
};

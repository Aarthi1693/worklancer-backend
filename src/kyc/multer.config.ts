import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const type = req.params.type;

      let folder = path.join(process.cwd(), 'src', 'kyc', 'uploads');

      switch (type) {
        case 'aadhaar':
          folder = path.join(folder, 'aadhaar');
          break;

        case 'pan':
          folder = path.join(folder, 'pan');
          break;

        case 'selfie':
          folder = path.join(folder, 'selfie');
          break;

        default:
          folder = path.join(folder, 'others');
      }

      // Create folder if it doesn't exist
      fs.mkdirSync(folder, { recursive: true });

      cb(null, folder);
    },

    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + extname(file.originalname));
    },
  }),
};
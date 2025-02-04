import multert from 'multer';
import path from 'path';

const storage = multert.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
});

const upload = multert({ storage }); 

export default upload;
import multer from 'multer';

let langage = '';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        if (file.fieldname === 'script') {
            if (file.originalname.endsWith('.py')) {
                cb(null, `script-${uniqueSuffix}.py`);
            } else if (file.originalname.endsWith('.js')) {
                cb(null, `script-${uniqueSuffix}.js`);
            }
        } else {
            if (file.originalname.endsWith('.txt'))
                cb(null, `input-${uniqueSuffix}.txt`);
            else
                cb(null, `photo-${uniqueSuffix}.png`);
        }
    }
});

export   const upload = multer({ storage: storage });

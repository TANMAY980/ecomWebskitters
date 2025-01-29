
const multer=require('multer')
const path=require('path')
const fs=require('fs')


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'uploads')
    },
    filename: function (req, file, cb) {
        
      const fileName = file.originalname.split(' ').join('-');

      //const extension = FILE_TYPE_MAP[file.mimetype];
      //cb(null, `${fileName}-${Date.now()}.${extension}`)
      const filePath = path.join('uploads', fileName);

      // Check if file already exists
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log('Error deleting file:', err);
          } else {
            console.log('Old file deleted successfully');
          }
        });
      }
      cb(null, `${fileName}`)
      
    }
  })

  const uploadproductImage = multer({ storage: storage })

  module.exports=uploadproductImage
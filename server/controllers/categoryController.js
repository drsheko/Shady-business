var Category = require("../models/categoryModel");
const multer = require("multer");
const { ref, uploadBytes } = require("firebase/storage");
const storage = require("../firebase");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

// Create A new category
exports.addCategory = [
    
  upload.single("photo"),
  async (req, res) => {
    console.log(1,req.body)
    var uploadedFileURL;
    
    const isNameTaken = await Category.findOne({name:req.body.name});
    if(isNameTaken != null){
        return res.status(401).json({success:false, error:'This Category is already in Database'})
    }


    // upload category image
    const file = req.file;
    if (file) {
      const fileName = file.originalname + new Date();
      const imageRef = ref(storage, fileName);
      const metatype = { contentType: file.mimetype, name: file.originalname };
      await uploadBytes(imageRef, file.buffer, metatype)
        .then((snapshot) => {
          uploadedFileURL = `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref._location.bucket}/o/${snapshot.ref._location.path_}?alt=media`;
        })
        .catch((error) => {
            console.log('2r', error)
            res.status(401).json({ error: error })});
    }
    
    // create a new category
    let newCategory = new Category({
      name: req.body.name,
      photo: uploadedFileURL,
    });
    newCategory
      .save()
      .then((category) => {
        return res.status(200).json({ success: true, category });
      })
      .catch((error) => { console.log(2,error)
        return res.status(401).json({ success: false, error });
      });
  },
];

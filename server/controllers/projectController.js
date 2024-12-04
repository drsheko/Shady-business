var Project = require("../models/projectModal");
var User = require("../models/userModel");
const multer = require("multer");
const { ref, uploadBytes } = require("firebase/storage");
const storage = require("../firebase");
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });
// edit PROJECT TITLE
exports.EDIT_PROJECT_TITLE = async (req, res) => {
  try {
    console.log(req.body.projectName);
    let project = await Project.findOneAndUpdate(
      {},
      {
        $set: {
          title: req.body.projectName,
        },
      },
      { new: true }
    );
    return res.status(200).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

// Edit PROJECT Warning banner
exports.EDIT_PROJECT_Warning_Banner = async (req, res) => {
  try {
    console.log(req.body.warningBanner);
    let project = await Project.findOneAndUpdate(
      {},
      {
        $set: {
          "warningBanner.text": req.body.warningBanner.text,
          "warningBanner.display": req.body.warningBanner.display,
        },
      },
      { new: true }
    );
    return res.status(200).json({ success: true, project });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
};

exports.get_Configuration = async (req, res) => {
  try {
    let project = await Project.findOne();
    return res.status(200).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

exports.UPDATE_SLIDE_SHOW = [
  upload.any(),
  async (req, res) => {
    // upload slide images
    var uploadedFileURL = [];
    console.log( req.files)
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      if (file) {
        const fileName = file.originalname + new Date();
        const imageRef = ref(storage, fileName);
        const metatype = {
          contentType: file.mimetype,
          name: file.originalname,
        };
        await uploadBytes(imageRef, file.buffer, metatype)
          .then((snapshot) => {
            uploadedFileURL.push(
              `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref._location.bucket}/o/${snapshot.ref._location.path_}?alt=media`
            );
          })
          .catch((error) => {
            return res.status(401).json({ error: error });
          });
      }else{
        uploadedFileURL.push(null)
      }
    }
    try {
      // save images and links
      let links = req.body.links;
      let data = [];
      for (let i = 0; i < uploadedFileURL.length; i++) {
        let slide = {
          photo: uploadedFileURL[i]===null?req.body.images[i]:uploadedFileURL[i],
          link: links[i]||null,
        };
        data.push(slide);
      }
      let project = await Project.findOneAndUpdate(
        {},
        {
          $set: {
            mainDisplay: data,
          },
        },
        { new: true }
      );
      return res.status(200).json({ success: true, project });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
];

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {
     type: String, required: true , default:"vaporesta"
  },
  warningBanner: {
    display: { type: Boolean, default: true },
    text: { type: String , default:""},
  },
  ageBanner: {
    display: { type: Boolean, default: true },
    text: { type: String , default:""},
  },
  photoAdsBanner: {
    display: { type: Boolean, default: false },
    link: { type: String , default:""},
    photo: { type: String, default:""},
  },
  textAdsBanner: {
    display: { type: Boolean, default: false },
    link: { type: String, default:"" },
    text: { type: String , default:""},
    backgroundColor: { type: String, default: "black" },
    textColor: { type: String, default: "white" },
  },
  mainDisplay: [
    {
      photo: { type: String, default:"" },
      link: { type: String , default:""},
    },
  ],
 
});

module.exports = mongoose.model("project", projectSchema, "projects");

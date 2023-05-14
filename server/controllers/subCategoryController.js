const SubCategory = require("../models/sub_categoryModel");
const Category = require("../models/categoryModel");


// Add SUB_CATEGORY
exports.ADD_SubCatgeory = async (req, res) => {
  let name = req.body.name;
  let description = req.body.description;
  let categoryId = req.body.category;
  let isNameTaken = await SubCategory.findOne({ name: name });
  if (isNameTaken != null) {
    return res.status(401).json({
      success: false,
      error: "This sub-category is already in Database",
    });
  } else {
    let newSub = new SubCategory({
      name: name,
      description: description,
      category: categoryId,
    });
    newSub
      .save()
      .then((subCategory) => {
        Category.findByIdAndUpdate(categoryId, {
          $push: {
            sub_categories: subCategory._id,
          },
        })
          .then(() => {
            return res.status(200).json({ success: true, subCategory });
          })
          .catch((error) => {
            return res.status(200).json({ success: false, error });
          });
      })
      .catch((error) => {
        return res.status(200).json({ success: false, error });
      });
  }
};

 export default function createCategoriesNodes (nodes) { 
    let _nodes = nodes.map((category, i) => {
      if (category.sub_categories.length === 0) {
        let products = category.products.map((product, p) => {
          let productNode = {
            key: `${i}-${p}`,
            data: { ...product, status: "product" },
          };
          return productNode;
        });
        let categoryNode = {
          key: `${i}`,
          data: {
            _id: category._id,
            status: "category",
            name: category.name,
            photo: category.photo,
            subCategories: category.sub_categories,
            products: category.products,
          },
          children: products,
        };
        return categoryNode;
      } else {
        let sub = category.sub_categories;
        let allProducts = category.products;
        let subCategoriesProducts = [];
        let subCategoryNodes = sub.map((el, j) => {
          let products = el.products.map((product, p) => {
            let productNode = {
              key: `${i}-${j}-${p}`,
              data: { ...product, status: "product" },
            };
            return productNode;
          });
          let subCategoryProducts = el.products;
          subCategoriesProducts = [...subCategoryProducts];
          let subCategoryNode = {
            key: `${i}-${j}`,
            data: {
              _id: el._id,
              status: "subCategory",
              name: el.name,
              photo: el.photo,
              description:el.description,
              products: el.products,
              category: el.category,
            },
            children: products,
          };
          return subCategoryNode;
        });
        let otherProducts = allProducts.filter(
          (p) => !subCategoriesProducts.includes(p)
        );
        let otherProductsNodes = otherProducts.map((product, p) => {
          let productNode = {
            key: `${i}-${p}-*`,
            data: { ...product, status: "product" },
          };
          return productNode;
        });
        let childrenNodes = [...subCategoryNodes, ...otherProductsNodes];
        category = {
          key: `${i}`,
          data: {
            _id: category._id,
            status: "category",
            name: category.name,
            photo: category.photo,
            subCategories: category.sub_categories,
            products: category.products,
          },
          children: childrenNodes,
        };
        return category;
      }
    });
    return _nodes
  };
  
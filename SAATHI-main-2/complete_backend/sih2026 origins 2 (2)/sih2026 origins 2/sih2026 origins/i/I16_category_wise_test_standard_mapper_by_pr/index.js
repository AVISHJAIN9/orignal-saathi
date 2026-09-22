/**
 * I16: Category-Wise Test Standard Mapper by Product
 * MERN Stack Service - Maps global product categories to mandatory Indian Standards.
 */

class CategoryWiseTestStandardMapperService {
  mapCategory(productCategory = "Lithium-Ion Battery") {
    const p = productCategory.toLowerCase();
    let result = {
      standard: "IS 16046 (Part 2):2018 / IEC 62133-2",
      title: "Secondary Cells and Batteries Containing Alkaline Electrolytes",
      scheme: "Scheme-II (MeitY CRS)",
      qco: "Electronics and Information Technology Goods Order"
    };

    if (p.includes('cement')) {
      result = {
        standard: "IS 269:2015",
        title: "Ordinary Portland Cement 43 Grade",
        scheme: "Scheme-I (ISI Mark)",
        qco: "Cement Quality Control Order"
      };
    } else if (p.includes('water')) {
      result = {
        standard: "IS 14543:2016",
        title: "Packaged Drinking Water",
        scheme: "Scheme-I (ISI Mark)",
        qco: "Packaged Drinking Water QCO"
      };
    } else if (p.includes('solar')) {
      result = {
        standard: "IS 14286:2010 / IEC 61215",
        title: "Crystalline Silicon Terrestrial Photovoltaic (PV) Modules",
        scheme: "Scheme-I / MNRE Solar Mandate",
        qco: "Solar Photovoltaics Goods Order"
      };
    }

    return {
      queried_category: productCategory,
      ...result,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  CategoryWiseTestStandardMapperService
};

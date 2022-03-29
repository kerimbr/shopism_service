
class Products{
    constructor(product_id,category_id,image_id,brand_id,name,price,description,discount_rate){
        this.product_id = product_id;
        this.category_id = category_id;
        this.image_id = image_id;
        this.brand_id = brand_id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.discount_rate = discount_rate;
    }
}

module.exports = Products;
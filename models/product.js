const products = [];
module.exports = class Product{
    constructor(t){
        this.title = t
    }

    //save the product into the product array
    save(){
        products.push(this);
    }

    static fetchAll() {
        return products;
    }
}
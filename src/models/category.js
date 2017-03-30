import bookshelf from '../config/bookshelf';

let Category = bookshelf.model('Category', {
    tableName: 'item_category',
    idAttribute: 'category_id',
    hasTimestamps: false
});

let CategoryCollection = bookshelf.collection('Category', {
    model: Category
});


export default Category;
export {Category as model, CategoryCollection as collection};
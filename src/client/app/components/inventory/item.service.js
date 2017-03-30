function ItemService($resource) {
    var Item = $resource('/api/item/', null,
        {
            'update': { method: 'PUT' }
        }
    );
    return {
        getItems: function(params) {
            return Item.get(params || {}).$promise
                .then(function (result) {
                    console.log(result);
                    if(result.success) return result.results;

                    return [];
                });
        },
        commit: function(items) {
            return Item.save(items).$promise
        },
        Item$: Item
        /*getArticleById: function (key) {
            return Article.get({articleID: key}).$promise
                .then(function (result) {
                    if(result.success) return result.results;

                    console.log(result);

                    return [];
                });
        },
        postArticle: function(data) {
            return Article.save(data).$promise
        },
        updateArticle: function(id, data) {
            return Article.update(id, data).$promise
        },
        deleteArticle: function(data) {
            return Article.remove(data).$promise
        }*/
    }
}

ItemService.$inject = ['$resource'];

angular
    .module('components.inventory')
    .factory('ItemService', ItemService);
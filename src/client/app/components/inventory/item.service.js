function ItemService($resource) {
    const Item = $resource('/api/item/', null,
        {
            'update': { method: 'PUT' }
        }
    );
    const ItemCategory = $resource('/api/category/', null);
    return {
        getItems: function(params) {
            return Item.get(params || {}).$promise
                .then(function (result) {
                    console.log(result);
                    if(result.success) return result.results;

                    return [];
                })
                .catch(function(err){
                    console.error(err);
                });
        },
        getCategories: function() {
            return ItemCategory.get().$promise
                .then(function (result) {
                    if(result.success) return result.results;

                    return [];
                });
        },
        commit: function(mode, items) {
            return Item.save({mode, items}).$promise
        },
        Item$: Item
    }
}

ItemService.$inject = ['$resource'];

angular
    .module('components.inventory')
    .factory('ItemService', ItemService);
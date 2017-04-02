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
    }
}

ItemService.$inject = ['$resource'];

angular
    .module('components.inventory')
    .factory('ItemService', ItemService);
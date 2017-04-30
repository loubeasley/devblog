class InventoryItem {
    constructor(session, item_id) {
        if (!session) return {};
        if (!item_id) return {};

        this._session = session;
        //this._original = obj;
        this.item_id = item_id;
        this._dirty = false;
        this._dirtyCount = 0;
        this._changes = {};
    }

    loadFromHistory(history) {
        this._changes = history;
    }

    get _original() {
        return this._session.InventoryService.masterItemCache[this.item_id];
    }

    get name() {
        return this._changes['name'] || this._original['name'];
    }

    set name(newName) {
        if(newName === this._original['name']) delete this._changes['name'];
        else this._changes['name'] = newName;
    }

    get quantity() {
        return this._original['quantity'] || 0; //this._original['quantity'];
    }

    set quantity(num) {
        let mod = num - this._original['quantity'];

        if(mod === 0) return;

        if(!this._changes['quantity']) this._changes['quantity'] = 0;

        this._changes['quantity'] += mod;

        if(this._changes['quantity'] + this._original['quantity'] < 0)
            this._changes['quantity'] -= (this._changes['quantity'] + this._original['quantity']);

        if(this._changes['quantity'] === 0) delete this._changes['quantity'];

        this._session.save();
    }

    isDirty() {
        return Object.keys(this._changes).length > 0;
    }

    toJSON() {
        return this._changes || null;
    }


}

class ItemHistoryEntry {
    constructor(InventoryService, mode) {
        this.allItems = {};
        this.lastSavedHistory = {};
        this.currentHistory = {};
        this.inProgress = false;
        this.mode = mode;
        this.InventoryService = InventoryService;
        this.lsid = '_invSession_' + this.mode;
    }

    init(rawItems) {
        this.allItems = {};
        rawItems.forEach((item) => {
            this.allItems[item.item_id] = new InventoryItem(this, item.item_id);
        });
    }

    getItem(id) {
        return this.allItems[id];
    }

    save() {
        this.lastSavedHistory = this.currentHistory;
        localStorage.setItem(this.lsid, JSON.stringify(this.allItems));
        this.currentHistory = JSON.parse(localStorage.getItem(this.lsid));
        console.log(this.lastSavedHistory);
    }

    start() {
        if (this.inProgress) return;

        this.inProgress = true;
    }

    load() {
        if (!localStorage.getItem(this.lsid)) this.save();
        else {
            let savedHistory = JSON.parse(localStorage.getItem(this.lsid));
            for(let key in savedHistory) {

                if(!this.allItems[key]) continue;
                this.allItems[key].loadFromHistory(savedHistory[key])
            }
        }

        this.start();
    }

    reset() {
        this.inProgress = false;
        localStorage.setItem(this.lsid, null);
        this.allItems = {};
        this.currentHistory = {};
    }
}

class InventoryService {
    constructor(ItemService, $rootScope) {
        this.$rootScope = $rootScope;
        this.history = {
            shrink: new ItemHistoryEntry(this, 'shrink'),
            order: new ItemHistoryEntry(this, 'order'),
            sale: new ItemHistoryEntry(this, 'sale')
        };

        this._mode = 'order';
        this.ItemService = ItemService;
        this.masterItemCache = {};

    }

    set mode(newMode) {
        this._mode = newMode;
        this.$rootScope.$broadcast('inventory.mode.change', newMode);
    }

    get mode() {
        return this._mode;
    }

    init(rawItems) {

        this.refresh(rawItems);
        this.history.shrink.init(rawItems);
        this.history.order.init(rawItems);
        this.history.sale.init(rawItems);
    }

    getAllItems() {
        return this.history[this.mode].allItems;
    }

    getModeHistory() {
        return this.history[this.mode];
    }

    getItem(id) {
        return this.history[this.mode].allItems[id];
    }

    save() {
        this.history[this.mode].save();
    }

    start() {
        this.history[this.mode].start();
    }

    refresh(rawItems) {
        rawItems.forEach((item) => {
            if(!item) return;
            this.masterItemCache[item.item_id] = item;
        });
    }

    load() {
        this.history.shrink.load();
        this.history.order.load();
        this.history.sale.load();
    }

    reset() {
        this.history[this.mode].reset();
    }

    commit() {
        this.save();
        return this.ItemService.commit(this.mode, this.history[this.mode].currentHistory)
            .then((result)=>{
                this.reset();

                return this.history[this.mode];
            });

    }

    get $inject() {
        return ['ItemService', '$rootScope'];
    }
}

angular
    .module('components.inventory')
    .factory('InventoryService', (ItemService, $rootScope)=> new InventoryService(ItemService, $rootScope));
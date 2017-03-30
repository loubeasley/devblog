class InventoryItem {
    constructor(session, obj) {
        if (!session) return {};
        if (!obj) return {};

        this._session = session;
        this._original = obj;
        this._dirty = false;
        this._dirtyCount = 0;
        this._changes = {};



        /* const self = Object.create(obj);
         self.freeze();
         Object.assign(this, self);*/
        /*this.name = obj.name;
         this.quantity = obj.quantity;
         this.category = obj.category;
         this.item_id = obj.item_id;
         this.description = obj.description;
         this.unit = obj.unit;*/
    }

    loadFromHistory(history) {
        this._changes = history;
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

    /*mod(num) {
     if(num === 0) return;

     this.change += num;

     if(this.change + this.quantity < 0) this.change -= (this.change + this.quantity);

     if(this.change !== 0) this.dirty = true;
     }*/


}

class InventoryService {
    constructor(ItemService) {
        this.allItems = {};
        this.lastSavedHistory = {};
        this.currentHistory = {};
        this.inProgress = false;
        this.ItemService = ItemService;
    }

    init(rawItems) {
        this.allItems = {};
        rawItems.forEach((item) => {
            this.allItems[item.item_id] = new InventoryItem(this, item);
        });
    }

    getItem(id) {
        return this.allItems[id];
    }

    save() {
        this.lastSavedHistory = this.currentHistory;
        localStorage.setItem('_invSession', JSON.stringify(this.allItems));
        this.currentHistory = JSON.parse(localStorage.getItem('_invSession'));
        console.log(this.lastSavedHistory);
    }

    start() {
        if (this.inProgress) return;

        this.inProgress = true;
    }

    load() {
        if (!localStorage.getItem('_invSession')) this.save();
        else {
            let savedHistory = JSON.parse(localStorage.getItem('_invSession'));
            for(let key in savedHistory) {

                if(!this.allItems[key]) continue;
                this.allItems[key].loadFromHistory(savedHistory[key])
            }
        }

        this.start();
    }

    reset() {
        this.inProgress = false;
        localStorage.setItem('_invSession', null);
        localStorage.clear();
        this.allItems = {};
        this.currentHistory = {};
    }

    commit() {
        this.save();
        return this.ItemService.commit(this.currentHistory)
            .then((result)=>{
                this.reset();
                return result;
            });

    }

    get $inject() {
        return ['ItemService'];
    }
}


angular
    .module('components.inventory')
    .factory('InventoryService', (ItemService)=> new InventoryService(ItemService));
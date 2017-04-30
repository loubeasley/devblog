import Promise from 'bluebird';
import Item from '../models/item';
import ItemAudit from '../models/itemAudit';
import Cycle from '../models/cycle';

class StoreSim {
    constructor() {
        this.interval = null;
        this.currentCycle = null;

        new Cycle().getCurrent()
            .then((currentCycle) => {
                this.currentCycle = currentCycle;
                this.interval = setInterval(this.update.bind(this), 10000)
            });
    }

    update() {
        if (!this.currentCycle) return;

        if(Math.floor(Math.random() * 100) < 75) return;

        let type = Math.floor(Math.random() * 100) > 75 ? 'shrink' : 'sale';
        let amount = -(Math.floor(Math.random() * 2) + 1);
        let chosenItem = {};

        new Item().where('quantity', '>', Math.abs(amount)).fetchAll()
            .then((results) => {
                results.shuffle();
                results = results.toJSON();
                chosenItem = (results[Math.floor(Math.random() * results.length)]);

                if(!chosenItem) return null;

                return new Item({item_id: chosenItem.item_id})
                    .fetch({require: true})
                    .then((item) => {
                        let obj = {
                            item_id: chosenItem.item_id,
                            quantity: amount
                        };
                        if (!item) return null;

                        obj['quantity'] = item.attributes.quantity + obj.quantity;

                        return item.save(obj);
                    })
                    .then((result) => {
                        if (!result) return null;

                        console.log('sim:' + type + ' ' + amount + ' ' + chosenItem.name);

                        return ItemAudit.create({
                            cycle_id: this.currentCycle.attributes.cycle_id,
                            item_id: chosenItem.item_id,
                            sell_price: chosenItem.sell_price,
                            cost: chosenItem.cost,
                            audit_type: type,
                            created_by: 2 || null,
                            change: amount
                        });
                    });
            })


    }
}

export default StoreSim;
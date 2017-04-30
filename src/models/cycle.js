import bookshelf from '../config/bookshelf';
import * as _Joi from 'joi';
import _modelbase from 'bookshelf-modelbase';

let Joi = _Joi.default;
let ModelBase = _modelbase(bookshelf);

let Cycle = ModelBase.extend({
    tableName: 'v_cycles',
    idAttribute: 'cycle_id',

    hasTimestamps: false,

    validate: {
        end_date: Joi.date(),
        start_date: Joi.date(),
        cycle_id: Joi.number().positive().min(1),
        did_inventory: Joi.boolean(),
        did_order: Joi.boolean(),
        ended: Joi.boolean()
    },

    getCurrent: function () {
        // options = extend({require: true}, options);
        return this.query({where: {ended: false}}).fetch({})
    }

});

let CycleCollection = bookshelf.collection('Cycle', {
    model: Cycle
});

export default Cycle;
export {Cycle as model, CycleCollection as collection};
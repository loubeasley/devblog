import {Router} from 'express';
import * as auth from '../middleware/auth';
import Cycle from '../models/cycle';
import ItemAudit from '../models/itemAudit';
import * as Promise from 'bluebird';
import * as _Joi from 'joi';
import * as _ from "lodash";
import bookshelf from '../config/bookshelf';


let Joi = _Joi.default;
let router = Router();

router.route('/totals')
    .get(function (req, res) {
        let results = {};

        bookshelf.knex
            .select('*')
            .from("v_audit_report_totals")
            .leftJoin('cycles', 'v_audit_report_totals.cycle_id', 'cycles.cycle_id' )
            .then((report) => {
                results = report;
                return new Cycle().fetchAll()
            })
            .then((cycles) => {

                let cycleColl = {};
                let obj = {};
                let defaults = {
                    "cycle_id": 0,
                    "audit_type": "",
                    "avg_sell_price": 0,
                    "avg_cost": 0,
                    "total_change": 0,
                    "total_cost": 0,
                    "total_sales": 0
                };
                cycles.toJSON().forEach((cycle) => {
                    obj[cycle.cycle_id] = {
                        shrink: _.defaults({cycle_id: cycle.cycle_id, audit_type: 'shrink', end_date: cycle.end_date}, defaults),
                        order: _.defaults({cycle_id: cycle.cycle_id, audit_type: 'order', end_date: cycle.end_date}, defaults),
                        sale: _.defaults({cycle_id: cycle.cycle_id, audit_type: 'sale', end_date: cycle.end_date}, defaults)
                    };

                    cycleColl[cycle.cycle_id] = cycle;
                });

                results.forEach((result) => {
                    obj[result.cycle_id][result.audit_type] = result;
                    cycleColl[result.cycle_id][result.audit_type] = Math.abs(result.total_change);

                    console.log(result);
                    if(result.audit_type === 'sale' &&  !cycleColl[result.cycle_id]['total_sales']) cycleColl[result.cycle_id]['total_sales'] = Math.abs(result.total_sales);
                    if(result.audit_type === 'order' &&  !cycleColl[result.cycle_id]['total_cost']) cycleColl[result.cycle_id]['total_cost'] = Math.abs(result.total_cost);
                    if(result.audit_type === 'shrink' &&  !cycleColl[result.cycle_id]['total_loss']) cycleColl[result.cycle_id]['total_loss'] = Math.abs(result.total_sales);

                    if(result.audit_type === 'sale' &&  !cycleColl[result.cycle_id]['total_profit']) cycleColl[result.cycle_id]['total_profit'] = Math.abs(result.total_profit);
                    if(result.audit_type === 'order' &&  !cycleColl[result.cycle_id]['max_profit_from_order']) cycleColl[result.cycle_id]['max_profit_from_order'] = Math.abs(result.total_profit);
                    if(result.audit_type === 'shrink' &&  !cycleColl[result.cycle_id]['profit_loss']) cycleColl[result.cycle_id]['profit_loss'] = Math.abs(result.total_profit);
                });

                let cycleslist = [];

                let shrink = {
                    "name": "Shrink",
                    "data": [],
                    "id": "shrink"
                };

                let order = {
                    "name": "Order",
                    "data": [],
                    "id": "order"
                };

                let sale = {
                    "name": "Sale",
                    "data": [],
                    "id": "sale"
                };

                _.forEach(obj, function(val, key) {
                    //let date = new Date(val.shrink.end_date).toDateString();

                    cycleslist.push(key);

                    shrink.data.push({
                        x: val.shrink.cycle_id,
                        y: Math.abs(val.shrink.total_change)
                    });

                    order.data.push({
                        x: val.order.cycle_id,
                        y: Math.abs(val.order.total_change)
                    });

                    sale.data.push({
                        x: val.sale.cycle_id,
                        y: Math.abs(val.sale.total_change)
                    });
                });

                let chart = {
                    "chart": {
                        "type": "line"
                    },
                    xAxis: {
                        type: 'category',
                        name: 'Cycle'
                        //type: 'datetime',
                        /*,
                        labels: {
                            formatter: function() {
                                return Highcharts.dateFormat('%a %d %b', this.value);
                            }
                        },*/
                    },
                    /*"plotOptions": {
                        "series": {
                            keys: ['x', 'y']
                        }
                    },*/
                    "series": [
                        shrink, order, sale
                    ],
                    "title": {
                        "text": "Units by Cycle"
                    }
                };

                res.json({
                    success: true,
                    results: chart,
                    cycles: _.values(cycleColl)
                })
            })

    });

export default router;
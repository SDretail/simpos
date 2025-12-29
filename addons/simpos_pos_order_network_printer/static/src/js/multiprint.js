/** @odoo-module */

import models from 'point_of_sale.models';
import NetworkPrinter from './printers';
import 'pos_restaurant.multiprint';

models.load_fields("restaurant.printer", ["network_printer_ip"]);

var _super_posmodel = models.PosModel.prototype;

models.PosModel = models.PosModel.extend({
    create_printer: function (config) {
        if (config.printer_type === "network_printer") {
            return new NetworkPrinter(config.network_printer_ip);
        } else {
            return _super_posmodel.create_printer.apply(this, arguments);
        }
    },
});
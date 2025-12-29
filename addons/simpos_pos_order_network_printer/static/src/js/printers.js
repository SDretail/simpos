/** @odoo-module */

import core from "web.core";
import Printer from "point_of_sale.Printer";

var PrinterMixin = Printer.PrinterMixin;

var NetworkPrinter = core.Class.extend(PrinterMixin, {
init: function (ip) {
    PrinterMixin.init.call(this, arguments);
    this.ip = ip;
},

/**
 * @override
 */
send_printing_job: function (img) {
    if (typeof simpos !== "undefined") {
    var ip = this.ip;
    javascript: simpos.printRestaurantOrder(ip + "SIMPOS" + img);
    }
},
_onIoTActionFail: function () {},
_onIoTActionResult: function () {},
});

export default NetworkPrinter;


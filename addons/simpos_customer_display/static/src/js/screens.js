/** @odoo-module */

import screens from 'point_of_sale.screens';

var OrderWidget = screens.OrderWidget;

OrderWidget.include({
    set_value: function(val) {
        var order = this.pos.get_order();
        if (order.get_selected_orderline()) {
            this._super(val);
            this.pos.simpos_send_current_order_to_customer_facing_display();
        }
    },
});


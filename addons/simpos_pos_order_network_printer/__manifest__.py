# -*- coding: utf-8 -*-
{
    'name': "Simpos Order Network Printer",

    'summary': """
        Simpos Order Network Printer""",

    'description': """
        Simpos Order Network Printer
    """,

    'author': "Hieu Tran",
    'website': "http://www.youngtailors.com",
    'category': 'Uncategorized',
    'version': '19.0.0.1',
    'depends': ['pos_restaurant'],

    'assets': {
        'point_of_sale.assets': [
            'simpos_pos_order_network_printer/static/src/js/multiprint.js',
            'simpos_pos_order_network_printer/static/src/js/printers.js',
            'simpos_pos_order_network_printer/static/src/js/screens.js',
            'simpos_pos_order_network_printer/static/src/xml/multiprint.xml',
        ],
    },
    'data': [
        'views/views.xml',
        'views/pos_restaurant_views.xml',
    ],
}

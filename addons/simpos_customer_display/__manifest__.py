# -*- coding: utf-8 -*-
{
    'name': "Simpos Customer Display",

    'summary': """
        Simpos Customer Display""",

    'description': """
        Simpos Customer Display
    """,

    'author': "Hieu Tran",
    'website': "https://youngtailors.com",

    'category': 'Uncategorized',
    'version': '19.0.0.1',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale.assets': [
            'simpos_customer_display/static/src/js/chrome.js',
            'simpos_customer_display/static/src/js/models.js',
            'simpos_customer_display/static/src/js/screens.js',
            'simpos_customer_display/static/src/xml/*.xml',
        ],
    },
    'data': [
        'views/simpos_customer_display_view.xml'
    ],
}

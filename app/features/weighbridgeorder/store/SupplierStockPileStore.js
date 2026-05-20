Ext.define('WeighbridgeOrder.store.SupplierStockPileStore', {
    extend: 'Ext.data.Store',

    requires: [
        'WeighbridgeOrder.model.StockPileModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
			autoLoad: false,
            model: 'WeighbridgeOrder.model.StockPileModel',
            remoteSort: true,
            storeId: 'SupplierStockPileStore',
            proxy: {
                type: 'ajax',
                actionMethods: {
                    read: 'POST'
                },
                batchActions: false,
                api: {
                    read: Utils.serverUrl+'data/service.php?Service=WeighbridgeOrderStockPile_List'
                },
                simpleSortMode: true,
                url: 'dummy.php',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});
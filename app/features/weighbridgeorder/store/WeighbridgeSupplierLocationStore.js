Ext.define('WeighbridgeOrder.store.WeighbridgeSupplierLocationStore', {
    extend: 'Ext.data.Store',

    requires: [
        'WeighbridgeOrder.model.WeighbeidgeLocationModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'WeighbridgeOrder.model.WeighbeidgeLocationModel',
            remoteSort: true,
            storeId: 'WeighbridgeSupplierLocationStore',
            proxy: {
                type: 'ajax',
                actionMethods: {
                    read: 'POST'
                },
                batchActions: false,
                api: {
                    read: Utils.serverUrl+'data/service.php?Service=WeighbridgeLocation_Lookup'
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
Ext.define('WeighbridgeOrder.store.HaulierVehicleAvailableStore', {
    extend: 'Ext.data.Store',

    requires: [
        'WeighbridgeOrder.model.HaulierVehicleModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'WeighbridgeOrder.model.HaulierVehicleModel',
            remoteSort: true,
            storeId: 'HaulierVehicleAvailableStore',
            proxy: {
                type: 'ajax',
                actionMethods: {
                    read: 'POST'
                },
                batchActions: false,
                api: {
                    read: Utils.serverUrl+'data/service.php?Service=WeighbridgeOrderHaulierVehicles_Available'
                },
                extraParams: {
                    User: userInfo.username
                },
                simpleSortMode: true,
                url: 'dummy.php',
                reader: {
                    type: 'json',
                    root: 'data'
                },
                listeners: {
                    exception: {
                        fn: me.onAjaxException,
                        scope: me
                    }
                }
            }
        }, cfg)]);
    },

    onAjaxException: function(proxy, response, operation, eOpts) {
        Utils.proxyError(proxy, response, operation);
    }

});
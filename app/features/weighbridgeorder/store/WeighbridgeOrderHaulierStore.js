Ext.define('WeighbridgeOrder.store.WeighbridgeOrderHaulierStore', {
    extend: 'Ext.data.Store',

    requires: [
        'WeighbridgeOrder.model.WeighbridgeOrderHaulierModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'WeighbridgeOrder.model.WeighbridgeOrderHaulierModel',
            remoteSort: true,
            storeId: 'WeighbridgeOrderHaulierStore',
            //groupField: 'HaulierName',
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'POST',
                    update: 'POST',
                    destroy: 'POST'
                },
                batchActions: false,
                api: {
                    create: Utils.serverUrl+'data/service.php?Service=WeighbridgeOrderHaulier_Save',
                    read: Utils.serverUrl+'data/service.php?Service=WeighbridgeOrderHaulier_List',
                    update: Utils.serverUrl+'data/service.php?Service=WeighbridgeOrderHaulier_Save',
                    destroy: Utils.serverUrl+'data/service.php?Service=WeighbridgeOrderHaulier_Save'
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
                writer: {
                    type: 'json',
                    encode: true,
                    root: 'Params'
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
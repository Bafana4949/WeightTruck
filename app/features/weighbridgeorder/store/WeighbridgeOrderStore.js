Ext.define('WeighbridgeOrder.store.WeighbridgeOrderStore', {
    extend: 'Ext.data.Store',

    requires: [
        'WeighbridgeOrder.model.WeighbridgeOrderModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'WeighbridgeOrder.model.WeighbridgeOrderModel',
            remoteSort: true,
            storeId: 'WeighbridgeOrderStore',
            groupField: 'WeighbridgeName',
            pageSize: 15,
			sorters: [{
                direction: 'ASC',
                property: 'WeighbridgeName'
            }],
            proxy: {
                type: 'ajax',
               /* actionMethods: {
                    create: 'POST',
                    read: 'POST',
                    update: 'POST',
                    destroy: 'POST'
                },*/
                batchActions: false,
                api: {
                    create: Utils.serverUrl+'data/service.php?Service=WeighbridgeOrder_Save',
                    read: Utils.serverUrl+'data/service.php?Service=WeighbridgeOrder_List',
                    update: Utils.serverUrl+'data/service.php?Service=WeighbridgeOrder_Save',
                    destroy: Utils.serverUrl+'data/service.php?Service=WeighbridgeOrder_Save'
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
                    root: 'Params',
                    writeAllFields: true,
                    getRecordData: function(record) {
                        var data = record.data;
                        // Map ThresholdTons to Threshold for the stored procedure
                        if (data.ThresholdTons !== undefined) {
                            data = Ext.apply({}, data); // Clone to avoid modifying original
                            data.Threshold = data.ThresholdTons;
                            delete data.ThresholdTons;
                        }
                        return data;
                    }
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
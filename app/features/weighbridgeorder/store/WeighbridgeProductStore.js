Ext.define('WeighbridgeOrder.store.WeighbridgeProductStore', {
    extend: 'Ext.data.Store',

    requires: [
        'WeighbridgeOrder.model.WeighbridgeProductModel'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'WeighbridgeOrder.model.WeighbridgeProductModel',
            storeId: 'WeighbridgeProductStore',
			proxy: {
				type: 'ajax',
				actionMethods: {
					read: 'POST'
				},
				batchActions: false,
				api: {
					read: Utils.serverUrl+'data/service.php?Service=WeighbridgeProduct_Lookup'
				},
				url: 'dummy.php',
				reader: {
					type: 'json',
					root: 'data'
				}
			}
        }, cfg)]);
    }
});
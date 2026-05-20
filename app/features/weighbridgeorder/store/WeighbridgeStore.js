Ext.define('WeighbridgeOrder.store.WeighbridgeStore', {
    extend: 'Ext.data.Store',

    requires: [
        'WeighbridgeOrder.model.WeighbridgeModel'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'WeighbridgeOrder.model.WeighbridgeModel',
            remoteSort: true,
            storeId: 'WeighbridgeStore'
        }, cfg)]);
    }
});
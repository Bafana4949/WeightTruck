Ext.define('WeighbridgeOrder.store.WeighbridgeSubcontractorStore', {
    extend: 'Ext.data.Store',

    requires: [
        'WeighbridgeOrder.model.WeighbridgeOrganisationModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'WeighbridgeOrder.model.WeighbridgeOrganisationModel',
            //remoteSort: true,
            storeId: 'WeighbridgeSubcontractorStore',
            proxy: {
                type: 'ajax',
                actionMethods: {
                    read: 'POST'
                },
                batchActions: false,
                api: {
                    read: Utils.serverUrl+'data/service.php?Service=WeighbridgeOrganisation_Lookup'
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
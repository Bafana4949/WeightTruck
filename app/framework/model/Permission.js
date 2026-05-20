Ext.define('Framework.model.Permission', {
    extend: 'Ext.data.Model',

    fields: [
		{
            name: 'ApplicationId',
            type: 'int'
        },
        {
            name: 'ApplicationName',
            type: 'string'
        },
        {
            name: 'FeatureName',
            type: 'string'
        },
        {
            name: 'FeatureDescription',
            type: 'string'
        },
        {
            name: 'FeatureXtype',
            type: 'string'
        },
        {
            name: 'FeatureClass',
            type: 'string'
        },
        {
            name: 'Group',
            type: 'int'
        },
        {
            name: 'SeqNo',
            type: 'int'
        }
    ],

    proxy: {
        type: 'ajax',
        extraParams: {
            Params: JSON.stringify({
                UserId: userInfo.userId
            }),
            User: userInfo.username
        },
        url: Utils.serverUrl + 'data/service.php?Service=ModuleFeature_List',
        reader: {
            type: 'json',
            messageProperty: 'message',
            root: 'data'
        },
        listeners: {
            exception: function(proxy, response, operation) {
                Utils.proxyError(proxy, response, operation);
            }
        }
    }
});
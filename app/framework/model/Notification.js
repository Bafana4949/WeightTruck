Ext.define('Framework.model.Notification', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'Class', type: 'string'},
        {name: 'Message', type: 'string'},
        {name: 'Xtype', type: 'string'},
        {name: 'Priority', type: 'int'},
        {name: 'Timestamp', type: 'date'}
    ],

    proxy: {
        type: 'ajax',
        extraParams: {
            Params: JSON.stringify({
                UserId: userInfo.userId,
                OrganisationId: userInfo.organisationId,
                Username: userInfo.username
            }),
            User: userInfo.username
        },
        url: Utils.serverUrl + 'data/service.php?Service=app_CheckForNotifications',
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
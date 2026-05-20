Ext.define('Framework.model.FeedbackStatus', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'FeedbackStatusId',
        type: 'int'
    }, {
        name: 'FeedbackStatus',
        type: 'string'
    }],

    proxy: {
        type: 'ajax',
        url: Utils.serverUrl + 'data/service.php?Service=FeedbackStatus_List',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty: 'total'
        },
        listeners: {
            exception: function(proxy, response, operation) {
                Utils.proxyError(proxy, response, operation);
            }
        },
        extraParams: {
            User: userInfo.username
        }
    }
});
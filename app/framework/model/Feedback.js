Ext.define('Framework.model.Feedback', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'FeedbackId',
        type: 'int'
    }, {
        name: 'FeedbackStatusId',
        type: 'int'
    }, {
        name: 'FeedbackStatus',
        type: 'String'
    }, {
        name: 'Message',
        type: 'string'
    }, {
        name: 'Feature',
        type: 'string'
    }, {
        name: 'DateCreated',
        type: 'date'
    },{
        name: 'UserId',
        type: 'int'
    },{
        name: 'Title',
        type: 'string'
    }, {
        name: 'Category',
        type: 'string'
    }, {
        name: 'FullName',
        type: 'string'
    }, {
        name: 'Username',
        type: 'string'
    }, {
        name: 'OrganisationId',
        type: 'int'
    }, {
        name: 'Type',
        type: 'string'
    }],

    proxy: {
        type: 'ajax',

        api: {
            update: Utils.serverUrl + 'data/service.php?Service=Feedback_Save',
            read: Utils.serverUrl + 'data/service.php?Service=Feedback_List',
            create: Utils.serverUrl + 'data/service.php?Service=Feedback_Save'
        },

        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty: 'total'
        },

        writer: {
            type: 'json',
            root: 'Params',
            encode: true,
            allowSingle: true
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
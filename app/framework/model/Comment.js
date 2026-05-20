Ext.define('Framework.model.Comment', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'FeedbackCommentId',
            type: 'int'
        },
        {
            name: 'FeedbackId',
            type: 'int'
        },
        {
            name: 'CommentId',
            type: 'int'
        },
        {
            name: 'Message',
            type: 'string'
        },
        {
            name: 'CreatedBy',
            type: 'string'
        },
        {
            name: 'DateCreated',
            type: 'date'
        },
        {
            name: 'UserId',
            type: 'int'
        },
        {
            name: 'FullName',
            type: 'string'
        },
        {
            name: 'Username',
            type: 'string'
        }
    ],

    proxy: {
        type: 'ajax',

        api: {
            read: Utils.serverUrl + 'data/service.php?Service=FeedbackComment_List',
            create: Utils.serverUrl + 'data/service.php?Service=FeedbackComment_Save'
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
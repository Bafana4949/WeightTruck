Ext.define('Framework.view.feedback.Window', {
    extend: 'Framework.view.window.Window',
    alias: 'widget.feedbackcenter',

    initComponent: function() {
        var me = this;

        me.title = 'Feedback Center';

        me.resizable = true;

        me.layout = 'border';

        me.list = Ext.create('Framework.view.feedback.List',{app:me});
        me.post = Ext.create('Framework.view.feedback.Post',{app:me});

        me.items = [
            {
                xtype: 'panel',
                title: 'Support Tickets',
                region: 'west',
                layout: 'fit',
                collapsible: true,
                items: [me.list]
            },
            {
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                margin: '5 5 5 5',
                title: 'Support Ticket',
                items: [me.post]
            }
        ];

        me.callParent();
    }

});
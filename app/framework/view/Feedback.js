Ext.define('Framework.view.Feedback', {
    extend: 'Framework.view.window.Form',
    alias: 'widget.feedbacksubmit',

    initComponent: function () {
        var me = this;

        me.width = 640;
        me.height = 480;

        me.store = Ext.create('Ext.data.Store', {
            fields: ['Type', 'Category'],
            data: [{
                "Type": "Bug",
                "Category": "General"
            }, {
                "Type": "Bug",
                "Category": "Business Rule"
            }, {
                "Type": "Bug",
                "Category": "Calculations"
            }, {
                "Type": "Feedback",
                "Category": "General"
            }, {
                "Type": "Feedback",
                "Category": "Request"
            }]
        });

        me.form = Ext.create('Ext.form.Panel', {
            bodyPadding: 5,
            plain: true,

            fieldDefaults: {
                labelWidth: 65,
                anchor: '100%'
            },

            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            border: 'false',
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Title',
                allowBlank: false,
                msgTarget: 'side',
                emptyText: 'Title',
                name: 'Title'

            }, {
                fieldLabel: 'Category',
                allowBlank: false,
                msgTarget: 'side',
                forceSelection: true,
                name: 'Category',
                xtype: 'combo',
                store: me.store,
                displayField: 'Category',
                emptyText: 'Category',
                valueField: 'Category'
            }, {
                fieldLabel: 'Description',
                allowBlank: false,
                msgTarget: 'side',
                forceSelection: true,
                name: 'Message',
                xtype: 'textarea',
                emptyText: 'Detailed Description',
                hideLabel: true,
                height: 350
            }]
        });

        me.items = [
            me.form];

        me.callParent();

        me.store.filter('Type', me.filter);
    }
});
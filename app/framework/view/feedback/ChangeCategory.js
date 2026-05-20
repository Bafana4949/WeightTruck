Ext.define('Framework.view.feedback.ChangeCategory', {
    extend: 'Framework.view.window.Form',
    alias: 'widget.feedbackcentercategory',

    initComponent: function() {
        var me = this;

        me.width = 300, me.height = 96;

        me.title = 'Change Category';

        me.store = Ext.create('Ext.data.Store', {
            fields: ['Type','Category'],
            data: [
                { "Type":"Bug", "Category":"General"},
                { "Type":"Bug", "Category":"Business Rule"},
                { "Type":"Bug", "Category":"Calculations"},
                { "Type":"Feedback", "Category":"General"},
                { "Type":"Feedback", "Category":"Request"}
            ]
        });

        me.store.filter("Type",me.record.data.Type);

        me.items = [{
            xtype:'form',
            bodyPadding: 5,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            fieldDefaults:{
                labelWidth:65,
                anchor:'100%',
                textAlign:'left'
            },
            items: [
                {
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
                }
            ]
        }];

        me.dockedItems = [{
            ui: 'footer',
            dock: 'bottom',
            layout: {
                pack: 'left'
            },
            xtype: 'toolbar',
            items: ['->',
                {
                    xtype: 'button',
                    action: 'Ok',
                    text: 'Ok',
                    minWidth: 80,
                    scope: this
                },
                {
                    xtype: 'button',
                    action: 'Cancel',
                    text: 'Cancel',
                    minWidth: 80,
                    scope: this
                }
            ]
        }];

        me.callParent();

        if (me.record) {
            me.down('form').loadRecord(me.record);
        }

    }
})
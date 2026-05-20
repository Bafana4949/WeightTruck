Ext.define('Framework.view.feedback.ChangeType', {
    extend: 'Framework.view.window.Form',
    alias: 'widget.feedbackcentertype',

    initComponent: function() {
        var me = this;

        me.width = 300, me.height = 96;

        me.title = 'Change Type';

        me.store = Ext.create('Ext.data.Store', {
            fields: ['Type','Category'],
            data: [
                { "Type":"Bug" },
                { "Type":"Feedback" }
            ]
        });

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
                    fieldLabel: 'Type',
                    allowBlank: false,
                    msgTarget: 'side',
                    forceSelection: true,
                    name: 'Type',
                    xtype: 'combo',
                    store: me.store,
                    displayField: 'Type',
                    emptyText: 'Type',
                    valueField: 'Type'
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
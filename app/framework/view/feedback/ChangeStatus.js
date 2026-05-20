Ext.define('Framework.view.feedback.ChangeStatus', {
    extend: 'Framework.view.window.Form',
    alias: 'widget.feedbackcenterstatus',

    initComponent: function() {
        var me = this;

        me.width = 300, me.height = 96;

        me.title = 'Change Status';

        me.store = Ext.create('Ext.data.Store', {
            model: 'Framework.model.FeedbackStatus',
            autoLoad: true
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
                    fieldLabel: 'Status',
                    allowBlank: false,
                    msgTarget: 'side',
                    name: 'FeedbackStatusId',
                    forceSelection: true,
                    xtype: 'combo',
                    store: me.store,
                    displayField: 'FeedbackStatus',
                    emptyText: 'Status',
                    valueField: 'FeedbackStatusId'
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

        me.store.on('load', function() {
            if (me.record) {
                me.down('form').loadRecord(me.record);
            }
        });
    }
});
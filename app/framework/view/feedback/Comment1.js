Ext.define('Framework.view.feedback.Comment', {
    extend: 'Framework.view.window.Form',
    alias: 'widget.feedbackcentercomment',

    initComponent: function() {
        var me = this;

        me.width = 460, me.height = 320;

        me.title = 'New Comment';

        me.items = [{
            xtype:'form',
            layout: 'fit',
            items: [
                {
                    xtype: 'htmleditor',
                    //xtype: 'textarea',
                    name: 'Message',
                    allowBlank: false,
                    flex: 1,

                    enableAlignments: true,
                    enableColors: true,
                    enableFont: false,
                    enableFontSize: false,
                    enableLists: false,
                    enableLinks: false,
                    enableFormat: true,
                    enableSourceEdit: false
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
    }
})
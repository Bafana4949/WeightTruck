Ext.define('Framework.view.notification.Notification', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.notificationpanel',

    initComponent: function() {
        var me = this;

        me.width = 400;

		me.cls = 'notificationGroup';

        me.layout = {
            type: 'hbox',
            align: 'stretch'
        }

        me.htmlItem = new Ext.panel.Panel({
            html: [
                '<div class="notificationMessage"><p>' + me.record.data.Message + '</p></div>'
            ].join(''),
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [
                    '->',
                    {
                        text: 'View',
                        record: me.record,
                        listeners: {
                            click: function() {
                                //...
                            }
                        }
                    },
                    {
                        text: 'Clear',
                        listeners: {
                            click: function(btn) {
                                var note = btn.up('panel').up('panel'),
                                    note_menu = btn.up('menu'),
                                    note_button = note_menu.up('button'),
                                    note_button_count = note_button.getText();

                                note_button.setText((note_button_count-1)+"");
                                note.destroy();

                                if ((note_button_count - 1) == 0) {
                                    note_button.removeCls('buttonNotificationHighlight');
                                    if (userInfo.organisationId === 484) {
                                        //note_button.removeCls('makoya');
                                    }
                                    note_menu.add(
                                        new Ext.panel.Panel({
                                            width:400,
                                            cls:'notificationGroup',
                                            layout: { type: 'hbox', align: 'stretch' },
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    width: 85,
                                                    height: 75,
                                                    html: '<div class="notificationDefault"></div>'
                                                },
                                                {
                                                    html: '<div class="notificationMessage"><p>There are currently no notifications.</p></div>'
                                                }
                                            ]
                                        })
                                    );
                                }
                            }
                        }
                    }

                ]
            }],
            flex: 1
        });

		me.items = [
            {
                xtype: 'container',
                width: 85,
                height: 75,
				html: me.getPriorityHtml()
            },
            me.htmlItem
        ];

        me.callParent();
    },

    getPriorityHtml: function() {
        if (this.record.data.Priority == 1 ) {
            return '<div class="notificationHigh"></div>'
        } else if (this.record.data.Priority == 2 ) {
            return '<div class="notificationMedium"></div>'
        } else {
            return '<div class="notificationLow"></div>'
        }
    }
});
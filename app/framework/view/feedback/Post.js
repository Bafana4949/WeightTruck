Ext.define('Framework.view.feedback.Post', {
    extend: 'Ext.panel.Panel',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    autoScroll: true,

    action: 'Post',

    initComponent: function() {
        var me = this;

        //if (me.record) { console.log(me.record)}

        me.postTicket = new Ext.panel.Panel({
            bodyPadding: 10,
            frame: false,
            border: false,
            html: this.getPostTicket()
        });

        me.store = new Ext.data.Store({
            model: 'Framework.model.Comment',
            listeners: {
                beforeload: function(store) {
                    store.getProxy().extraParams.Params = JSON.stringify({
                        FeedbackId: me.record.data.FeedbackId
                    });
                },
                load: function(store) {
                    me.remove(me.postTicket,false);
                    me.removeAll();

                    me.add(me.postTicket);

                    store.each(function(record) {
                        me.add(
                            new Ext.panel.Panel({
                                bodyPadding: 10,
                                padding: '5 5 5 5',
                                collapsible: true,
                                title: '<div class="feedbackTitle">' + Ext.Date.format(record.data.DateCreated, 'j F Y, g:i a') + '<span class="feedbackHiLight feedbackSpacer">' + record.data.FullName + '</span></div>',
                                html: '<div class="feedbackMessage"><p>' + Ext.htmlDecode(record.data.Message) + '</p></div>'
                            })
                        )
                    });
                }
            }
        });

        me.items = [
            me.postTicket
        ];

        me.bbar = [{
            iconCls: 'edit',
            action: 'Comment',
            text: 'Leave a comment...',
            disabled: true
        }];

        me.callParent();

        if(me.record) {
            me.store.load();
        }
    },

    getPostTicket: function() {
        if (!this.record) {
            return '<div class="feedbackMessage"><p>To preview a ticket, please select one from the grid to the left.</p></div>'
        } else {
            return '<div>' +
				'<div class="feedbackTitle">' +
				'Category: <span class="feedbackHiLight">' + this.record.data.Category + '</span><br />' +
				'Feature: <span class="feedbackHiLight">' + this.record.data.Feature + '</span><br />' +
				'Status: <span class="feedbackHiLight">' + this.record.data.FeedbackStatus + '</span>' +
				'</div>' +
////				'<div>Title: '+ this.record.data.Title +'</div>' +
//				'<div>Created On: '+ Ext.Date.format(this.record.data.DateCreated, 'j F Y, g:i a') +'</div>' +
////				'<div>Created By: '+ this.record.data.FullName +'</div>' +
//				'<div>Type: '+ this.record.data.Type +'</div>' +
//                '<div>Category: '+ this.record.data.Category +'</div>' +
//                '<div>Status: '+ this.record.data.FeedbackStatus +'</div>' +
////                '<div>Feature: '+ this.record.data.Feature +'</div>' +
//                '</div>' +
                '<hr/>' +
//                '</br>' +
                '<div class="feedbackMessage"><p>' + Ext.htmlDecode(this.record.data.Message) + '</p></div>'
        }
    }
});
Ext.define('WeighbridgeTicket.controller.WeighbridgeTicket', {
    extend: 'Ext.app.Controller',

    requires: [
        'Framework.controller.Framework'
    ],

    models: [
        'WeighbridgeTicket.model.DualTickets',
        'WeighbridgeTicket.model.SingleTicket'
    ],

    stores: [
    ],

    views: [
        'WeighbridgeTicket.view.DualTickets',
        'WeighbridgeTicket.view.SingleTicket'
    ],

    refs: [
        {
            ref: 'DualTickets',
            selector: 'weighbridgeticket-dualtickets'
        },
        {
            ref: 'SingleTicket',
            selector: 'weighbridgeticket-singleticket'
        }
    ],

    init: function (application) {
        var me = this;

        me.control({
            'weighbridgeticket-dualtickets': {
                beforerender: me.onDualTickets_beforerender
            },
            'weighbridgeticket-singleticket': {
                beforerender: me.onSingleTicket_beforerender
            }
        });
    },

    onDualTickets_beforerender: function (mainWindow) {
        var me = this;

        //console.log('onDualTickets_beforerender:', mainWindow.params);

        // mainWindow.down('#DispatchTicketPanel').setTitle('Dispatch Ticket - [' + mainWindow.params.DispatchTicketNo + ']');
        // mainWindow.down('#ReceiptTicketPanel').setTitle('Receipt Ticket - [' + mainWindow.params.ReceiptTicketNo + ']');

        // Load the store with the two tickets..
        mainWindow.store.load();

    },

    onSingleTicket_beforerender: function (mainWindow) {
        var me = this;

        //console.log('onSingleTicket_beforerender:', mainWindow.params);

        //mainWindow.down('#TicketPanel').setTitle('Dispatch Ticket - [' + mainWindow.params.DispatchTicketNo + ']');

        // Load the store with the two tickets..
        mainWindow.store.load();

    }

});

Ext.define('WeighbridgeTicket.view.DualTickets', {
    extend: 'Framework.window.Window',
    alias: 'widget.weighbridgeticket-dualtickets',

    requires: [
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.layout.container.HBox',
        'Ext.panel.Panel',
        'Ext.util.Format',
        'WeighbridgeTicket.model.DualTickets'
    ],

    initComponent: function () {
        var me = this;

        me.height = 600;
        me.width = 960;

        me.layout = {
            type: 'hbox',
            align: 'stretch'
        };
        me.maximizable = true;
        me.minimizable = false;
        me.resizable = true;
        me.title = 'Compare Matching Dispatch and Receipt Tickets';

        me.cls = 'weighbridgeTicket';

        // STORE: Dual tickets for a recon.
        me.store = Ext.create('Ext.data.Store', {
            model: 'WeighbridgeTicket.model.DualTickets',
            autoLoad: false,
            listeners: {
                beforeload: function (store) {
                    store.getProxy().extraParams.Params = JSON.stringify({
                        OrganisationId: me.params.OrganisationId,
                        DispatchTicketNo: me.params.DispatchTicketNo,
                        ReceiptTicketNo: me.params.ReceiptTicketNo
                    });
                },
                load: function (store, records, successful) {
                    //console.log('Store loaded: DualTickets', records.length);

                    if (records.length == 0) {
                    
                        Ext.Msg.show({
                            //animateTarget: me,
                            title: 'View Tickets',
                            msg: 'Two valid ticket numbers are required.',
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK,
                            focusOnToFront: true,
                            toFrontOnShow: true
                        });
                    
                    } else {
                        var record = store.getAt(0);

                        // Build the ticket templates.
                        me.setDualTickets(record);
                    }
                }
            }
        });

        me.dockedItems = [
            {
                xtype: 'container',
                dock: 'bottom',
                height: 44,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                style: 'background-color: #f4f4f4;',
                items: [
                    {
                        xtype: 'container',
                        flex: 1,
                        layout: {
                            type: 'vbox',
                            align: 'center',
                            pack: 'center'
                        },
                        items: [
                            {
                                xtype: 'container',
                                itemId: 'SummarySection',
                                html: [].join('<br />'),
                                style: 'text-align: center; font-weight: normal;'
                            }
                        ]
                    },
                    {
                        xtype: 'image',
                        height: 44,
                        width: 44,
                        src: 'images/webapp/TonTrac-Help-Icon.png'
                    }
                ]
            }
        ];

        me.items = [
            {
                xtype: 'panel',
                autoScroll: true,
                flex: 1,
                itemId: 'DispatchTicketPanel',
                title: 'Dispatch Ticket',
                titleAlign: 'center'
            },
            {
                xtype: 'panel',
                autoScroll: true,
                flex: 1,
                itemId: 'ReceiptTicketPanel',
                title: 'Receipt Ticket',
                titleAlign: 'center'
            }
        ];

        // Parent Class Events.
        me.callParent(arguments);

        me.setDualTickets = function (record) {
            var tplDispatchHeader, tplDispatchLocation, tplDispatchParties, tplDispatchProduct, tplDispatchVehicle, tplDispatchComments;

            tplDispatchHeader = [
                '<div class="ticketGroup">',
                '<div class="ticketLogo"></div>',
                '<div class="ticketHeader">',
                '<h2>Ticket Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnHalf">',
                '<table>',
                '<tr><td class="ticketColumn">Weighbridge:</td><td>' + record.get('DispatchWeighbridgeName') + '</td></tr>',
                //'<tr><td class="ticketColumn">Code:</td><td>' + record.get('WeighbridgeCode')+ '</td></tr>',
                '<tr><td class="ticketColumn">Ticket No:</td><td>' + record.get('DispatchTicketNo') + '</td></tr>',
                '<tr><td class="ticketColumn">Timestamp:</td><td>' + Ext.util.Format.date(record.get('DispatchTicketTimestamp'), 'd M Y H:i:s') + '</td></tr>',
                '</table>',
                '</div><!-- end columnHalf -->',

                '<div class="columnHalf">',
                '<table>',
                '<tr><td class="ticketColumn">Order No:</td><td>' + record.get('DispatchOrderNo') + '</td></tr>',
                //'<tr><td class="ticketColumn">Delivery No:</td><td>' + record.get('DeliveryNo')+ '</td></tr>',
                '<tr><td class="ticketColumn">&nbsp;</td><td>' + '&nbsp;' + '</td></tr>',
                '<tr><td class="ticketColumn">Revision No:</td><td>' + record.get('DispatchRevisionNo') + '</td></tr>',
                //'<tr><td class="ticketColumn">Ticket Type:</td><td>' + record.get('TransactionType')+ '</td></tr>',
                '</table>',
                '</div><!-- end columnHalf -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplDispatchLocation = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Location Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Source</p>',
                '<p>' + record.get('DispatchSource') + '</p>',
                '</div><!-- end columnHalf -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Destination</p>',
                '<p>' + record.get('DispatchDestination') + '</p>',
                '</div><!-- end columnHalf -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplDispatchParties = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Party Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Supplier</p>',
                '<p>' + record.get('DispatchSupplierName') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Customer</p>',
                '<p>' + record.get('DispatchCustomerName') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Haulier</p>',
                '<p>' + record.get('DispatchHaulierName') + '</p>',
                '</div><!-- end columnThird -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplDispatchProduct = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Product Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Product</p>',
                '<p class="ticketField">' + record.get('DispatchProductName') + '</p>',
                '<p class="ticketBold">First Weight</p>',
                '<p class="ticketField">' + record.get('DispatchFirstWeight') + ' (t)' + '</p>',
                '<p class="ticketBold">First Weight Timestamp</p>',
                '<p class="ticketField">' + Ext.util.Format.date(record.get('DispatchFirstWeightTimestamp'), 'd M Y H:i:s') + '</p>',
                '<p class="ticketBold">First Weight Operator</p>',
                '<p class="ticketField">' + record.get('DispatchFirstWeightOperator') + '</p>',
                '</div><!-- end columnHalf -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Nett Weight</p>',
                '<p class="ticketField">' + record.get('DispatchNettWeight') + ' (t)' + '</p>',
                '<p class="ticketBold">Second Weight</p>',
                '<p class="ticketField">' + record.get('DispatchSecondWeight') + ' (t)' + '</p>',
                '<p class="ticketBold">Second Weight Timestamp</p>',
                '<p class="ticketField">' + Ext.util.Format.date(record.get('DispatchSecondWeightTimestamp'), 'd M Y H:i:s') + '</p>',
                '<p class="ticketBold">Second Weight Operator</p>',
                '<p class="ticketField">' + record.get('DispatchSecondWeightOperator') + '</p>',
                '</div><!-- end columnHalf -->',

                '</div><!-- end ticketGroup -->'].join('');

            tplDispatchVehicle = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Vehicle Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Fleet No</p>',
                '<p>' + record.get('DispatchFleetNo') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Registration No</p>',
                '<p>' + record.get('DispatchRegNo') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Driver</p>',
                '<p>' + record.get('DispatchDriverName') + '</p>',
                '</div><!-- end columnThird -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplDispatchComments = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Comments</h2>',
                '</div><!-- end ticketHeader -->',


                '<p>' + record.get('DispatchComments') + '</p>'].join('');

            me.down('#DispatchTicketPanel').update(tplDispatchHeader + tplDispatchLocation + tplDispatchParties + tplDispatchProduct + tplDispatchVehicle + tplDispatchComments);

            var tplReceiptHeader, tplReceiptLocation, tplReceiptParties, tplReceiptProduct, tplReceiptVehicle, tplReceiptComments;

            tplReceiptHeader = [
                '<div class="ticketGroup">',
                '<div class="ticketLogo"></div>',
                '<div class="ticketHeader">',
                '<h2>Ticket Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnHalf">',
                '<table>',
                '<tr><td class="ticketColumn">Weighbridge:</td><td>' + record.get('ReceiptWeighbridgeName') + '</td></tr>',
                //'<tr><td class="ticketColumn">Code:</td><td>' + record.get('WeighbridgeCode')+ '</td></tr>',
                '<tr><td class="ticketColumn">Ticket No:</td><td>' + record.get('ReceiptTicketNo') + '</td></tr>',
                '<tr><td class="ticketColumn">Timestamp:</td><td>' + Ext.util.Format.date(record.get('ReceiptTicketTimestamp'), 'd M Y H:i:s') + '</td></tr>',
                '</table>',
                '</div><!-- end columnHalf -->',

                '<div class="columnHalf">',
                '<table>',
                '<tr><td class="ticketColumn">Order No:</td><td>' + record.get('ReceiptOrderNo') + '</td></tr>',
                '<tr><td class="ticketColumn">Delivery No:</td><td>' + record.get('ReceiptDeliveryNo') + '</td></tr>',
                '<tr><td class="ticketColumn">Revision No:</td><td>' + record.get('ReceiptRevisionNo') + '</td></tr>',
                //'<tr><td class="ticketColumn">Ticket Type:</td><td>' + record.get('TransactionType')+ '</td></tr>',
                '</table>',
                '</div><!-- end columnHalf -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplReceiptLocation = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Location Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Source</p>',
                '<p>' + record.get('ReceiptSource') + '</p>',
                '</div><!-- end columnHalf -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Destination</p>',
                '<p>' + record.get('ReceiptDestination') + '</p>',
                '</div><!-- end columnHalf -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplReceiptParties = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Party Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Supplier</p>',
                '<p>' + record.get('ReceiptSupplierName') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Customer</p>',
                '<p>' + record.get('ReceiptCustomerName') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Haulier</p>',
                '<p>' + record.get('ReceiptHaulierName') + '</p>',
                '</div><!-- end columnThird -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplReceiptProduct = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Product Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Product</p>',
                '<p class="ticketField">' + record.get('ReceiptProductName') + '</p>',
                '<p class="ticketBold">First Weight</p>',
                '<p class="ticketField">' + record.get('ReceiptFirstWeight') + ' (t)' + '</p>',
                '<p class="ticketBold">First Weight Timestamp</p>',
                '<p class="ticketField">' + Ext.util.Format.date(record.get('ReceiptFirstWeightTimestamp'), 'd M Y H:i:s') + '</p>',
                '<p class="ticketBold">First Weight Operator</p>',
                '<p class="ticketField">' + record.get('ReceiptFirstWeightOperator') + '</p>',
                '</div><!-- end columnHalf -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Nett Weight</p>',
                '<p class="ticketField">' + record.get('ReceiptNettWeight') + ' (t)' + '</p>',
                '<p class="ticketBold">Second Weight</p>',
                '<p class="ticketField">' + record.get('ReceiptSecondWeight') + ' (t)' + '</p>',
                '<p class="ticketBold">Second Weight Timestamp</p>',
                '<p class="ticketField">' + Ext.util.Format.date(record.get('ReceiptSecondWeightTimestamp'), 'd M Y H:i:s') + '</p>',
                '<p class="ticketBold">Second Weight Operator</p>',
                '<p class="ticketField">' + record.get('ReceiptSecondWeightOperator') + '</p>',
                '</div><!-- end columnHalf -->',
                
                '</div><!-- end ticketGroup -->'].join('');

            tplReceiptVehicle = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Vehicle Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Fleet No</p>',
                '<p>' + record.get('ReceiptFleetNo') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Registration No</p>',
                '<p>' + record.get('ReceiptRegNo') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Driver</p>',
                '<p>' + record.get('ReceiptDriverName') + '</p>',
                '</div><!-- end columnThird -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplReceiptComments = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Comments</h2>',
                '</div><!-- end ticketHeader -->',


                '<p>' + record.get('ReceiptComments') + '</p>'].join('');

            me.down('#ReceiptTicketPanel').update(tplReceiptHeader + tplReceiptLocation + tplReceiptParties + tplReceiptProduct + tplReceiptVehicle + tplReceiptComments);

            var tplSummary = [
                'The delivery time between sites was ' + '<span style="color: orange;">' + record.get('VarianceDeliveryTime') + '</span>.',
                'The weight variance between the dispatch and receipt tickets was ' + '<span style="color: orange;">' + record.get('VarianceWeight') + '</span> tons.'
            ].join('<br />');

            me.down('#SummarySection').update(tplSummary);

        };

    }
});
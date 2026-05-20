Ext.define('WeighbridgeTicket.view.SingleTicket', {
    extend: 'Framework.window.Window',
    alias: 'widget.weighbridgeticket-singleticket',

    requires: [
        'Ext.container.Container',
        'Ext.data.Store',
        'Ext.layout.container.HBox',
        'Ext.panel.Panel',
        'Ext.util.Format',
        'WeighbridgeTicket.model.SingleTicket'
    ],

    initComponent: function () {
        var me = this;

        me.height = 600;
        me.width = 600;

        me.layout = {
            type: 'hbox',
            align: 'stretch'
        };
        me.maximizable = true;
        me.minimizable = false;
        me.resizable = true;
        me.title = 'View Single Ticket';

        me.cls = 'weighbridgeTicket';

        // STORE: Signle ticket.
        me.store = Ext.create('Ext.data.Store', {
            model: 'WeighbridgeTicket.model.SingleTicket',
            autoLoad: false,
            listeners: {
                beforeload: function (store) {
                    store.getProxy().extraParams.Params = JSON.stringify({
                        OrganisationId: me.params.OrganisationId,
                        TicketNo: me.params.TicketNo
                    });
                },
                load: function (store, records, successful) {
                    //console.log('Store loaded: SingleTicket', records.length);

                    if (records.length > 0) {
                        var record = store.getAt(0);

                        //console.log('Record:', record.getData());

                        //me.down('#TicketPanel').setTitle(record.get('TransactionTypeName') +  ' Ticket');
                        me.setTitle('View ' + record.get('TransactionTypeName') +  ' Ticket - [' + record.get('TicketNo') +  ']');

                        me.setSingleTicket(record);
                    }
                }
            }
        });

        // me.dockedItems = [
        //     {
        //         xtype: 'container',
        //         dock: 'bottom',
        //         height: 44,
        //         layout: {
        //             type: 'hbox',
        //             align: 'stretch'
        //         },
        //         style: 'background-color: #f4f4f4;',
        //         items: [
        //             {
        //                 xtype: 'container',
        //                 flex: 1,
        //                 layout: {
        //                     type: 'vbox',
        //                     align: 'center',
        //                     pack: 'center'
        //                 },
        //                 items: [
        //                     {
        //                         xtype: 'container',
        //                         itemId: 'SummarySection',
        //                         html: [].join('<br />'),
        //                         style: 'text-align: center; font-weight: normal;'
        //                     }
        //                 ]
        //             },
        //             {
        //                 xtype: 'image',
        //                 height: 44,
        //                 width: 44,
        //                 src: 'images/webapp/TonTrac-Help-Icon.png'
        //             }
        //         ]
        //     }
        // ];

        me.items = [
            {
                xtype: 'panel',
                autoScroll: true,
                flex: 1,
                itemId: 'TicketPanel'
                //title: 'Ticket',
                //titleAlign: 'center'
            }
        ];

        // Parent Class Events.
        me.callParent(arguments);

        me.setSingleTicket = function (record) {
            var tplHeader, tplLocation, tplParties, tplProduct, tplVehicle, tplComments;

            tplHeader = [
                '<div class="ticketGroup">',
                '<div class="ticketLogo"></div>',
                '<div class="ticketHeader">',
                '<h2>Ticket Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnHalf">',
                '<table>',
                '<tr><td class="ticketColumn">Weighbridge:</td><td>' + record.get('WeighbridgeName') + '</td></tr>',
                //'<tr><td class="ticketColumn">Code:</td><td>' + record.get('WeighbridgeCode')+ '</td></tr>',
                '<tr><td class="ticketColumn">Ticket No:</td><td>' + record.get('TicketNo') + '</td></tr>',
                '<tr><td class="ticketColumn">Timestamp:</td><td>' + Ext.util.Format.date(record.get('TicketTimestamp'), 'd M Y H:i:s') + '</td></tr>',
                '</table>',
                '</div><!-- end columnHalf -->',

                '<div class="columnHalf">',
                '<table>',
                '<tr><td class="ticketColumn">Order No:</td><td>' + record.get('OrderNo') + '</td></tr>',
                '<tr><td class="ticketColumn">Delivery No:</td><td>' + record.get('DeliveryNo')+ '</td></tr>',
                //'<tr><td class="ticketColumn">&nbsp;</td><td>' + '&nbsp;' + '</td></tr>',
                '<tr><td class="ticketColumn">Revision No:</td><td>' + record.get('RevisionNo') + '</td></tr>',
                //'<tr><td class="ticketColumn">Ticket Type:</td><td>' + record.get('TransactionType')+ '</td></tr>',
                '</table>',
                '</div><!-- end columnHalf -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplLocation = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Location Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Source</p>',
                '<p>' + record.get('Source') + '</p>',
                '</div><!-- end columnHalf -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Destination</p>',
                '<p>' + record.get('Destination') + '</p>',
                '</div><!-- end columnHalf -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplParties = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Party Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Supplier</p>',
                '<p>' + record.get('SupplierName') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Customer</p>',
                '<p>' + record.get('CustomerName') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Haulier</p>',
                '<p>' + record.get('HaulierName') + '</p>',
                '</div><!-- end columnThird -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplProduct = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Product Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Product</p>',
                '<p class="ticketField">' + record.get('ProductName') + '</p>',
                '<p class="ticketBold">First Weight</p>',
                '<p class="ticketField">' + record.get('FirstWeight') + ' (t)' + '</p>',
                '<p class="ticketBold">First Weight Timestamp</p>',
                '<p class="ticketField">' + Ext.util.Format.date(record.get('FirstWeightTimestamp'), 'd M Y H:i:s') + '</p>',
                '<p class="ticketBold">First Weight Operator</p>',
                '<p class="ticketField">' + record.get('FirstWeightOperator') + '</p>',
                '</div><!-- end columnHalf -->',

                '<div class="columnHalf">',
                '<p class="ticketBold">Nett Weight</p>',
                '<p class="ticketField">' + record.get('NettWeight') + ' (t)' + '</p>',
                '<p class="ticketBold">Second Weight</p>',
                '<p class="ticketField">' + record.get('SecondWeight') + ' (t)' + '</p>',
                '<p class="ticketBold">Second Weight Timestamp</p>',
                '<p class="ticketField">' + Ext.util.Format.date(record.get('SecondWeightTimestamp'), 'd M Y H:i:s') + '</p>',
                '<p class="ticketBold">Second Weight Operator</p>',
                '<p class="ticketField">' + record.get('SecondWeightOperator') + '</p>',
                '</div><!-- end columnHalf -->',

                '</div><!-- end ticketGroup -->'].join('');

            tplVehicle = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Vehicle Information</h2>',
                '</div><!-- end ticketHeader -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Fleet No</p>',
                '<p>' + record.get('FleetNo') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Registration No</p>',
                '<p>' + record.get('RegNo') + '</p>',
                '</div><!-- end columnThird -->',

                '<div class="columnThird">',
                '<p class="ticketBold">Driver</p>',
                '<p>' + record.get('DriverName') + '</p>',
                '</div><!-- end columnThird -->',
                '</div><!-- end ticketGroup -->'].join('');

            tplComments = [
                '<div class="ticketGroup">',
                '<div class="ticketHeader">',
                '<h2>Comments</h2>',
                '</div><!-- end ticketHeader -->',


                '<p>' + record.get('Comments') + '</p>'].join('');

            me.down('#TicketPanel').update(tplHeader + tplLocation + tplParties + tplProduct + tplVehicle + tplComments);

            // var tplSummary = [
            //     'The delivery time between sites was ' + '<span style="color: orange;">' + record.get('VarianceDeliveryTime') + '</span>.',
            //     'The weight variance between the dispatch and receipt tickets was ' + '<span style="color: orange;">' + record.get('VarianceWeight') + '</span> tons.'
            // ].join('<br />');
            //
            // me.down('#SummarySection').update(tplSummary);

        };

    }
});
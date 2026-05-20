Ext.define('WeighbridgeTicket.model.DualTickets', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Utils'
    ],

    idProperty: 'RowId',

    fields: [
        {name: 'RowId', type: 'int'},

        {name: 'DispatchTicketId', type: 'int'},
        {name: 'DispatchComments', type: 'string'},
        {name: 'DispatchCustomerName', type: 'string'},
        {name: 'DispatchDestination', type: 'string'},
        {name: 'DispatchDriverName', type: 'string'},
        {name: 'DispatchFirstWeight', type: 'float'},
        {name: 'DispatchFirstWeightOperator', type: 'string'},
        {name: 'DispatchFirstWeightTimestamp', type: 'date'},
        {name: 'DispatchFleetNo', type: 'string'},
        {name: 'DispatchHaulierName', type: 'string'},
        {name: 'DispatchNettWeight', type: 'float'},
        {name: 'DispatchOrderNo', type: 'string'},
        {name: 'DispatchProductName', type: 'string'},
        {name: 'DispatchRegNo', type: 'string'},
        {name: 'DispatchRevisionNo', type: 'string'},
        {name: 'DispatchSecondWeight', type: 'float'},
        {name: 'DispatchSecondWeightOperator', type: 'string'},
        {name: 'DispatchSecondWeightTimestamp', type: 'date'},
        {name: 'DispatchSource', type: 'string'},
        {name: 'DispatchSupplierName', type: 'string'},
        {name: 'DispatchTicketNo', type: 'string'},
        {name: 'DispatchTicketTimestamp', type: 'date'},
        {name: 'DispatchWeighbridgeName', type: 'string'},

        {name: 'ReceiptTicketId', type: 'int'},
        {name: 'ReceiptComments', type: 'string'},
        {name: 'ReceiptCustomerName', type: 'string'},
        {name: 'ReceiptDeliveryNo', type: 'string'},
        {name: 'ReceiptDestination', type: 'string'},
        {name: 'ReceiptDriverName', type: 'string'},
        {name: 'ReceiptFirstWeight', type: 'float'},
        {name: 'ReceiptFirstWeightOperator', type: 'string'},
        {name: 'ReceiptFirstWeightTimestamp', type: 'date'},
        {name: 'ReceiptFleetNo', type: 'string'},
        {name: 'ReceiptHaulierName', type: 'string'},
        {name: 'ReceiptNettWeight', type: 'float'},
        {name: 'ReceiptOrderNo', type: 'string'},
        {name: 'ReceiptProductName', type: 'string'},
        {name: 'ReceiptRegNo', type: 'string'},
        {name: 'ReceiptRevisionNo', type: 'string'},
        {name: 'ReceiptSecondWeight', type: 'float'},
        {name: 'ReceiptSecondWeightOperator', type: 'string'},
        {name: 'ReceiptSecondWeightTimestamp', type: 'date'},
        {name: 'ReceiptSource', type: 'string'},
        {name: 'ReceiptSupplierName', type: 'string'},
        {name: 'ReceiptTicketNo', type: 'string'},
        {name: 'ReceiptTicketTimestamp', type: 'date'},
        {name: 'ReceiptWeighbridgeName', type: 'string'},

        {name: 'VarianceWeight', type: 'float'},
        {name: 'VarianceWeightPercent', type: 'float'},
        {name: 'VarianceDeliveryTime', type: 'string'}
    ],

    proxy: {
        type: 'ajax',

        batchActions: false,
        simpleSortMode: true,
        api: {
            read: Utils.serverUrl + 'data/service.php?Service=WeighbridgeTicket_DualTickets_Detail'
        },
        reader: {
            type: 'json',
            root: 'data',
            idProperty: 'TicketNo',
            successProperty: 'success'
        },
        listeners: {
            exception: function (proxy, response, operation) {
                Utils.proxyError(proxy, response, operation);
            }
        }
    }
});

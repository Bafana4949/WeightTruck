Ext.define('WeighbridgeTicket.model.SingleTicket', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Utils'
    ],

    idProperty: 'WeighbridgeTicketId',

    fields: [
        {name: 'WeighbridgeTicketId', type: 'int'},
        {name: 'Comments', type: 'string'},
        {name: 'CustomerName', type: 'string'},
        {name: 'DeliveryNo', type: 'string'},
        {name: 'Destination', type: 'string'},
        {name: 'DriverName', type: 'string'},
        {name: 'FirstWeight', type: 'float'},
        {name: 'FirstWeightOperator', type: 'string'},
        {name: 'FirstWeightTimestamp', type: 'date'},
        {name: 'FleetNo', type: 'string'},
        {name: 'HaulierName', type: 'string'},
        {name: 'NettWeight', type: 'float'},
        {name: 'OrderNo', type: 'string'},
        {name: 'ProductName', type: 'string'},
        {name: 'RegNo', type: 'string'},
        {name: 'RevisionNo', type: 'string'},
        {name: 'SecondWeight', type: 'float'},
        {name: 'SecondWeightOperator', type: 'string'},
        {name: 'SecondWeightTimestamp', type: 'date'},
        {name: 'Source', type: 'string'},
        {name: 'SupplierName', type: 'string'},
        {name: 'TicketNo', type: 'string'},
        {name: 'TicketTimestamp', type: 'date'},
        {name: 'TransactionTypeName', type: 'string'},
        {name: 'WeighbridgeCode', type: 'int'},
        {name: 'WeighbridgeName', type: 'string'}
    ],

    proxy: {
        type: 'ajax',

        batchActions: false,
        simpleSortMode: true,
        api: {
            read: Utils.serverUrl + 'data/service.php?Service=WeighbridgeTicket_SingleTicket_Detail'
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

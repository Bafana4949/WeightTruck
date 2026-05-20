Ext.define('WeighbridgeOrder.model.WeighbridgeOrderModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field'
    ],

    idProperty: 'WeighbridgeOrderId',

    fields: [
        {
            name: 'WeighbridgeOrderId',
            type: 'int'
        },
        {
            name: 'ApprovedById',
            type: 'int'
        },
        {
            name: 'CustomerId',
            type: 'int'
        },
        {
            name: 'CustomerName',
            type: 'string'
        },
        {
            name: 'CustomerLocationId',
            type: 'int'
        },
        {
            name: 'CustomerLocationName',
            type: 'string'
        },
        {
            name: 'CustomerOrderNo',
            type: 'string'
        },
        {
            name: 'CustomerStockPileId',
            type: 'int'
        },
        {
            name: 'CustomerStockPileName',
            type: 'string'
        },
        {
            name: 'EstimatedMass',
            type: 'float'
        },
        {
            name: 'HaulierCount',
            type: 'int'
        },
        {
            name: 'IsActive',
            type: 'boolean'
        },
        {
            name: 'IsComplete',
            type: 'boolean'
        },
        {
            name: 'IsDispatch',
            type: 'boolean'
        },
        {
            name: 'IsProcess',
            type: 'boolean'
        },
        {
            name: 'IsReceipt',
            type: 'int'
        },
        {
            name: 'LastServiceRequest',
            type: 'date'
        },
        {
            name: 'ManualCompletionComments',
            type: 'string'
        },
        {
            name: 'MassComplete',
            type: 'float'
        },
        {
            name: 'MassRemaining',
            type: 'float'
        },
        {
            convert: function (v, rec) {
                if (rec.data.IsReceipt) {
                    return rec.data.CustomerOrderNo;
                } else {
                    return rec.data.SupplierOrderNo;
                }
            },
            name: 'OrderNo',
            type: 'string'
        },
        {
            name: 'OrderStockPileName',
            type: 'string'
        },
        {
            name: 'OrganisationId',
            type: 'int'
        },
        {
            convert: function (v, rec) {
                if (rec.data.IsReceipt) {
                    return rec.data.SupplierName;
                } else {
                    return rec.data.CustomerName;
                }
            },
            name: 'OtherParty',
            type: 'string'
        },
        {
            name: 'ProductId',
            type: 'int'
        },
        {
            name: 'ProductName',
            type: 'string'
        },
        {
            name: 'RatePerTon',
            type: 'float'
        },
        {
            name: 'SupplierId',
            type: 'int'
        },
        {
            name: 'SupplierName',
            type: 'string'
        },
        {
            name: 'SupplierStockPileId',
            type: 'int'
        },
        {
            name: 'SupplierStockPileName',
            type: 'string'
        },
        {
            name: 'SupplierLocationId',
            type: 'int'
        },
        {
            name: 'SupplierLocationName',
            type: 'string'
        },
        {
            name: 'SupplierOrderNo',
            type: 'string'
        },
        {
            name: 'Threshold',
            type: 'float'
        },
        {
            name: 'ThresholdTons',
            type: 'float'
        },
        {
            name: 'TransactionType',
            type: 'string'
        },
        {
            convert: function (v, rec) {
                return userInfo.username;
            },
            name: 'Username',
            type: 'string'
        },
        {
            name: 'WeighbridgeId',
            type: 'int'
        },
        {
            name: 'WeighbridgeName',
            type: 'string'
        },
        {
            name: 'DateCreated',
            type: 'date'
        },
        {
            name: 'OrderNote',
            type: 'string'
        },
        {
            name: 'VarianceValue',
            type: 'float'
        }
    ]
});
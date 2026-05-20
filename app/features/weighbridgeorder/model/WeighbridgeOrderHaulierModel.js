Ext.define('WeighbridgeOrder.model.WeighbridgeOrderHaulierModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field'
    ],

    idProperty: 'WeighbridgeOrderHaulierId',

    fields: [
        {
            name: 'WeighbridgeOrderHaulierId',
            type: 'int'
        },
        {
            name: 'EstimatedMass',
            type: 'float'
        },
        {
            name: 'HaulierId',
            type: 'int'
        },
        {
            name: 'HaulierName',
            type: 'string'
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
            name: 'OrderNo',
            type: 'string'
        },
        {
            name: 'SubcontractorId',
            type: 'int'
        },
        {
            name: 'SubcontractorName',
            type: 'string'
        },
        {
            convert: function(v, rec) {
                return userInfo.username;
            },
            name: 'Username',
            type: 'string'
        },
        {
            name: 'VehicleCount',
            type: 'int'
        },
        {
            name: 'WeighbridgeOrderId',
            type: 'int'
        }
    ]
});
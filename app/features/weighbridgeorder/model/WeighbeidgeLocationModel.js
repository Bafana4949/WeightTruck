Ext.define('WeighbridgeOrder.model.WeighbeidgeLocationModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field'
    ],

    idProperty: 'WeighbridgeLocationId',

    fields: [
        {
            name: 'WeighbridgeLocationId',
            type: 'int'
        },
        {
            convert: function(v, rec) {
                if(rec.data.HasWeighbridgeAttached) {
                    return v + ' - (' + rec.data.WeighbridgeCode + ') ' + rec.data.WeighbridgeName;
                } else {
                    return v;
                }
            },
            name: 'Name',
            type: 'string'
        },
        {
            name: 'HasWeighbridgeAttached',
            type: 'boolean'
        },
        {
            name: 'WeighbridgeId',
            type: 'int'
        },
        {
            name: 'WeighbridgeCode',
            type: 'int'
        },
        {
            name: 'WeighbridgeName',
            type: 'string'
        }
    ]
});
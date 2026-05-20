Ext.define('Framework.view.Viewport', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'fit'
    },

    initComponent: function () {
        var me = this;

        me.panel = Ext.create('Framework.view.Panel', {
            app: me
        });

        me.items = [me.panel];

        // Check if user belongs to Makoya.
        if (userInfo.organisationId === 484) {
            me.html = '<div class="logo makoya"><div>';
        } else {
            me.html = '<div class="logo"><div>';
        }

        me.callParent();
    }

});
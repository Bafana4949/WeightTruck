Ext.define('Framework.view.notification.Window', {
    extend: 'Ext.menu.Menu',

    // Title.
    title: 'Notifications',

    // Some hide thing.  required!
    hideOnClick: false,

    // Some ignoring thing. required!
    ignoreParentClicks: true,

    // Shadow.
    shadow: true,

    // Floating because it's a menu.
    floating: true,

    // Fixed width.
    width: 400,

    // Max Height.
    maxHeight: 600,

    // AutoScroll for overflows.
    autoScroll: true,

    initComponent: function() {
        var me = this;
        Ext.menu.Manager.register(me);

        this.callParent();

        me.store.on('load', function(store) {
            me.store.each(function(record) {
                me.add(
                    Ext.create('Framework.view.notification.Notification', {record: record})
                );
            });

            //me.doComponentLayout();
        });

        me.on('deactivate', function() {
            me.hide();
        });
    },

    // Used to generate placement for menu rendering.
    showBy: function(cmp, pos, off) {
        var me = this;

        if (me.floating && cmp) {
            me.layout.autoSize = true;
            me.show();

            // Component or Element
            cmp = cmp.el || cmp;

            // Convert absolute to floatParent-relative coordinates if necessary.
            var xy = me.el.getAlignToXY(cmp, pos || me.defaultAlign, off);
            if (me.floatParent) {
                var r = me.floatParent.getTargetEl().getViewRegion();
                xy[0] -= r.x;
                xy[1] -= r.y;
            }
            me.showAt(xy);
            me.doConstrain();
        }
        return me;
    }

});
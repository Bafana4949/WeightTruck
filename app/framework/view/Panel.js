Ext.define("Framework.view.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.framework",

    requires: [
        "Ext.container.Container",
        "Ext.data.Store",
        "Ext.menu.Menu",
        "Framework.model.Permission",
        "Framework.view.bar.Main",
    ],

    frame: false,
    border: false,

    bodyStyle: "background-color: #f5f5f5",

    initComponent: function () {
        var me = this;

        me.mainbar = Ext.create("Framework.bar.Main", {
            app: me.app,
        });

        me.administrator = me.mainbar.administrator;
        me.client = me.mainbar.client;
        me.controlRoom = me.mainbar.controlRoom;
        me.fleet = me.mainbar.fleet;
        // me.fuel = me.mainbar.fuel;
        me.GeoTrac = me.mainbar.GeoTrac;
        me.haulier = me.mainbar.haulier;
        // me.notification = me.mainbar.notification;
        me.organisation = me.mainbar.organisation;
        // me.rail = me.mainbar.rail;
        me.security = me.mainbar.security;
        me.stock = me.mainbar.stock;
        me.user = me.mainbar.user;
        me.weighbridge = me.mainbar.weighbridge;

        me.store = Ext.create("Ext.data.Store", {
            model: "Framework.model.Permission",
        });

        me.dockedItems = [
            me.mainbar
        ];

        me.layout = {
            type: "fit",
        };

        me.items = [
            {
                xtype: "container",
                id: "framework",
            },
        ];

        me.callParent();

        me.store.addListener("load", me.loaded, me);

        me.store.load();
    },

    loaded: function () {
        var me = this;

        // me.loadFuelMenu();
        me.loadGeoTracMenu();
        me.loadWeighbridgeMenu();
        me.loadFleetMenu();
        me.loadSecurityMenu();
        me.loadClientMenu();
        me.loadOrganisationMenu();
        me.loadStockMenu();
        // me.loadRailMenu();
        me.loadHaulierMenu();
        me.loadControlRoomMenu();
        userInfo.global ? me.loadAdministratorMenu() : "";
    },

    // loadFuelMenu: function () {
    //   var me = this;
    //
    //   // Build the menu list.
    //   me.buildMenuList(me.fuel, "Fuel");
    // },

    loadGeoTracMenu: function () {
        var me = this;

        // Build the menu list.
        me.buildMenuList(me.GeoTrac, "GeoTrac");
    },

    loadWeighbridgeMenu: function () {
        var me = this;

        // Build the menu list.
        me.buildMenuList(me.weighbridge, "Weighbridge");
    },

    loadHaulierMenu: function () {
        var me = this;

        // Build the menu list.
        me.buildMenuList(me.haulier, "Haulier");
    },

    loadFleetMenu: function () {
        var me = this;

        // Build the menu list.
        me.buildMenuList(me.fleet, "Fleet");
    },

    loadSecurityMenu: function () {
        var me = this;

        // Build the menu list.
        me.buildMenuList(me.security, "Security");
    },

    loadClientMenu: function () {
        var me = this;

        // Build the menu list.
        me.buildMenuList(me.client, "Client");
    },

    loadOrganisationMenu: function () {
        var me = this;

        // Build the menu list.
        me.buildMenuList(me.organisation, "Organisation");
    },

    loadStockMenu: function () {
        var me = this;

        // Build the menu list.
        me.buildMenuList(me.stock, "Stock");
    },

    // loadRailMenu: function () {
    //   var me = this;
    //
    //   // Build the menu list.
    //   me.buildMenuList(me.rail, "Rail");
    // },

    loadControlRoomMenu: function () {
        var me = this;

        // Build the menu list.
        me.buildMenuList(me.controlRoom, "Control Room");
    },

    loadAdministratorMenu: function () {
        var me = this;

        // Build the menu list.
        me.buildMenuList(me.administrator, "Administrator");
    },

    // loadWeightometerMenu: function () {
    //     var me = this;
    //
    //     // Build the menu list.
    //     me.buildMenuList(me.weightometer, "Weightometerstock");
    // },

    buildMenuList: function (module, filterValue) {
        var me = this,
            currentGroup,
            menu = new Ext.menu.Menu({
                plain: true,
            });

        // Filter the store to the current menu icon.
        me.store.clearFilter();
        me.store.filter("ApplicationName", filterValue);

        // console.log('filterValue:', filterValue, me.store.count());

        // Show the menu icon if there are actually menu items.
        if (me.store.count() > 0) {
            module.show();
            currentGroup = me.store.getAt(0).data.Group;
            module.removeCls("toolbarButtonDisabled");
            module.removeCls("noHover");
        } else {
            // Hide module icons if there are no menu items assigned to this user.
            switch (filterValue) {
                case "Client":
                    module.hide();
                    module.disable();
                    break;
                case "Control Room":
                    module.hide();
                    module.disable();
                    break;
                default:
                // Do Nothing.
            }

            // module.hide();
            // module.disable();
        }

        // Loop through the menu items.
        me.store.each(function (record) {
            var iconCls = "";

            // console.log('Menu:', record.data.ApplicationName, ' - ', record.data.FeatureName, record.data.Group, record.data.SeqNo);

            switch (filterValue) {
                case "Administrator":
                    // iconCls = 'exclamation';
                    // iconCls = 'bullet_red';
                    iconCls = "cog";
                    break;

                case "Control Room":
                    iconCls = "control_room";
                    break;

                default:
                    // Do Nothing.
                    iconCls = "tontrac_menu";
            }

            // Check if it's a new group.
            if (record.data.Group !== currentGroup) {
                // Store the new group.
                currentGroup = record.data.Group;

                //console.log('-> New Group');

                // Add a menu separator.
                menu.add("-");

                // Add the menu item.
                menu.add({
                    text: record.data.FeatureName,
                    iconCls: iconCls,
                    // iconCls: record.data.ApplicationName === 'Control Room' ? 'tontrac' : '',
                    module: record.data.ApplicationName,
                    applicationId: record.data.ApplicationId,
                    featureDescription: record.data.FeatureDescription,
                    featureAlias: record.data.FeatureXtype,
                    featureClass: record.data.FeatureClass,
                });
            } else {
                // Add the menu item to the same group.
                menu.add({
                    text: record.data.FeatureName,
                    iconCls: iconCls,
                    // iconCls: record.data.ApplicationName === 'Control Room' ? 'tontrac' : '',
                    module: record.data.ApplicationName,
                    applicationId: record.data.ApplicationId,
                    featureDescription: record.data.FeatureDescription,
                    featureAlias: record.data.FeatureXtype,
                    featureClass: record.data.FeatureClass,
                });
            }
        });

        // Set the modules menu list.
        module.menu = menu;
    },
});

Ext.define("Framework.view.bar.Main", {
    extend: "Ext.toolbar.Toolbar",
    alternateClassName: ["Framework.bar.Main"],

    requires: [
        "Ext.container.Container",
        "Ext.toolbar.TextItem",
        "Ext.toolbar.Toolbar",
        "Framework.view.button.Administrator",
        "Framework.view.button.Client",
        "Framework.view.button.ControlRoom",
        "Framework.view.button.Fleet",
        // "Framework.view.button.Fuel",
        "Framework.view.button.GeoTrac",
        "Framework.view.button.Haulier",
        // "Framework.view.button.Notification",
        "Framework.view.button.Organisation",
        // "Framework.view.button.Rail",
        "Framework.view.button.Security",
        "Framework.view.button.Stock",
        "Framework.view.button.User",
        "Framework.view.button.Weighbridge",
    ],

    alias: "widget.headerbar",

    initComponent: function () {
        var me = this;

        //me.style = 'background-image:url(images/webapp/framework/Toolbar_BG.png); no-repeat;';
        //        me.style = 'background-image:url(images/webapp/framework/Toolbar_BG.png);';

        me.cls = "mainToolbar";
        me.margin = "0 0 -1 0"; //t r b l
        me.bodyPadding = 0;
        //me.bodyStyle= 'background-color: #595959';
        //me.style= 'background-color: red';
        me.height = 63;
        me.frame = false;
        me.border = false;

        // me.fuel = Ext.create("Framework.view.button.Fuel", {
        //     app: me.app,
        //     hidden: false,
        //     // hidden: true,
        //     cls: ["toolbarButton", "toolbarButtonDisabled", "buttonFuel", "noHover"],
        // });
        me.GeoTrac = Ext.create("Framework.view.button.GeoTrac", {
            app: me.app,
            hidden: false,
            // hidden: true,
            cls: [
                "toolbarButton",
                "toolbarButtonDisabled",
                "buttonGeoTrac",
                "noHover",
            ],
        });
        me.weighbridge = Ext.create("Framework.view.button.Weighbridge", {
            app: me.app,
            hidden: false,
            // hidden: true,
            cls: [
                "toolbarButton",
                "toolbarButtonDisabled",
                "buttonWeighbridge",
                "noHover",
            ],
        });
        me.fleet = Ext.create("Framework.view.button.Fleet", {
            app: me.app,
            hidden: false,
            // hidden: true,
            cls: ["toolbarButton", "toolbarButtonDisabled", "buttonFleet", "noHover"],
        });
        me.haulier = Ext.create("Framework.view.button.Haulier", {
            app: me.app,
            hidden: false,
            // hidden: true,
            cls: [
                "toolbarButton",
                "toolbarButtonDisabled",
                "buttonHaulier",
                "noHover",
            ],
        });
        me.security = Ext.create("Framework.view.button.Security", {
            app: me.app,
            hidden: false,
            // hidden: true,
            cls: [
                "toolbarButton",
                "toolbarButtonDisabled",
                "buttonSecurity",
                "noHover",
            ],
        });
        me.client = Ext.create("Framework.view.button.Client", {
            app: me.app,
            hidden: false,
            // hidden: true,
            cls: [
                "toolbarButton",
                "toolbarButtonDisabled",
                "buttonClient",
                "noHover",
            ],
        });
        me.organisation = Ext.create("Framework.button.Organisation", {
            app: me.app,
            hidden: false,
            // hidden: true,
            cls: [
                "toolbarButton",
                "toolbarButtonDisabled",
                "buttonOrganisation",
                "noHover",
            ],
        });
        // me.notification = Ext.create("Framework.button.Notification", {
        //     app: me.app,
        //     // hidden: false,
        //     hidden: true,
        //     cls: ["toolbarButton", "buttonNotification"],
        // });
        me.stock = Ext.create("Framework.view.button.Stock", {
            app: me.app,
            hidden: false,
            // hidden: true,
            cls: ["toolbarButton", "toolbarButtonDisabled", "buttonStock", "noHover"],
        });
        // me.rail = Ext.create("Framework.view.button.Rail", {
        //     app: me.app,
        //     // hidden: false,
        //     hidden: true,
        //     cls: ["toolbarButton", "toolbarButtonDisabled", "buttonRail", "noHover"],
        // });
        me.controlRoom = Ext.create("Framework.view.button.ControlRoom", {
            app: me.app,
            hidden: false,
            // hidden: true,
            cls: [
                "toolbarButton",
                "toolbarButtonDisabled",
                "buttonControlRoom",
                "noHover",
            ],
        });
        me.administrator = Ext.create("Framework.view.button.Administrator", {
            app: me.app,
            //hidden:true,
            cls: ["toolbarButton", "buttonAdministrator"],
        });
        me.administrator.hidden = !userInfo.global;
        me.administrator.disabled = !userInfo.global;

        me.user = Ext.create("Framework.button.User", {
            app: me.app,
            cls: "toolbarButtonUser",
        });

        // Add makoya theme classes.
        if (userInfo.organisationId === 484) {
            me.addCls("makoya");
            me.administrator.addCls("makoya");
            me.client.addCls("makoya");
            me.controlRoom.addCls("makoya");
            //   me.fuel.addCls("makoya");
            me.GeoTrac.addCls("makoya");
            me.fleet.addCls("makoya");
            me.weighbridge.addCls("makoya");
            me.security.addCls("makoya");
            me.organisation.addCls("makoya");
            // me.notification.addCls("makoya");
            me.user.addCls("makoya");
            me.stock.addCls("makoya");
            // me.rail.addCls("makoya");
            me.haulier.addCls("makoya");
        }

        me.layout = {
            type: "hbox",
            align: "stretch",
        };

        me.items = [
            {
                width: 320,
                xtype: "container",
            },
            {
                xtype: "container",
                margin: "-1 0 0 0", //t r b l
                itemId: "toolbarButtonsContainer",
                items: [
                    //   me.fuel,
                    me.GeoTrac,
                    me.weighbridge,
                    me.haulier,
                    me.fleet,
                    me.security,
                    me.client,
                    me.organisation,
                    // me.notification,
                    me.stock,
                    // me.rail,
                    me.controlRoom,
                    me.administrator,
                ],
            },
            "->",
            {
                xtype: "container",
                layout: {
                    type: "vbox",
                    align: "stretchmax",
                },
                items: [
                    {
                        xtype: "tbtext",
                        text: userInfo.organisation,
                        flex: 1,
                        cls: "toolbarOrganisation",
                    },
                    {
                        xtype: "toolbar",
                        ui: "footer",
                        style: "",
                        items: ["->", me.user],
                    },
                ],
            },
        ];

        me.callParent();
    },
});

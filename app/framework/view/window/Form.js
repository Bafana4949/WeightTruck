Ext.define('Framework.view.window.Form', {
    extend: 'Ext.window.Window',

    // Render to content area.
    renderTo: 'framework',

    // Feature alternative class name to extend
    alternateClassName: ['Framework.window.Form'],

    // Feature default title.
    title: 'TonTrac',
    //iconCls: 'tontrac',
    iconCls: 'tontrac_menu_orange',

    // Feature is modal
    modal: true,

    // Feature default window dimensions.
    width: 800,
    height: 600,

    // Feature default constrain.
    constrain: true,

    // Feature default animate collapse.
    animateCollapse: false,

    // Feature default frame.
    frame: false,

    // Feature default resizable.
    resizable: false,

    // Feature default window actions.
    minimizable: false,
    maximizable: false,
    closable: true,

    // If screen s tiny, its open maximized.
    onShow: function () {
        // Small screen.
        if (screen.width <= 1024 && screen.height <= 768) {
            this.maximize();
        }
        // Seans IPad
        if (screen.width <= 768 && screen.height <= 1024) {
            this.maximize();
        }

        this.callParent();
    },

    // Feature default layout.
    layout: 'fit',

    // Feature default Escape Key overide.
    onEsc: Ext.emptyFn,

    // Feature default autoShow.
    autoShow: false,

    // Docked Items
    dockedItems: [
        {
            ui: 'footer',
            dock: 'bottom',
            layout: {
                pack: 'left'
            },
            xtype: 'toolbar',
            items: [
                '->',
                {
                    xtype: 'button',
                    action: 'Ok',
                    text: 'Ok',
                    minWidth: 80,
                    scope: this
                },
                {
                    xtype: 'button',
                    action: 'Cancel',
                    text: 'Cancel',
                    minWidth: 80,
                    scope: this
                },
                {
                    xtype: 'button',
                    action: 'Apply',
                    text: 'Apply',
                    disabled: true,
                    minWidth: 80,
                    scope: this
                }
            ]
        }
    ],

    // Feature default close animation.
    doClose: function () {
        var me = this;
        me.doClose = Ext.emptyFn;
        me.el.disableShadow();
        me.el.fadeOut({
            listeners: {
                afteranimate: function () {
                    me.destroy();
                }
            }
        });
    },

    // Feature default minimize animation.
    minimize: function () {
        var me = this;
        me.hide();
    },

    // Added tools
    initTools: function () {
        var me = this;

        var description = new Ext.menu.Item({
            text: 'Feature Description',
            iconCls: 'information',
            listeners: {
                click: function (component) {
                    Utils.description(me.featureMenuItem.text, me.featureMenuItem.featureDescription, 'information')
                }
            }
        });

        var feedback = new Ext.menu.Item({
            text: 'Send Feedback',
            iconCls: 'comment_add',
            listeners: {
                click: function (component) {
                    Ext.create('Framework.view.Feedback', {
                        supportwindow: me,
                        filter: 'Feedback',
                        title: 'Send Feedback',
                        iconCls: 'comment_add'
                    }).show();
                }
            }
        });

        var bug = new Ext.menu.Item({
            text: 'Report a Bug',
            iconCls: 'bug_add',
            listeners: {
                click: function (component) {
                    Ext.create('Framework.view.Feedback', {
                        supportwindow: me,
                        filter: 'Bug',
                        title: 'Report a Bug',
                        iconCls: 'bug_add'
                    }).show();
                }
            }
        });

        this.tools = [
            {
                type: 'help',
                handler: function () {
                    var menu = Ext.create('Ext.menu.Menu', {
                        items: [
                            description,
                            feedback,
                            bug
                        ]
                    });
                    menu.showBy(this);
                }
            }
        ];

        this.callParent();
    }
});
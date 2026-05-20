Ext.define('Framework.view.button.Notification', {
	extend: 'Ext.button.Button',

	requires: [
		'Ext.container.Container',
		'Ext.data.Store',
		'Ext.layout.container.HBox',
		'Ext.panel.Panel',
		'Framework.model.Notification',
		'Framework.view.notification.Notification'
	],

	// Alternative Class Name
	alternateClassName: ['Framework.button.Notification'],

	// First text item set to zero.
	text: '0',

	// Margin for icon
	margin: '2 0 0 5',

	// Icon width.
	width: 55,

	// Icon height.
	height: 55,

	// Setting default style.
	cls: 'buttonNotification',

	// Removing menu arrow for button.
	arrowCls: '',

	tooltip: '<span>Notifications</span>',

	initComponent: function () {
		var me = this;

		me.store = new Ext.data.Store({
			model: 'Framework.model.Notification',
			storeId: 'Notification',
			listeners: {
				beforeload: function (st) {
					st.getProxy().extraParams = {
						Params: JSON.stringify({
							UserId: userInfo.userId,
							OrganisationId: userInfo.organisationId,
							Username: userInfo.username
						}),
						User: userInfo.username
					}
				},
				load: function (store) {
					me.menu.removeAll();

					if (store.count() > 0) {
						me.addCls('buttonNotificationHighlight');
						if (userInfo.organisationId === 484) {
							me.addCls('makoya');
						}
						me.setText(store.count());
						store.each(function (record) {
							me.menu.add(
								Ext.create('Framework.view.notification.Notification', {record: record})
							)
						});
					} else {
						me.removeCls('buttonNotificationHighlight');
						if (userInfo.organisationId === 484) {
							//me.removeCls('makoya');
						}
						me.setText('0');
						me.menu.add([
							{
								xtype: 'panel',
								width: 400,
								cls: 'notificationGroup',
								layout: {type: 'hbox', align: 'stretch'},
								items: [
									{
										xtype: 'container',
										width: 85,
										height: 75,
										html: '<div class="notificationDefault"></div>'
									},
									{
										html: '<div class="notificationMessage"><p>There are currently no notifications.</p></div>'
									}
								]

							}
						])
					}
				}
			}
		});

		me.menu = {
			title: 'Notifications',
			bbar: {height: 24},
			plain: true
		};

		me.task = {
			run: function () {
				me.store.load();
			},
			interval: 300000
		};

		me.callParent();

		Ext.TaskManager.start(me.task);

		me.on({
			beforedestroy: function (here) {
				Ext.TaskManager.stop(me.task);
			}
		})

	}

});
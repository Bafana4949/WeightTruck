Ext.define('Framework.view.button.User', {
	extend: 'Ext.button.Button',

	requires: [
		'Ext.menu.Menu',
		'Ext.toolbar.Separator',
		'Framework.view.ChangePassword',
		'Framework.view.feedback.Window'
	],

	// Alternative Class Name.
	alternateClassName: ['Framework.button.User'],

	// User's Name.
	text: userInfo.user,

	// Adding highlighting to the user's name.
	cls: 'textHighlight',

	// Adding basic client icon.
	iconCls: 'client',

	// Removing arrow for button menu.
	arrowCls: '',

	tooltip: '<span>User</span>',

	// Adding a menu with a basic log-off.
	menu: new Ext.menu.Menu({

		plain: true,
		items: [
			{
				text: 'Feedback Center',
				onClick: function () {
					Ext.create('Framework.view.feedback.Window', {}).show();
				}
			},
			'-',
			{
				text: 'Change Password',
				onClick: function () {
					Ext.create('Framework.view.ChangePassword', {}).show();
				}
			},
			'-',
			{
				text: 'Log Off',
				onClick: function () {
					Ext.Msg.confirm('Logout', 'Are you sure you want to logout?', function (pressed) {
						if (pressed === 'yes') {
							window.location.href = './authentication/logout.php';
						}
					});
				}
			}
		]
	})
});
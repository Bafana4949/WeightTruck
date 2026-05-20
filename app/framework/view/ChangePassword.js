Ext.apply(Ext.form.field.VTypes, {
	password: function (val, field) {

		if (field.initialPassField) {
			var pwd = field.up('form').down('#' + field.initialPassField);
			return (val === pwd.getValue());
		}

		return true;
	},

	passwordText: 'Passwords do not match'
});


Ext.define('Framework.view.ChangePassword', {
	extend: 'Framework.view.window.Form',
	alias: 'widget.changepassword',

	requires: [
		'Ext.button.Button',
		'Ext.container.Container',
		'Ext.form.FieldSet',
		'Ext.form.Panel',
		'Ext.form.field.Text',
		'Ext.layout.container.HBox',
		'Ext.layout.container.VBox',
		'Ext.toolbar.Fill'
	],

	initComponent: function () {
		var me = this;
		me.policies = PasswordPolicies || {};

		me.title = "Change Password";

		me.width = 470;
		me.height = 445;

		me.form = Ext.create('Ext.form.Panel', {
			bodyPadding: 15,
			plain: true,

			fieldDefaults: {
				labelWidth: 100,
				msgTarget: 'side',
				autoFitErrors: false
			},

			layout: {
				type: 'vbox',
				align: 'stretch'
			},

			border: 'false',
			items: [
				{
					xtype: 'fieldset',
					defaults: {
						xtype: 'textfield',
						labelAlign: 'right',
						labelWidth: 100,
						inputType: 'password',
						allowBlank: false
					},
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						{
							fieldLabel: 'Current Password',
							name: 'OldPassword'
						},
						{
							fieldLabel: 'New Password',
							itemId: 'pass',
							name: 'NewPassword',
							xtype: 'passwordfield',
							margins: '20 0 0 0'
						},
						{
							fieldLabel: 'Confirm Password',
							xtype: 'passwordfield',
							initialPassField: 'pass', // id of the initial password field
							name: 'ConfirmPassword'
						}
					]
				},
				{
					xtype: 'container',
					layout: {
						type: 'hbox',
						align: 'left',
					},
					items: [
						{
							xtype: 'container',
							flex: 1,
							items: [
								{
									xtype: 'container',
									style: 'text-align: left; font-weight: normal;',
									html: [
										'<div style="margin-top: 10px; font-weight: 600; color: #b30000;">To ensure the security of your account, your password must adhere to the following criteria:</div>',
										'<div style="margin-top: 4px; color: #808080;">&#x2022; Not contain any spaces</div>',
										'<div style="margin-top: 4px; color: #808080;">&#x2022; The login name cannot be contained in the password</div>',
										'<div style="margin-top: 4px; color: #808080;">&#x2022; Be at least ' + me.policies.getPasswordMinimumLength() + ' character(s) long</div>',
										'<div style="margin-top: 4px; color: #808080;">&#x2022; Include at least ' + me.policies.getPasswordMinimumUppercaseAlphaCount() + ' uppercase letter(s)</div>',
										'<div style="margin-top: 4px; color: #808080;">&#x2022; Include at least ' + me.policies.getPasswordMinimumLowercaseAlphaCount() + ' lowercase letter(s)</div>',
										'<div style="margin-top: 4px; color: #808080;">&#x2022; Have at least ' + me.policies.getPasswordMinimumNumberCount() + ' numeric digit(s)</div>',
										'<div style="margin-top: 4px; color: #808080;">&#x2022; Contain at least ' + me.policies.getPasswordMinimumSpecialCharCount() + ' special character(s)</div>',
										'<div style="margin-top: 10px; color: #808080;">For instance, <span style="color: orange; font-weight: 600;">' +
										me.policies.generatePassword() + '</span> is a valid password as it meets all the above criteria.</div>'
									].join('')
								}
							]
						}
					]
				}
			]
		});

		me.items = [me.form];

		me.dockedItems = [{
			ui: 'footer',
			dock: 'bottom',
			layout: {
				pack: 'left'
			},
			xtype: 'toolbar',
			items: ['->', {
				xtype: 'button',
				action: 'Ok',
				text: 'Save',
				minWidth: 80,
				scope: this
			}, {
				xtype: 'button',
				action: 'Cancel',
				text: 'Cancel',
				minWidth: 80,
				scope: this
			}]
		}];

		me.callParent();

		me.defaultFocus = me.down('field[name=OldPassword]');
	}
});
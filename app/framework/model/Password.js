Ext.define('Framework.model.Password', {
	extend: 'Ext.data.Model',

	requires: [
		'Ext.data.proxy.Ajax',
		'Ext.data.reader.Json',
		'Ext.data.writer.Json',
		'Utils'
	],

	fields: [
		{
			name: 'OldPassword',
			type: 'string'
		},
		{
			name: 'NewPassword',
			type: 'string'
		},
		{
			name: 'Username',
			type: 'string'
		},
		{
			name: 'UserId',
			type: 'int'
		}
	],

	proxy: {
		type: 'ajax',
		api: {
			create: Utils.serverUrl + 'data/service.php?Service=User_ChangePassword_v1_Save'
		},
		reader: {
			type: 'json',
			root: 'data',
			idProperty: 'UserId',
			successProperty: 'success',
			totalProperty: 'total'
		},
		writer: {
			type: 'json',
			encode: true,
			root: 'Params',
			allowSingle: true
		},
		extraParams: {
			User: userInfo.username
		},
		listeners: {
			exception: function (proxy, response, operation) {
				Utils.proxyError(proxy, response, operation);
			}
		}
	}
});
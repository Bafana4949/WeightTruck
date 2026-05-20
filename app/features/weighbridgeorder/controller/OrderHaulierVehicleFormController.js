Ext.define('WeighbridgeOrder.controller.OrderHaulierVehicleFormController', {
	extend: 'Ext.app.Controller',

	stores: [
		'WeighbridgeOrder.store.HaulierVehicleAvailableStore',
		'WeighbridgeOrder.store.HaulierVehicleAssignedStore'
	],

	refs: [
		{
			ref: 'formWindow',
			selector: 'orderhauliervehicleformwindow'
		},
		{
			ref: 'gridAvailable',
			selector: 'orderhauliervehicleformwindow #gridAvailable'
		},
		{
			ref: 'gridAssigned',
			selector: 'orderhauliervehicleformwindow #gridAssigned'
		}
	],

	onWindow_AfterRender: function(component, eOpts) {
		var window = component, //.up('window'),
			record = window.record;

		// Set the window title.
		window.setTitle('Authorised Vehicles: ' + record.data.HaulierName);
	},

	onGridAvailable_BeforeRender: function (component, eOpts) {
		// Load the store with all filters applied.
		this.refreshGridAvailable();
		this.refreshGridAssigned();
	},

	onInducted_Change: function (field, newValue, oldValue, eOpts) {
		// Load the store with all filters applied.
		this.refreshGridAvailable();
	},

	onFilterAvailable_Change: function (field, newValue, oldValue, eOpts) {
		// Load the store with all filters applied.
		this.refreshGridAvailable();
	},

	onFilterAssigned_Change: function (field, newValue, oldValue, eOpts) {
		this.refreshGridAssigned();
	},

	onGridAvailable_BeforeDrop: function (node, data, overModel, dropPosition, dropFunction, eOpts) {
		var limitRecords = 50,
			selectedRecords = data.records.length;

		if (selectedRecords > limitRecords) {
			Ext.Msg.alert('Remove Vehicles', 'You have selected ' + selectedRecords + ' vehicles. Please select ' + limitRecords + ' at the most', Ext.emptyFn);
			return false;
		}
	},

	onGridAvailable_Drop: function (node, data, dropRec, dropPosition) {
		var me = this,
			window = me.getFormWindow(),
			record = window.record,
			weighbridgeOrderHaulierId = record.data.WeighbridgeOrderHaulierId,
			listVehicleId = [];

		//console.log('Drop Available:', weighbridgeOrderHaulierId);
		//onsole.log('Record Count:', data.records.length);

		//window.suspendEvents();

		Ext.Array.each(data.records, function (record) {
			listVehicleId.push(record.data.VehicleId);
		});

		//window.resumeEvents();

		//console.log('Removed Vehicle List:', listVehicleId.join('|'));

		Ext.Ajax.request({
			url: Utils.serverUrl + 'data/service.php?Service=WeighbridgeOrderHaulierVehicles_Delete',
			method: 'POST',
			timeout: 8000, // 8 seconds.
			scope: me,

			params: {
				Params: JSON.stringify({
					VehicleList: listVehicleId.join('|'),
					WeighbridgeOrderHaulierId: weighbridgeOrderHaulierId,
					Username: userInfo.username
				}),
				User: userInfo.username
			},

			success: function (response) {
				var obj = Ext.decode(response.responseText);

				// Check if the call was a success.
				if (obj.success === 'true') {
					//console.log("Vehicle Deleted:", record.data.VehicleId);
				} else {
					Ext.Msg.alert('Order Vehicle', 'Could not remove vehicle: ' + record.data.RegNo, Ext.emptyFn);
				}

			},

			failure: function (response) {
				Ext.Msg.alert('Order Vehicle', 'Could not remove vehicle: ' + record.data.RegNo, Ext.emptyFn);
			}
		});

//		this.refreshGridAssigned();
//		this.refreshGridAvailable();

	},

	onGridAvailable_SelectionChange: function (grid, records, eOpts) {
		var me = this,
			window = me.getFormWindow(),
			displayLabel = window.down('#displayAvailableVehicles'),
			selectedVehicles = records.length;

		displayLabel.setValue(selectedVehicles);

		//console.log('Records:', selectedVehicles);
	},

	onGridAssigned_BeforeDrop: function (node, data, overModel, dropPosition, dropFunction, eOpts) {
		var limitRecords = 50,
			selectedRecords = data.records.length;

		if (selectedRecords > limitRecords) {
			Ext.Msg.alert('Assign Vehicles', 'You have selected ' + selectedRecords + ' vehicles. Please select ' + limitRecords + ' at the most', Ext.emptyFn);
			return false;
		}
	},

	onGridAssigned_Drop: function (node, data, dropRec, dropPosition) {
		var me = this,
			window = me.getFormWindow(),
			record = window.record,
			weighbridgeOrderHaulierId = record.data.WeighbridgeOrderHaulierId,
			listVehicleId = [];

		//console.log('Drop Assigned:', weighbridgeOrderHaulierId);

		//window.suspendEvents();

		Ext.Array.each(data.records, function (record) {
			listVehicleId.push(record.data.VehicleId);
		});

		//window.resumeEvents();

		//console.log('Assigned Vehicle List:', listVehicleId.join('|'));

		Ext.Ajax.request({
			url: Utils.serverUrl + 'data/service.php?Service=WeighbridgeOrderHaulierVehicles_Save',
			method: 'POST',
			timeout: 8000, // 8 seconds.
			scope: me,

			params: {
				Params: JSON.stringify({
					VehicleList: listVehicleId.join('|'),
					WeighbridgeOrderHaulierId: weighbridgeOrderHaulierId,
					Username: userInfo.username
				}),
				User: userInfo.username
			},

			success: function (response) {
				var obj = Ext.decode(response.responseText);

				// Check if the call was a success.
				if (obj.success === 'true') {
					// console.log("Vehicle Added:", record.data.VehicleId);
				} else {
					Ext.Msg.alert('Order Vehicle', 'Could not assign vehicle: ' + record.data.RegNo, Ext.emptyFn);
				}

			},

			failure: function (response) {
				Ext.Msg.alert('Order Vehicle', 'Could not assign vehicle: ' + record.data.RegNo, Ext.emptyFn);
			}
		});

//		this.refreshGridAssigned();
//		this.refreshGridAvailable();

	},

	onGridAssigned_SelectionChange: function (grid, records, eOpts) {
		var me = this,
			window = me.getFormWindow(),
			displayLabel = window.down('#displayAssignedVehicles'),
			selectedVehicles = records.length;

		displayLabel.setValue(selectedVehicles);

		//console.log('Records:', selectedVehicles);
	},

	onAssignAllVehicles_ButtonClick: function (button, e, eOpts) {
		var me = this,
			window = me.getFormWindow(),
			record = window.record,
			weighbridgeOrderHaulierId = record.data.WeighbridgeOrderHaulierId,
			haulierId = record.data.HaulierId;

		//console.log('Record:', record.data);

		Ext.Msg.confirm('Assign All Vehicles', 'Are you sure you want to assign all vehicles?', function (btn) {
			if (btn == "yes") {

				Ext.Ajax.request({
					url: Utils.serverUrl + 'data/service.php?Service=WeighbridgeOrderHaulierVehicles_AssignAll',
					method: 'POST',
					timeout: 8000, // 8 seconds.
					scope: me,

					params: {
						Params: JSON.stringify({
							WeighbridgeOrderHaulierId: weighbridgeOrderHaulierId,
							HaulierId: haulierId,
							Username: userInfo.username
						}),
						User: userInfo.username
					},

					success: function (response) {
						var obj = Ext.decode(response.responseText);

						// Check if the call was a success.
						if (obj.success === 'true') {
							// console.log("Vehicle Added:", record.data.VehicleId);
							this.refreshGridAssigned();
							this.refreshGridAvailable();
						} else {
							Ext.Msg.alert('Assign Haulier Vehicles', 'Could not assign all vehicles', Ext.emptyFn);
						}

					},

					failure: function (response) {
						Ext.Msg.alert('Assign Haulier Vehicles', 'Could not assign all vehicles', Ext.emptyFn);
					}
				});

			}
		});
	},

	onRemoveAllVehicles_ButtonClick: function (button, e, eOpts) {
		var me = this,
			window = me.getFormWindow(),
			record = window.record,
			weighbridgeOrderHaulierId = record.data.WeighbridgeOrderHaulierId,
			haulierId = record.data.HaulierId;

		//console.log('Record:', record.data);

		Ext.Msg.confirm('Remove All Vehicles', 'Are you sure you want to remove all vehicles?', function (btn) {
			if (btn == "yes") {

				Ext.Ajax.request({
					url: Utils.serverUrl + 'data/service.php?Service=WeighbridgeOrderHaulierVehicles_DeleteAll',
					method: 'POST',
					timeout: 8000, // 8 seconds.
					scope: me,

					params: {
						Params: JSON.stringify({
							WeighbridgeOrderHaulierId: weighbridgeOrderHaulierId,
							HaulierId: haulierId,
							Username: userInfo.username
						}),
						User: userInfo.username
					},

					success: function (response) {
						var obj = Ext.decode(response.responseText);

						// Check if the call was a success.
						if (obj.success === 'true') {
							// console.log("Vehicle Added:", record.data.VehicleId);
							this.refreshGridAssigned();
							this.refreshGridAvailable();
						} else {
							Ext.Msg.alert('Remove Haulier Vehicles', 'Could not remove all vehicles', Ext.emptyFn);
						}

					},

					failure: function (response) {
						Ext.Msg.alert('Remove Haulier Vehicles', 'Could not remove all vehicles', Ext.emptyFn);
					}
				});

			}
		});

	},

	refreshGridAvailable: function () {
		var me = this,
			window = me.getFormWindow(),
			record = window.record,
			gridPanel = me.getGridAvailable(),
			gridStore = gridPanel.getStore(),
			filterText = window.down('#textFilterAvailable').getValue(),
			showNonInducted = window.down('#checkboxShowNonInducted').getValue();

//        console.log('record:', record.data);
//        console.log('filterText:', filterText);
//        console.log('showNonInducted:', showNonInducted);

		// Build the query parameters.
		var params = JSON.stringify({
			WeighbridgeOrderHaulierId: record.data.WeighbridgeOrderHaulierId,
			IsInducted: showNonInducted === true ? '0' : '1',
			Filter: filterText
		});

		gridStore.currentPage = 1;

		// Pass the query parameters to the store proxy.
		gridStore.getProxy().extraParams = {
			Params: params,
			User: userInfo.username
		};

		window.suspendEvents();

		// Load the weighbridges.
		gridStore.load({
			scope: me,
			callback: function (records, operation, success) {
				window.resumeEvents();
				if (success) {
					//console.log('Available vehicles loaded:', gridStore.count());
				}
			}
		});

	},

	refreshGridAssigned: function () {
		var me = this,
			window = me.getFormWindow(),
			record = window.record,
			gridPanel = me.getGridAssigned(),
			gridStore = gridPanel.getStore(),
			filterText = window.down('#textFilterAssigned').getValue(),
			showNonInducted = window.down('#checkboxShowNonInducted').getValue();

//        console.log('record:', record.data);
//        console.log('filterText:', filterText);
//        console.log('showNonInducted:', showNonInducted);

		// Build the query parameters.
		var params = JSON.stringify({
			WeighbridgeOrderHaulierId: record.data.WeighbridgeOrderHaulierId,
			IsInducted: showNonInducted === true ? '0' : '1',
			Filter: filterText
		});

		gridStore.currentPage = 1;

		// Pass the query parameters to the store proxy.
		gridStore.getProxy().extraParams = {
			Params: params,
			User: userInfo.username
		};

		window.suspendEvents();

		// Load the weighbridges.
		gridStore.load({
			scope: me,
			callback: function (records, operation, success) {
				window.resumeEvents();
				if (success) {
					//console.log('Assigned vehicles loaded:', gridStore.count());
				}
			}
		});


	},

	init: function (application) {
		this.control({
			"orderhauliervehicleformwindow": {
				afterrender: this.onWindow_AfterRender
			},
			"orderhauliervehicleformwindow #gridAvailable": {
				beforerender: this.onGridAvailable_BeforeRender,
				beforedrop: this.onGridAvailable_BeforeDrop,
				drop: this.onGridAvailable_Drop,
				selectionchange: this.onGridAvailable_SelectionChange
			},
			"orderhauliervehicleformwindow #gridAssigned": {
				beforedrop: this.onGridAssigned_BeforeDrop,
				drop: this.onGridAssigned_Drop,
				selectionchange: this.onGridAssigned_SelectionChange
			},
			"orderhauliervehicleformwindow #checkboxShowNonInducted": {
				change: this.onInducted_Change
			},
			"orderhauliervehicleformwindow #textFilterAvailable": {
				change: this.onFilterAvailable_Change
			},
			"orderhauliervehicleformwindow #textFilterAssigned": {
				change: this.onFilterAssigned_Change
			},
			"orderhauliervehicleformwindow #buttonAssignAllVehicles": {
				click: this.onAssignAllVehicles_ButtonClick
			},
			"orderhauliervehicleformwindow #buttonRemoveAllVehicles": {
				click: this.onRemoveAllVehicles_ButtonClick
			}
		});
	}

});

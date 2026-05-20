Ext.define('WeighbridgeOrder.controller.OrderFormController', {
	extend: 'Ext.app.Controller',

	models: [
		'WeighbridgeOrder.model.WeighbridgeOrderHaulierModel'
	],

	stores: [
		'WeighbridgeOrder.store.WeighbridgeStore',
		'WeighbridgeOrder.store.WeighbridgeOrderStore',
		'WeighbridgeOrder.store.WeighbridgeProductStore',
		// Haulier related Stores.
		'WeighbridgeOrder.store.WeighbridgeOrderHaulierStore',
		'WeighbridgeOrder.store.WeighbridgeHaulierStore',
		'WeighbridgeOrder.store.WeighbridgeSubcontractorStore',
		// Supplier related Stores.
		'WeighbridgeOrder.store.WeighbridgeSupplierStore',
		'WeighbridgeOrder.store.WeighbridgeSupplierLocationStore',
		'WeighbridgeOrder.store.SupplierStockPileStore',
		// Customer related Stores.
		'WeighbridgeOrder.store.WeighbridgeCustomerStore',
		'WeighbridgeOrder.store.WeighbridgeCustomerLocationStore',
		'WeighbridgeOrder.store.CustomerStockPileStore'
	],

	refs: [
		{
			ref: 'orderFormWindow',
			selector: '#windowWeighbridgeOrderForm'
		},
		{
			ref: 'orderForm',
			selector: '#formPanelWeighbridgeOrderForm'
		},
		{
			ref: 'orderHaulierFormWindow',
			selector: '#windowWeighbridgeOrderHaulierForm'
		},
		{
			ref: 'gridOrderList',
			selector: 'weighbridgeorderlistwindow #gridOrderList'
		},
		{
			ref: 'gridHaulierList',
			selector: 'weighbridgeorderform #gridHaulierList'
		}
	],

	onForm_BeforeRender: function (component, eOpts) {
		var window = component.up('window'),
			form = component,
			formBasic = form.getForm(),
			tabHauliers = form.down('#panelHauliers'),
			queryParams;

		form.editMode = window.editMode;
		form.minMass = window.minMass;
		form.loadRecord(window.record);

		// Disable the Haulier tab.
		if (!form.editMode) {
			tabHauliers.disable();
		}

		// ----------------------------------------------------------------------

		// Load Assigned Hauliers.
		var gridHaulierList = form.down("#gridHaulierList");

		// Build the query parameters.
		queryParams = JSON.stringify({
			WeighbridgeOrderId: formBasic.getRecord().data.WeighbridgeOrderId
		});

		// Pass the query parameters to the store proxy.
		gridHaulierList.getStore().getProxy().extraParams = {
			Params: queryParams,
			User: userInfo.username
		};

		gridHaulierList.getStore().load();

	},

	onForm_AfterRender: function (component, eOpts) {
		var window = component.up('window'),
			form = component,
			formBasic = form.getForm(),
			data = formBasic.getRecord().getData(),
			title;

		let params = {
			OrganisationId: userInfo.organisationId,
			UserId: userInfo.userId
		};

		// Set the window title.
		if (form.editMode) {
			title = 'Order No: ' + formBasic.getRecord().data.OrderNo;
		} else {
			title = 'Create New Order';
		}

		window.setTitle(title);

		// Disable items for open orders.
		if (data.IsProcess) {
			form.down('#radioGroupIsReceipt').disable();
			formBasic.findField('ProductId').disable();
			form.down('#fieldsetDispatchInfo').disable();
			form.down('#fieldsetReceiptInfo').disable();
		}

		// Disable items for closed orders.
		if (data.IsComplete) {
			form.down('#fieldsetGeneralInfo').disable();
			form.down('#fieldsetProductInfo').disable();
			form.down('#fieldsetDispatchInfo').disable();
			form.down('#fieldsetReceiptInfo').disable();
			form.down('#buttonAddHaulier').disable();
			form.down('#gridHaulierList').disable();
		}

		var thisOrderNote = formBasic.getRecord().get('OrderNote');
		if (thisOrderNote) {
			window.down('[id=OrderNote]').setText(thisOrderNote);
		} else if (!form.editMode) {
			Ext.Ajax.request({
				url: Utils.serverUrl + 'data/service.php?Service=OrganisationSetting_UI_List',
				method: 'POST',
				timeout: 8000, // 8 seconds.
				scope: form,
				params: {
					Params: JSON.stringify(params)
				},
				success: function (response) {
					let ResultObject = Ext.decode(response.responseText);

					if (ResultObject.success === 'true') {

						let OrderVarianceEnabled = ResultObject.data[0].OrderVarianceEnabled;
						var newOrderMote = "";
						if (OrderVarianceEnabled) {
							newOrderMote += "A moisture adjustment will be applied on initial order creation.";
						}

						if (!newOrderMote.isEmpty) {
							newOrderMote = "Note: " + newOrderMote;
						}

						// Set note.
						window.down('[id=OrderNote]').setText(newOrderMote);
					} else {
						Ext.Msg.alert(Utils.title, ResultObject.data[0].message, Ext.emptyFn);
					}
				},
				failure: function (response) {
					let obj = Ext.decode(response.responseText);

					Ext.Msg.alert(Utils.title, obj.message, Ext.emptyFn);
				}
			});
		}
	},

	onOk_ButtonClick: function (button, e, eOpts) {
		// Save the order, and close the form.
		this.saveOrder(true);
	},

	onApply_ButtonClick: function (button, e, eOpts) {
		// Save the order, but don't close the form.
		this.saveOrder(false);
	},

	onCancel_ButtonClick: function (button, e, eOpts) {
		var me = this,
			window = button.up('window');

		// Close the window.
		window.destroy();
	},

	onHaulierGrid_ItemDblClick: function (dataview, record, item, index, e, eOpts) {
		// Show the form window.
		this.showHaulierFormWindow(true, record);
	},

	onHaulierGrid_ItemContextMenu: function (dataview, record, item, index, e, eOpts) {
		var me = this;

		// Stop event so browser's normal right-click action doesn't continue.
		e.stopEvent();

		// if a menu doesn't already exist, create one.
		if (!item.contextMenu) {

			// Build the right-click menu.
			item.contextMenu = Ext.create('Ext.menu.Menu', {
				items: [
					{
						text: 'Assign Vehicles',
						handler: function (item, e) {
							//console.log("Assign Vehicles:", record.data);
							// Edit the current order.
							me.showHaulierVehicleFormWindow(record);
						}
					}
				]
			});
		}

		// Display the right-click menu..
		var xy = [e.getPageX() + 10, e.getPageY()];
		item.contextMenu.showAt(xy);
	},

	onAddHaulier_ButtonClick: function (button, e, eOpts) {
		var me = this,
			form = button.up('form'),
			formBasic = form.getForm(),
			formValues = formBasic.getValues(),
			formRecord = formBasic.getRecord(),
			weighbridgeOrderId = formRecord.data.WeighbridgeOrderId,
			haulierOrderNo = formValues.IsReceipt === '1' ? formValues.CustomerOrderNo : formValues.SupplierOrderNo,
			estimatedMass = formBasic.findField("EstimatedMass").getValue(),
			allocatedMass;

		// Subtract all already allocated mass except this record.
		allocatedMass = me.calcAllocatedMass();

		// Create an order haulier.
		var record = Ext.create('WeighbridgeOrder.model.WeighbridgeOrderHaulierModel', {
			WeighbridgeOrderId: weighbridgeOrderId,
			OrderNo: haulierOrderNo,
			EstimatedMass: estimatedMass - allocatedMass,
			IsActive: true,
			OrganisationId: userInfo.organisationId,
			Username: userInfo.username
		});

		// Show the form window.
		this.showHaulierFormWindow(false, record);
	},

//	onIsReceipt_BeforeRender: function (component, eOpts) {
//		// The transaction type has changed.
//		this.setTransactionType(component);
//	},

	onIsReceipt_Change: function (field, newValue, oldValue, eOpts) {
		// The transaction type has changed.
		this.setTransactionType(field);
	},

	onProduct_ComboboxSelect: function (combo, records, eOpts) {
		// Clear the automatic store filter.
		combo.getStore().clearFilter();

		// Load the stock piles for the current product and locations.
		this.loadSupplierStockPiles();
		this.loadCustomerStockPiles();
	},

	onSupplierLocationId_Select: function (combo, records, eOpts) {
		// Clear the automatic store filter.
		combo.getStore().clearFilter();

		// Load the stock piles for the current location.
		this.loadSupplierStockPiles();
	},

	onCustomerLocationId_Select: function (combo, records, eOpts) {
		// Clear the automatic store filter.
		combo.getStore().clearFilter();

		// Load the stock piles for the current location.
		this.loadCustomerStockPiles();
	},

	onCustomerId_Select: function (combo, records, eOpts) {
		// Clear the automatic store filter.
		combo.getStore().clearFilter();
	},

	onSupplierId_Select: function (combo, records, eOpts) {
		// Clear the automatic store filter.
		combo.getStore().clearFilter();
	},

	onCustomerStockPileId_BeforeQuery: function(queryPlan, eOpts) {
		console.log('onCustomerStockPileId_BeforeQuery');
		queryPlan.combo.lastQuery = '';
		this.loadCustomerStockPiles();
	},

	onSupplierStockPileId_BeforeQuery: function(queryPlan, eOpts) {
		console.log('onSupplierStockPileId_BeforeQuery');
		queryPlan.combo.lastQuery = '';
		this.loadSupplierStockPiles();
	},

	onTab_TabChange: function (tabPanel, newCard, oldCard, eOpts) {
		//console.log('onTab_TabChange');
		if (newCard.itemId === 'panelHauliers') {
			this.refreshAllocatedMass();
		}
	},

	onRefreshAllocatedMass_ButtonClick: function (button, e, eOpts) {
		var me = this;
		me.refreshAllocatedMass();
	},

	calcAllocatedMass: function () {
		var me = this,
			gridPanel = me.getGridHaulierList(),
			gridStore = gridPanel.getStore(),
			allocatedMass = 0;

		gridStore.each(function (record) {
			allocatedMass += record.data.EstimatedMass;
		});

		return allocatedMass;
	},

	refreshAllocatedMass: function () {
		var me = this,
			form = me.getOrderForm(),
			formBasic = form.getForm(),
			estimatedMass = formBasic.findField("EstimatedMass").getValue(),
			displayAllocatedMass = form.down('#displayAllocatedMass'),
			displayUnallocatedMass = form.down('#displayUnallocatedMass');

		// Calculated allocated mass.
		var allocatedMass = me.calcAllocatedMass();

		displayAllocatedMass.setValue(allocatedMass);
		displayUnallocatedMass.setValue(estimatedMass - allocatedMass);
	},

	loadCustomerStockPiles: function () {
		var me = this,
			form = me.getOrderForm(),
			formBasic = form.getForm(),
			comboStockPile = formBasic.findField("CustomerStockPileId"),
			productId = formBasic.findField("ProductId").getValue(),
			locationId = formBasic.findField("CustomerLocationId").getValue(),
			stockPileId = formBasic.findField("CustomerStockPileId").getValue();

		//console.log('Load customer StockPiles:', productId, locationId);

		// Filter StockPiles.
		var store = Ext.getStore('WeighbridgeOrder.store.CustomerStockPileStore');
		store.clearFilter();
		store.filterBy(function (record, id) {
			if (record.data.WeighbridgeLocationId == 0 && record.data.WeighbridgeProductId == 0) {
				console.log('StockPile:', record.data.StockPileName);
				return true;
			} else {
				if (record.data.WeighbridgeLocationId == locationId && record.data.WeighbridgeProductId == productId) {
					console.log('StockPile:', record.data.StockPileName);
					return true;
				} else {
					//console.log('Invalid StockPile:', record.data);
					return false;
				}
			}
		});

		// Make sure the selected value is in the list otherwise default to 0.
		if (!comboStockPile.findRecordByValue(stockPileId)) {
			//console.log('Customer StockPile Record Not Found:', stockPileId);
			comboStockPile.setValue(0);
		} else {
			//console.log('Customer StockPile Record Found:', comboStockPile.findRecordByValue(stockPileId));
		}

	},

	loadSupplierStockPiles: function () {
		var me = this,
			form = me.getOrderForm(),
			formBasic = form.getForm(),
			comboStockPile = formBasic.findField("SupplierStockPileId"),
			productId = formBasic.findField("ProductId").getValue(),
			locationId = formBasic.findField("SupplierLocationId").getValue(),
			stockPileId = formBasic.findField("SupplierStockPileId").getValue();

		//console.log('Load Supplier StockPiles:', productId, locationId);

		// Filter StockPiles.
		var store = Ext.getStore('WeighbridgeOrder.store.SupplierStockPileStore');
		store.clearFilter();
		store.filterBy(function (record, id) {
			if (record.data.WeighbridgeLocationId == 0 && record.data.WeighbridgeProductId == 0) {
				//console.log('StockPile:', record.data.StockPileName);
				return true;
			} else {
				if (record.data.WeighbridgeLocationId == locationId && record.data.WeighbridgeProductId == productId) {
					//console.log('StockPile:', record.data.StockPileName);
					return true;
				} else {
					//console.log('Invalid StockPile:', record.data);
					return false;
				}
			}
		});

		// Make sure the selected value is in the list otherwise default to 0.
		if (!comboStockPile.findRecordByValue(stockPileId)) {
			//console.log('Supplier StockPile Record Not Found:', stockPileId);
			comboStockPile.setValue(0);
		} else {
			//console.log('Supplier StockPile Record Found:', comboStockPile.findRecordByValue(stockPileId));
		}


	},

	setTransactionType: function (component) {
		var form = component.up('form'),
			formBasic = form.getForm(),
			radioGroup = component,
			isReceipt = radioGroup.getValue().IsReceipt,
			comboCustomer = formBasic.findField('CustomerId'),
			comboSupplier = formBasic.findField('SupplierId'),
			customerId = comboCustomer.getValue(),
			supplierId = comboSupplier.getValue();

		//console.log('IsReceipt:', isReceipt);

		// Update order type label.
//		if (isReceipt) {
//			checkbox.setFieldLabel('This order is a Receipt');
//		} else {
//			checkbox.setFieldLabel('This order is a Dispatch');
//		}

		if (isReceipt === '1') {

			// Set the Customer to the current organisation.
			if (customerId !== userInfo.organisationId) {
				comboCustomer.setValue(userInfo.organisationId);
			}
			formBasic.findField('CustomerId').disable();
			formBasic.findField('SupplierId').enable();

		} else {

			// Set the Supplier to the current organisation.
			if (supplierId !== userInfo.organisationId) {
				comboSupplier.setValue(userInfo.organisationId);
			}
			formBasic.findField('CustomerId').enable();
			formBasic.findField('SupplierId').disable();

		}

	},

	saveOrder: function (closeForm) {
		var me = this,
			window = me.getOrderFormWindow(),
			form = window.down('form'),
			formBasic = form.getForm(),
			formValues = formBasic.getValues(),
			tabHauliers = form.down('#panelHauliers'),
			record = formBasic.getRecord(),
			gridPanel = me.getGridOrderList(),
			gridStore = gridPanel.getStore();
		//textWeighbridgeOrderId = formBasic.findField("WeighbridgeOrderId");

		//console.log('Form Values:', formBasic.getValues());

		// Make sure the EstimatedMass is greater if this order has already been processed.
		if (record.data.IsProcess && formValues.EstimatedMass < form.minMass) {
			Ext.Msg.show({
				title: 'Weighbridge Order - Save',
				msg: 'The estimated mass cannot be less for a processed order. Minimum mass: ' + form.minMass,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
			return;
		}

		// Update record with form values.
		record.set(form.getValues());

		//console.log('Order Record:', record.data);

		// Make sure the form is valid before attempting to save the record.
		if (!formBasic.isValid()) {

			// Show form validation message.
			Ext.Msg.show({
				title: 'Weighbridge Order',
				msg: 'The form contains validation errors, please correct them.',
				icon: Ext.MessageBox.ERROR,
				buttons: Ext.Msg.OK
			});

			return;
		}

		// Check if there were any changes.
		if (formBasic.isDirty()) {

			// Show a mask for the user.
			form.getEl().mask('Saving...', 'x-mask-loading');

			// If it's a new record, add it to the store.
			if (!form.editMode) {
				gridStore.add(record);
			}

			// Attempt to save the changes.
			gridStore.sync({
				scope: me,
				success: function (batch, options) {

					// Hide mask.
					form.getEl().unmask();

					// Refresh the grid record with new values.
					gridPanel.getView().refresh();

					if (!form.editMode) {

						// Enable the Hauliers tab if disabled.
						tabHauliers.enable();
						form.editMode = true;
						window.setTitle('Order No: ' + formBasic.getRecord().data.OrderNo + ' - ' + formBasic.getRecord().data.WeighbridgeOrderId);
					}

					// Form is staying open, so update WeighbridgeOrderId.
					if (!closeForm) {
						formBasic.loadRecord(record);
						//textWeighbridgeOrderId.setValue('WeighbridgeOrderId', record.data.WeighbridgeOrderId);
					}

					// Record saved, so close edit window.
					if (closeForm) {
						window.destroy();
					}

				},
				failure: function (batch, options) {

					// Error handled by global proxyError in Utils.js
					console.log("Sync: failure", options);

					// Hide mask.
					form.getEl().unmask();

					// Remove orphan record from store.
					gridStore.remove(record);

				},
				callback: function () {
					//console.log("Sync: callback");
				}
			});

		} else {

			console.log("Form has no changes");

			// Close the form.
			if (closeForm) {
				window.destroy();
			}

		}
	},

	showHaulierFormWindow: function (editMode, record) {
		var me = this,
			win = me.getOrderHaulierFormWindow(),
			orderForm = me.getOrderForm(),
			orderFormBasic = orderForm.getForm(),
			estimatedMass = orderFormBasic.findField("EstimatedMass").getValue(),
			allocatedMass;

		//console.log('EstimatedMass:', estimatedMass);

		// Subtract all already allocated mass except this record.
		allocatedMass = me.calcAllocatedMass();
		//console.log('allocatedMass - all:', allocatedMass);


		if (editMode) {
			allocatedMass = allocatedMass - record.data.EstimatedMass;
			//console.log('allocatedMass - current:', record.data.EstimatedMass);
		}

		//console.log('allocatedMass - to allocate:', allocatedMass);
		//console.log('maxMass:', estimatedMass - allocatedMass);

		// Does the form already exist?
		if (!win) {

			// Create an instance of the form.
			win = Ext.create('WeighbridgeOrder.view.OrderHaulierFormWindow', {
				constrain: true,
				editMode: editMode,
				maxMass: estimatedMass - allocatedMass,
				record: record
			});

		}

		// Show the window.
		win.show();
	},

	showHaulierVehicleFormWindow: function (record) {
		var me = this,
			window = me.getOrderHaulierFormWindow();

		// Does the form already exist?
		if (!window) {

			// Create an instance of the form.
			window = Ext.create('WeighbridgeOrder.view.OrderHaulierVehicleFormWindow', {
				constrain: true,
				record: record
			});

		}

		//console.log('Haulier:', record.data);

		// var form = window.down('form');

		// // Load form with data.
		// form.loadRecord(record);

		// Show the window.
		window.show();
	},

	init: function (application) {
		this.control({
			"#formPanelWeighbridgeOrderForm": {
				beforerender: this.onForm_BeforeRender,
				afterrender: this.onForm_AfterRender
			},
			"weighbridgeorderformwindow #buttonOk": {
				click: this.onOk_ButtonClick
			},
			"weighbridgeorderformwindow #buttonApply": {
				click: this.onApply_ButtonClick
			},
			"weighbridgeorderformwindow #buttonCancel": {
				click: this.onCancel_ButtonClick
			},
			"weighbridgeorderform #gridHaulierList": {
				itemdblclick: this.onHaulierGrid_ItemDblClick,
				itemcontextmenu: this.onHaulierGrid_ItemContextMenu
			},
			"weighbridgeorderform #buttonAddHaulier": {
				click: this.onAddHaulier_ButtonClick
			},
//			"weighbridgeorderform #checkboxIsReceipt": {
//				beforerender: this.onIsReceipt_BeforeRender,
//				change: this.onIsReceipt_Change
//			},
			"weighbridgeorderform #radioGroupIsReceipt": {
				change: this.onIsReceipt_Change
			},
			"weighbridgeorderform #comboProductId": {
				select: this.onProduct_ComboboxSelect
			},
			"weighbridgeorderform #comboSupplierLocationId": {
				select: this.onSupplierLocationId_Select
			},
			"weighbridgeorderform #comboCustomerLocationId": {
				select: this.onCustomerLocationId_Select
			},
			"weighbridgeorderform #comboCustomerId": {
				select: this.onCustomerId_Select
			},
			"weighbridgeorderform #comboSupplierId": {
				select: this.onSupplierId_Select
			},
			"weighbridgeorderform #comboCustomerStockPileId": {
				beforequery: this.onCustomerStockPileId_BeforeQuery
			},
			"weighbridgeorderform #comboSupplierStockPileId": {
				beforequery: this.onSupplierStockPileId_BeforeQuery
			},
			"weighbridgeorderform #tabPanelOrderForm": {
				tabchange: this.onTab_TabChange
			},
			"weighbridgeorderform #buttonRefreshAllocatedMass": {
				click: this.onRefreshAllocatedMass_ButtonClick
			}
		});
	}

});

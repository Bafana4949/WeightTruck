Ext.define('WeighbridgeOrder.controller.OrderHaulierFormController', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'orderHaulierFormWindow',
            selector: '#windowWeighbridgeOrderHaulierForm'
        },
        {
            ref: 'orderHaulierVehicleFormWindow',
            selector: '#windowWeighbridgeOrderHaulierVehicleForm'
        },
        {
            ref: 'gridHaulierList',
            selector: 'weighbridgeorderform #gridHaulierList'
        },
		{
			ref: 'buttonRefreshAllocatedMass',
			selector: 'weighbridgeorderform #buttonRefreshAllocatedMass'
		}
    ],

    onOk_ButtonClick: function(button, e, eOpts) {
        var me = this,
            window = button.up('window'),
            form = window.down('form'),
            formBasic = form.getForm(),
            record = formBasic.getRecord(),
            gridPanel = me.getGridHaulierList(),
            gridStore = gridPanel.getStore();

        // Update record with form values.
        record.set(form.getValues());

		var comboSubcontractorId = formBasic.findField("SubcontractorId");

//		console.log('comboSubcontractorId Text:', comboSubcontractorId.getRawValue());
//		console.log('comboSubcontractorId:', comboSubcontractorId.getValue());
//		console.log('comboSubcontractorId isDirty', comboSubcontractorId.isDirty());

		if (comboSubcontractorId.isDirty()) {
			if (comboSubcontractorId.getRawValue() === ''){
				record.set('SubcontractorId', null);
			}
		}

//        console.log('Form Values:', form.getValues());
//        console.log('Form Record:', record.data);
//        console.log('Form IsDirty:', formBasic.isDirty());
//        console.log('Form IsValid:', formBasic.isValid());

//        console.log('EstimatedMass:', record.data.EstimatedMass);
//        console.log('maxMass:', window.maxMass);

		// Make sure the allocated mass is not more than the estimated mass for the order.
		if (record.data.EstimatedMass > window.maxMass) {

//			console.log('Max Mass:', form.maxMass);
//			console.log('Allocated Mass:', record.data.EstimatedMass);

			// Show form validation message.
			Ext.Msg.show({
				title: 'Order Haulier',
				msg: 'The allocated mass exceeds the estimated mass for the order.',
				icon: Ext.MessageBox.ERROR,
				buttons: Ext.Msg.OK
			});

			return;
		}

        // Make sure the form is valid before attempting to save the record.
        if (!formBasic.isValid()) {

            // Show form validation message.
            Ext.Msg.show({
                title: 'Weighbridge Order Haulier',
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
            if (!window.editMode) {
                gridStore.add(record);
            }

            // Attempt to save the changes.
            gridStore.sync({
                scope: me,
                success: function (batch, options) {
                    //console.log("Sync: success", options);

                    // Hide mask.
                    form.getEl().unmask();

                    // Refresh the grid record with new values.
                    gridPanel.getView().refresh();


                    // TODO: Recalculate Allocated Mass.
					me.getButtonRefreshAllocatedMass().fireEvent('click');
                    //console.log(this.getController('OrderFormController').refreshAllocatedMass());

                    // Record saved, so close edit window.
                    window.destroy();

                },
                failure: function (batch, options) {

                    // Error handled by global proxyError in Utils.js
                    console.log("Could not save Order Haulier");

                    // Hide mask.
                    form.getEl().unmask();

                    // Remove orphan record from store.
                    gridStore.remove(record);

                }
            });

        } else {

            console.log("Form has no changes");

            // Close the form.
            window.destroy();

        }
    },

    onCancel_ButtonClick: function(button, e, eOpts) {
        var me = this,
            window = button.up('window');

        // Close the window.
        window.destroy();
    },

	onForm_BeforeRender: function(component, eOpts) {
		var window = component.up('window'),
			form = component;

		form.loadRecord(window.record);
	},

	onForm_AfterRender: function(component, eOpts) {
		var window = component.up('window'),
			form = component,
			formBasic = form.getForm();

		// Set the window title.
		if (window.editMode) {
			window.setTitle('Haulier: ' + formBasic.getRecord().data.HaulierName);
		} else {
			window.setTitle('Add Haulier');
		}

	},

	onHaulierId_Select: function (combo, records, eOpts) {
		// Clear the automatic store filter.
		combo.getStore().clearFilter();
	},

    init: function(application) {
        this.control({
            "weighbridgeorderhaulierformwindow #buttonOk": {
                click: this.onOk_ButtonClick
            },
            "weighbridgeorderhaulierformwindow #buttonCancel": {
                click: this.onCancel_ButtonClick
            },
            "weighbridgeorderhaulierformwindow #formOrderHaulier": {
				beforerender: this.onForm_BeforeRender,
                afterrender: this.onForm_AfterRender
            },
			"weighbridgeorderhaulierformwindow #comboHaulierId": {
				select: this.onHaulierId_Select
			}
        });
    }

});

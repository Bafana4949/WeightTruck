Ext.define('Framework.controller.Framework', {
    extend: 'Ext.app.Controller',
    alias: 'widget.frameworkcontroller',

    requires: [
        'Framework.view.feedback.ChangeCategory',
        'Framework.view.feedback.ChangeStatus',
        'Framework.view.feedback.ChangeType',
        'Framework.view.feedback.Comment',
        'Framework.view.feedback.Post',
        'Utils'
    ],

    models: [
        'Framework.model.Permission',
        'Framework.model.Feedback',
        'Framework.model.Notification',
        'Framework.model.Password',
        'Framework.model.Comment',
        'Framework.model.FeedbackStatus'
    ],

    views: [
        'Framework.view.bar.Main',
        'Framework.view.button.Notification',
        'Framework.view.button.Organisation',
        'Framework.view.button.User',
        'Framework.view.button.Fleet',
        'Framework.view.button.Fuel',
        'Framework.view.button.Security',
        'Framework.view.button.Weighbridge',
        'Framework.view.window.Form',
        'Framework.view.window.Information',
        'Framework.view.window.Window',
        'Framework.view.Viewport',
        'Framework.view.Panel',
        'Framework.view.notification.Window',
        'Framework.view.notification.Notification'
    ],

    init: function () {
        var me = this;
        me.control({
            'framework menuitem': {
                click: this.doMenuItemClick
            },
            'googlemap > toolbar > button[text=Close]': {
                click: this.doCancel
            },
            'changepassword > toolbar > button[action=Cancel]': {
                click: this.doCancel
            },
            'changepassword > toolbar > button[action=Ok]': {
                click: this.doPassword
            },

            'feedbacksubmit > toolbar > button[text=Ok]': {
                click: this.doSendFeedback
            },
            'feedbacksubmit > toolbar > button[text=Cancel]': {
                click: this.doCancel
            },
            'feedbackcenter > container > grid > gridview': {
                //itemdblclick: this.doFeedbackItemClick
                itemclick: this.doFeedbackItemClick
            },
            'feedbackcenter > container > panel > toolbar > button[action=Comment]': {
                click: this.doComment
            },
            'feedbackcentercomment > toolbar > button[action=Ok]': {
                click: this.doCommentSave
            },
            'feedbackcentercomment > toolbar > button[action=Cancel]': {
                click: this.doCancel
            },
            'feedbackcentercategory > toolbar > button[action=Cancel]': {
                click: this.doCancel
            },
            'feedbackcentercategory > toolbar > button[action=Ok]': {
                click: this.doFeedbackCategoryOk
            },
            'feedbackcentertype > toolbar > button[action=Cancel]': {
                click: this.doCancel
            },
            'feedbackcentertype > toolbar > button[action=Ok]': {
                click: this.doFeedbackTypeOk
            },
            'feedbackcenterstatus > toolbar > button[action=Cancel]': {
                click: this.doCancel
            },
            'feedbackcenterstatus > toolbar > button[action=Ok]': {
                click: this.doFeedbackStatusOk
            },
            'feedbackcenter > container > grid > toolbar > button[text=Status]': {
                click: this.doFeedbackStatus
            },
            'feedbackcenter > container > grid > toolbar > button[text=Type]': {
                click: this.doFeedbackType
            },
            'feedbackcenter > container > grid > toolbar > button[text=Category]': {
                click: this.doFeedbackCategory
            },

            'notificationpanel button[text=View]': {
                click: this.doNotificationView
            }
        });
    },

    doNotificationView: function (component) {
        var feature = Ext.ComponentQuery.query(component.record.data.Xtype)[0];

        if (feature === null || feature === undefined) {
            try {
                var controller = component.record.data.Class.split(".")[0];
                controller += ".controller." + controller;

                this.application.addController(controller);

                Ext.create(component.record.data.Class, {
                    renderTo: 'framework'
                }).show();
            } catch (e) {
                alert('There was an error while attempting to run this feature.*' + e);
                console.log(e);
            }
        } else {
            feature.show();
        }
    },

    doFeedbackTypeOk: function (component) {
        var me = this,
            window = component.up('window'),
            form = window.down('form').getForm();

        if (!form.isValid()) {
            Ext.MessageBox.show({
                title: 'INVALID FORM DETAILS',
                msg: 'Invalid field input. Form can not be saved.',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        } else {
            var mask = Ext.create('Ext.LoadMask', component.up('window'), {msg: "Saving..."}).show();
            var ticket = form.getRecord();
            ticket.set(form.getValues());
            ticket.data.Username = userInfo.username;
            ticket.save();

            var record = Ext.create('Framework.model.Comment', {});
            record.data.Message = Ext.htmlEncode("Greetings,</br></br>Your support ticket's type has been changed to <b>" + ticket.data.Type + "</b>.</br></br>Regards,</br>The TonTrac Team");
            record.data.UserId = userInfo.userId;
            record.data.Username = userInfo.username;
            record.data.FeedbackId = window.record.data.FeedbackId;
            record.save({
                scope: this,
                callback: function (batch, options) {
                    if (options.complete) {
                        window.app.list.store.load();
                        window.app.down('panel[action=Post]').store.load();
                        mask.destroy();
                        me.doCancel(component);
                    }
                }
            });
        }
    },

    doFeedbackStatusOk: function (component) {
        var me = this,
            window = component.up('window'),
            feedbackStatus = window.down('form > combo'),
            form = window.down('form').getForm();

        if (!form.isValid()) {
            Ext.MessageBox.show({
                title: 'INVALID FORM DETAILS',
                msg: 'Invalid field input. Form can not be saved.',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        } else {
            var mask = Ext.create('Ext.LoadMask', component.up('window'), {msg: "Saving..."}).show();
            var ticket = form.getRecord();
            ticket.set(form.getValues());
            ticket.data.Username = userInfo.username;
            ticket.save();

            var record = Ext.create('Framework.model.Comment', {});
            record.data.Message = Ext.htmlEncode("Greetings,</br></br>Your support ticket's status has been changed to <b>" + feedbackStatus.rawValue + "</b>.</br></br>Regards,</br>The TonTrac Team");
            record.data.UserId = userInfo.userId;
            record.data.Username = userInfo.username;
            record.data.FeedbackId = window.record.data.FeedbackId;
            record.save({
                scope: this,
                callback: function (batch, options) {
                    if (options.complete) {
                        window.app.list.store.load();
                        window.app.down('panel[action=Post]').store.load();
                        mask.destroy();
                        me.doCancel(component);
                    }
                }
            });
        }
    },

    doFeedbackCategoryOk: function (component) {
        var me = this,
            window = component.up('window'),
            form = window.down('form').getForm();

        if (!form.isValid()) {
            Ext.MessageBox.show({
                title: 'INVALID FORM DETAILS',
                msg: 'Invalid field input. Form can not be saved.',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        } else {
            var mask = Ext.create('Ext.LoadMask', component.up('window'), {msg: "Saving..."}).show();
            var ticket = form.getRecord();
            ticket.set(form.getValues());
            ticket.data.Username = userInfo.username;
            ticket.save();

            var record = Ext.create('Framework.model.Comment', {});
            record.data.Message = Ext.htmlEncode("Greetings,</br></br>Your support ticket's category has been changed to <b>" + ticket.data.Category + "</b>.</br></br>Regards,</br>The TonTrac Team");
            record.data.UserId = userInfo.userId;
            record.data.Username = userInfo.username;
            record.data.FeedbackId = window.record.data.FeedbackId;
            record.save({
                scope: this,
                callback: function (batch, options) {
                    if (options.complete) {
                        window.app.list.store.load();
                        window.app.down('panel[action=Post]').store.load();
                        mask.destroy();
                        me.doCancel(component);
                    }
                }
            });
        }
    },

    doFeedbackStatus: function (component) {
        var win = component.up('window'),
            post = component.up('panel'),
            arraySelected = component.up('gridpanel').getSelectionModel().getSelection(),
            record = arraySelected[0];

        Ext.create('Framework.view.feedback.ChangeStatus', {
            animateTarget: component,
            app: win,
            record: record
        }).show();
    },

    doFeedbackType: function (component) {
        var win = component.up('window'),
            post = component.up('panel'),
            arraySelected = component.up('gridpanel').getSelectionModel().getSelection(),
            record = arraySelected[0];

        Ext.create('Framework.view.feedback.ChangeType', {
            animateTarget: component,
            app: win,
            record: record
        }).show();
    },

    doFeedbackCategory: function (component) {
        var win = component.up('window'),
            post = component.up('panel'),
            arraySelected = component.up('gridpanel').getSelectionModel().getSelection(),
            record = arraySelected[0];

        Ext.create('Framework.view.feedback.ChangeCategory', {
            animateTarget: component,
            app: win,
            record: record
        }).show();
    },

    doCommentSave: function (component) {
        var me = this,
            window = component.up('window'),
            form = window.down('form').getForm();

        if (!form.isValid()) {
            Ext.MessageBox.show({
                title: 'INVALID FORM DETAILS',
                msg: 'Invalid field input. Form can not be saved.',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        } else {
            var mask = Ext.create('Ext.LoadMask', component.up('window'), {msg: "Saving..."}).show();
            var record = Ext.create('Framework.model.Comment', {});
            record.data.Message = Ext.htmlEncode((form.getValues()).Message);
            record.data.UserId = userInfo.userId;
            record.data.Username = userInfo.username;
            record.data.FeedbackId = window.record.data.FeedbackId;
            record.save({
                scope: this,
                callback: function (batch, options) {
                    if (options.complete) {
                        window.app.store.load();
                        mask.destroy();
                        me.doCancel(component);
                    }
                }
            });
        }
    },

    doComment: function (component) {
        var win = component.up('window'),
            post = component.up('panel');

        Ext.create('Framework.view.feedback.Comment', {
            animateTarget: component,
            app: post,
            record: post.record
        }).show();
    },

    doFeedbackItemClick: function (component, record) {
        var win = component.up('window'),
            ticket = win.down('container[region=center]');
        ticket.removeAll();
        ticket.add(
            Ext.create('Framework.view.feedback.Post', {app: win, record: record})
        );
        ticket.down('button[action=Comment]').enable();
    },

    doSendFeedback: function (component) {
        var me = this,
            record = null,
            window = component.up('window'),
            form = window.down('form').getForm();

        if (!form.isValid()) {
            Ext.MessageBox.show({
                title: 'INVALID FORM DETAILS',
                msg: 'Invalid field input. Form can not be saved.',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        } else {
            var mask = Ext.create('Ext.LoadMask', component.up('window'), {msg: "Saving..."}).show();
            record = Ext.create('Framework.model.Feedback', {
                Feature: window.supportwindow.__proto__.$className
            });
            record.set(form.getValues());
            record.data.UserId = userInfo.userId;
            record.data.OrganisationId = userInfo.organisationId;
            record.data.Username = userInfo.username;
            record.data.Type = window.filter;
            record.save({
                scope: this,
                callback: function (batch, options) {
                    if (options.complete) {
                        mask.destroy();
                        me.doCancel(component);
                    }
                }
            });
        }
    },

    doPassword: function (component) {
        var form = component.up('window').down('form').getForm(),
            values = form.getValues();
        const {OldPassword, NewPassword, ConfirmPassword} = values;

        // console.log('Framework Controller -> doPassword:', values);

        // Check that the old password is not blank.
        if (OldPassword.trim() === '') {
            Ext.MessageBox.show({
                title: 'Blank Password',
                msg: 'Your current password is blank. Please ensure you enter your current password correctly.',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
            return;
        }

        // Check that the new password is not blank.
        if (NewPassword.trim() === '') {
            Ext.MessageBox.show({
                title: 'Blank Password',
                msg: 'Your new password is blank. Please ensure you enter your new password correctly.',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
            return;
        }

        // Check that the New and Confirm passwords match.
        if (NewPassword !== ConfirmPassword) {
            Ext.MessageBox.show({
                title: 'Password Mismatch',
                msg: 'The new password and confirm password do not match.',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
            return;
        }

        if (form.isValid()) {
            var record = Ext.create('Framework.model.Password', {});

            // Update required model parameters.
            record.set(values);
            record.data.UserId = userInfo.userId;
            record.data.Username = userInfo.username;

            // Attempt to save record to the database.
            record.save({
                success: function () {
                    component.up('window').destroy();
                },
                failure: function () {
                    //nothing
                }
            });

        } else {
            Ext.MessageBox.show({
                title: 'INVALID FORM DETAILS',
                msg: 'Invalid field input. Form can not be saved.',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        }
    },

    doMenuItemClick: function (component) {
        var feature = Ext.ComponentQuery.query(component.featureAlias)[0] || null;

        var params = {
            ApplicationId: component.applicationId,
            ApplicationName: component.module,
            FeatureName: component.text,
            OrganisationId: userInfo.organisationId,
            AuditUserId: userInfo.userId,
            AuditUsername: userInfo.username
        };

        if (feature === null || feature === undefined) {
            try {
                var controller = component.featureClass.split(".")[0];

                controller += ".controller." + controller;
                this.application.addController(controller);

                Ext.Ajax.request({
                    url: Utils.serverUrl + 'data/service.php?Service=AuditFeature_Save',

                    method: 'POST',
                    params: {
                        Params: JSON.stringify(params)
                    },
                    success: function (response) {
                        var results = Ext.decode(response.responseText);

                        //console.log('AuditFeature Sucess:', response.responseText);
                    },
                    failure: function (response) {
                        console.log('AuditFeature Failure:', response, params.ApplicationName, params.FeatureName);
                    }
                });

                Ext.create(component.featureClass, {
                    animateTarget: component,
                    renderTo: 'framework',
                    featureMenuItem: component
                }).show();

            } catch (e) {
                console.log('doMenuItemClick:', {
                    Module: params.ApplicationName,
                    Feature: params.FeatureName
                });
                console.log('doMenuItemClick Error:', e);
                Ext.Msg.alert(Utils.title, 'There was an error while attempting to run ' + params.FeatureName + '.<br><br>' + e + '.', Ext.emptyFn);
            }
        } else {
            feature.show();
        }

    },

    doCancel: function (component) {
        component.up('window').doClose();
    }

});
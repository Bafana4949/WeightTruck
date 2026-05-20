Ext.define('Utils', {

    requires: [],

    singleton: true,

    // Server URLS.
    serverUrl: '',
    //serverUrl: 'http://192.168.1.12:8080/TonTrac/TonTracDesktop/',
    //serverUrl: 'http://devserver.tontrac.co.za/',
    //serverUrl: 'http://www.tontrac.co.za/',
    //serverUrl: 'http://192.168.1.14:8080/TonTracDesktop/',

    // Title.
    title: 'TonTrac Management',

    // Console.log
    log: function (obj) {
        if (true) {
            console.log(obj);
        }
    },

    // Generates appropriate error message on proxy failure
    proxyError: function (proxy, response, operation) {
        var json = Ext.decode(response.responseText);
        console.log(json);

        if (json.success === "false") {
            Ext.MessageBox.show({
                title: 'Attention',
                msg: json.message,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        } else {
            Ext.MessageBox.show({
                title: 'ERROR',
                msg: 'An error occurred. Please contact your administrator.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    },

    // Create a simple notification
    notification: function (title, text, icon, duration) {
        if (duration == null || duration == undefined) {
            duration = 5000;
        }
        Ext.create('Ext.ux.Notification', {
            title: title,
            position: 'bl',
            iconCls: icon,
            autoHideDelay: duration,
            spacing: 5,
            html: text
        }).show();
    },

    // Create a description notification
    description: function (title, text, icon, duration) {
        if (duration == null || duration == undefined) {
            duration = 10000;
        }

        Ext.create('Ext.ux.Notification', {
            title: title,
            position: 't',
            iconCls: icon,
            autoHideDelay: duration,
            spacing: 5,
            html: text
        }).show();

    },

    // Image icon for active grid column.
    columnRenderActive: function (value) {
        if (value) {
            return '<span style="color: limegreen; font-weight: bold;">' + '&#x2713;' + '</span>';
        } else {
            return '<span style="color: orangered; font-weight: bold;">' + '&#x2717;' + '</span>';
        }
    },

    columnRenderActiveOpposite: function (value) {
        if (!value) {
            return '<span style="color: limegreen; font-weight: bold;">' + '&#x2713;' + '</span>';
        } else {
            return '<span style="color: orangered; font-weight: bold;">' + '&#x2717;' + '</span>';
        }
    },

    // Used to display a contact number in the format (111) 222-3333.
    columnRenderContactNo: function (value, metaData) {
        // Check if the value is an empty string.
        if (value === '') {
            return '<span style="color: lightgray;">-</span>';
        }

        // Check if the value is 10 characters long.
        if (value.length === 10) {
            // Format the value as (111) 222-3333
            return '(' + value.substr(0, 3) + ') ' + value.substr(3, 3) + '-' + value.substr(6);
        }

        // If the value is not 10 characters long and not empty, display it in orangered.
        // Also, add a tooltip explaining the expected format.
        metaData.tdAttr = 'data-qtip="Expected format: (XXX) XXX-XXXX"';
        return '<span style="color: orangered;">' + value + '</span>';
    },

    // Used to display and validate South African Identity Numbers.
    columnRenderIdentityNo: function (value, metaData) {
        var isValid = true;

        // Check the length first.
        if (value.length !== 13) {
            isValid = false;
        }

        // Validate the birthdate portion from the first 6 characters if length is valid.
        if (isValid) {
            var year = parseInt(value.substring(0, 2), 10) + 1900;
            var month = parseInt(value.substring(2, 4), 10) - 1; // Month is 0-indexed in JavaScript
            var day = parseInt(value.substring(4, 6), 10);
            var date = new Date(year, month, day);

            // Check if the constructed date is valid and matches the input date parts.
            isValid = date.getFullYear() === year &&
                date.getMonth() === month &&
                date.getDate() === day;
        }

        // Apply styling and tooltip if the identity number is invalid.
        if (!isValid) {
            metaData.style = 'color: orangered;';
            metaData.tdAttr = 'data-qtip="Invalid South African Identity Number"';
        }

        return value;
    },

    // Image icon for mobile grid column.
    columnRenderMobile: function (value) {
        if (value) {
            return '<img src="images/webapp/icons/tick.png" class= "iconCenter"/>';
        } // True.
        else {
            return '<img src="images/webapp/icons/cross.png" class= "iconCenter"/>';
        } // False.
    },

    // Image icon for basic boolean grid column.
    columnRenderBasicBoolean: function (value) {
        if (value) {
            return '<img src="images/webapp/icons/tick.png" class= "iconCenter"/>';
        } // True.
        else {
            return '<img src="images/webapp/icons/cross.png" class= "iconCenter"/>';
        } // False.
    },

    // Convert true/false to one/zero.
    convertBoolean: function (value) {
        return value ? 1 : 0;
    },

    unlockAccount: function(userId) {
        Ext.Ajax.request({
            url: Utils.serverUrl + 'authentication/utils/unlockAccount.php?auditUserId=' + userInfo.userId + '&userId=' + userId,

            method: 'POST',
            success: function (response) {
                const results = Ext.decode(response.responseText);
            },
            failure: function (response) {
                const results = Ext.decode(response.responseText);
            }
        });
    },

    sendReset: function(userId) {
        Ext.Ajax.request({
            url: Utils.serverUrl + 'authentication/utils/sendReset.php?auditUserId=' + userInfo.userId + '&userId=' + userId,

            method: 'POST',
            success: function (response) {
                const results = Ext.decode(response.responseText);
            },
            failure: function (response) {
                const results = Ext.decode(response.responseText);
            }
        });
    },

    executeService: function (scope, serviceKey, paramList, onSuccess, onFailure, options) {

        console.log('--> executeService:', serviceKey, paramList, options);

        Ext.Ajax.request({
            url: Utils.serverUrl + 'data/service.php?Service=' + serviceKey,
            method: 'POST',
            timeout: 8000, // 8 seconds.
            scope: scope,
            params: {
                Params: JSON.stringify(paramList)
            },
            success: function (response) {
                var responseData = Ext.decode(response.responseText) || {},
                    errorMessage = responseData.message || 'An unknown error occurred',
                    data = responseData.data,
                    success = responseData.success === 'true' || responseData.success === true;

                if (success) {
                    onSuccess(scope, data, options)
                } else {
                    onFailure(scope, errorMessage, options)
                }
            },
            failure: function (response) {
                const responseData = Ext.decode(response.responseText) || {},
                    errorMessage = responseData.message || 'An unknown error occurred';

                onFailure(scope, errorMessage, options)
            }
        });

    }

});

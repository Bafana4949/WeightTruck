Ext.define('PasswordPolicies', {
    alias: 'widget.password_policies',

    requires: [],

    // Declare this as a singleton, meaning only one instance will exist throughout the application.
    singleton: true,

    // Properties to store the password policy rules.
    PasswordMinimumLength: 0,
    PasswordMinimumUppercaseAlphaCount: 0,
    PasswordMinimumLowercaseAlphaCount: 0,
    PasswordMinimumNumberCount: 0,
    PasswordMinimumSpecialCharCount: 0,
    PasswordRulesFetched: false, // Flag to indicate whether the password rules have been fetched.

    // Method to retrieve password rules from the server.
    getPasswordRules: function () {
        var me = this;

        // Check if the password rules have not been fetched already.
        if (!me.PasswordRulesFetched) {

            // Make an AJAX request to fetch password rules from the server.
            Ext.Ajax.request({
                url: Utils.serverUrl + 'data/service.php?Service=PlatformSettings_PasswordRules_v1_List',
                async: false,   // Synchronous request to wait for the server response before proceeding.
                scope: this,    // Set the scope to the current object.
                method: 'POST', // Use POST method for the request.
                success: function (response) {
                    // Parse the server response.
                    const results = Ext.decode(response.responseText);

                    // If the request was successful, update the password policy properties.
                    if (results.success) {
                        me.PasswordMinimumLength = results.data[0].PasswordMinimumLength;
                        me.PasswordMinimumUppercaseAlphaCount = results.data[0].PasswordMinimumUppercaseAlphaCount;
                        me.PasswordMinimumLowercaseAlphaCount = results.data[0].PasswordMinimumLowercaseAlphaCount;
                        me.PasswordMinimumNumberCount = results.data[0].PasswordMinimumNumberCount;
                        me.PasswordMinimumSpecialCharCount = results.data[0].PasswordMinimumSpecialCharCount;

                        // Mark that the password rules have been fetched.
                        me.PasswordRulesFetched = true;
                    }
                },
                failure: function (response) {
                    // Mark the rules as not fetched in case of failure.
                    me.PasswordRulesFetched = false;

                    //console.log('PasswordRules failure:', response);
                }
            });

        }
    },

    // Method to get the minimum password length.
    getPasswordMinimumLength: function () {
        var me = this;

        // Fetch password rules if they haven't been fetched yet.
        if (!me.PasswordRulesFetched) {
            me.getPasswordRules();
        }
        // Return the minimum password length.
        return me.PasswordMinimumLength;
    },

    // Method to get the minimum number of uppercase letters required in the password.
    getPasswordMinimumUppercaseAlphaCount: function () {
        var me = this;

        // Fetch password rules if they haven't been fetched yet.
        if (!me.PasswordRulesFetched) {
            me.getPasswordRules();
        }

        // Return the minimum uppercase letter count.
        return me.PasswordMinimumUppercaseAlphaCount;
    },

    // Method to get the minimum number of lowercase letters required in the password.
    getPasswordMinimumLowercaseAlphaCount: function () {
        var me = this;

        // Fetch password rules if they haven't been fetched yet.
        if (!me.PasswordRulesFetched) {
            me.getPasswordRules();
        }

        // Return the minimum lowercase letter count.
        return me.PasswordMinimumLowercaseAlphaCount;
    },

    // Method to get the minimum number of digits required in the password.
    getPasswordMinimumNumberCount: function () {
        var me = this;

        // Fetch password rules if they haven't been fetched yet.
        if (!me.PasswordRulesFetched) {
            me.getPasswordRules();
        }

        // Return the minimum number count.
        return me.PasswordMinimumNumberCount;
    },

    // Method to get the minimum number of special characters required in the password.
    getPasswordMinimumSpecialCharCount: function () {
        var me = this;

        // Fetch password rules if they haven't been fetched yet.
        if (!me.PasswordRulesFetched) {
            me.getPasswordRules();
        }

        // Return the minimum special character count.
        return me.PasswordMinimumSpecialCharCount;
    },

    // Generate a random lowercase letter.
    getRandomLower: function () {
        // Generate and return a random lowercase letter.
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    },

    // Generate a random uppercase letter.
    getRandomUpper: function () {
        // Generate and return a random uppercase letter.
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    },

    // Generate a random number.
    getRandomNumber: function () {
        // Generate and return a random number.
        return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
    },

    // Generate a random special character.
    getRandomSymbol: function () {
        // Generate and return a random special symbol.
        const symbols = "@$!%*`~#_=+{};:',<.>^()[]|\\/?&-\"";
        return symbols[Math.floor(Math.random() * symbols.length)];
    },

    // Method to generate a password based on policy rules.
    generatePassword: function () {
        var me = this;

        // Fetch the required counts for password generation.
        let lcase = me.getPasswordMinimumLowercaseAlphaCount();
        let ucase = me.getPasswordMinimumUppercaseAlphaCount();
        let number = me.getPasswordMinimumNumberCount();
        let symbol = me.getPasswordMinimumSpecialCharCount();
        let length = me.getPasswordMinimumLength();

        let generatedPassword = ""; // Initialise the generated password string.

        // Loop through the required length to construct the password.
        for (let i = 0; i < length; i += 4) {
            // Add lowercase letters to the password.
            if (lcase) {
                generatedPassword += me.getRandomLower();
            }
            // Add uppercase letters to the password.
            if (ucase) {
                generatedPassword += me.getRandomUpper();
            }
            // Add numbers to the password.
            if (number) {
                generatedPassword += me.getRandomNumber();
            }
            // Add special characters to the password.
            if (symbol) {
                generatedPassword += me.getRandomSymbol();
            }
        }

        // Return the generated password.
        return generatedPassword;
    }
});
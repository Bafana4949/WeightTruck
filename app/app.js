Ext.Loader.setConfig({
  enabled: true,
  paths: {
    // Framework path.
    Framework: "app/framework/",

    // User Extension path.
    "Ext.ux": "app/ux/",

    // Individual Administrator paths.
    AdminAudit: "app/features/adminaudit/",
    AdminCards: "app/features/admincards/",
    AdminFeedback: "app/features/adminfeedback/",
    AdminHaulier: "app/features/adminhaulier/",
    AdminHaulierTimestamps: "app/features/adminhauliertimestamps/",
    AdminOrganisation: "app/features/adminorganisation/",
    AdminOrganisationConfig: "app/features/adminorganisationconfig/",
    AdminOrganisationJoin: "app/features/adminorganisationjoin/",
    AdminOrganisationRoles: "app/features/adminorganisationroles",
    AdminSiteTons: "app/features/adminsitetons",
    AdminUser: "app/features/adminuser/",
    AdminUsers: "app/features/adminusers/",
    AdminProfileTypeOrganisations:
      "app/features/adminprofiletypeorganisations/",
    AdminProfileTypeRoles: "app/features/adminprofiletyperoles/",
    AdminRemoteSetting: "app/features/adminremotesetting",
    AdminRoleFeatures: "app/features/adminrolefeatures/",
    AdminRoleReports: "app/features/adminrolereports/",
    AdminRoleUsers: "app/features/adminroleusers/",
    AdminMeetingManagement: "app/features/adminmeetingmanagement/",
    AdminFeature: "app/features/adminfeature/",
    AdminTrialPeriod: "app/features/admintrialperiod/",
    AdminTrailer: "app/features/admintrailer/",
    AdminTrailerType: "app/features/admintrailertype/",
    AdminWeighbridge: "app/features/adminweighbridge/",
    AdminWeighbridgeTicket: "app/features/adminweighbridgeticket/",
    AdminWeighbridgePoll: "app/features/adminweighbridgepoll/",
    AdminSoftware: "app/features/adminsoftwares/",
    AdminNotification: "app/features/adminnotification/",
    AdminWeighbridgeOrder: "app/features/adminweighbridgeorder/",
    AdminWeighbridgeSiteSetup: "app/features/adminweighbridgesitesetup/",
    AssignRoleToUsers: "app/features/assignroletousers/",
    AdminRoleConfig: "app/features/adminroleconfig/",
    RemoteServerInfo: "app/features/remoteserverinfo",
    RemoteSiteSync: "app/features/remotesitesync",
    BillingClient: "app/features/billingclient",
    AdminOrganisationSetting: "app/features/adminorganisationsetting",

    // Branch administration feature.
    AdminBranches: "app/features/adminbranches",

    // Check-In and Check-Out Features.
    CheckInHistory: "app/features/checkinhistory",
    CheckInRejected: "app/features/checkinrejected",
    CheckOutHistory: "app/features/checkouthistory",

    // Client Portal Features.
    ClientMovementDashboard: "app/features/clientmovementdashboard/",
    ClientOrderDashboard: "app/features/clientorderdashboard/",
    ClientTickets: "app/features/clienttickets/",

    // Control Room Features.
    ControlRoomAuditActions: "app/features/controlroomauditactions/",
    ControlRoomAuthorisations: "app/features/controlroomauthorisations/",
    ControlRoomHaulierTimestamps: "app/features/controlroomhauliertimestamps/",
    ControlRoomInductions: "app/features/controlroominductions/",
    ControlRoomSiteStatus: "app/features/controlroomsitestatus/",
    CloudVehicleAnalysis: "app/features/cloudvehicleanalysis/",
    HaulierVehicleAnalysis: "app/features/hauliervehicleanalysis/",

    // Individual Fuel Feature paths.
    FuelAudit: "app/features/fuelaudit/",
    FuelDashboard: "app/features/fueldashboard/",
    FuelDipstick: "app/features/fueldipstick/",
    FuelIn: "app/features/fuelin/",
    FuelOut: "app/features/fuelout/",
    FuelStation: "app/features/fuelstation/",
    FuelStationUser: "app/features/fuelstationuser/",
    FuelVehicle: "app/features/fuelvehicle/",

    // Individual Fleet Feature paths.
    FleetVehicleBranch: "app/features/fleetvehiclebranch/",
    FleetVehicleRoute: "app/features/fleetvehicleroute/",
    FleetRoute: "app/features/fleetroute/",
    FleetVehicle: "app/features/fleetvehicle/",
    FleetVehicleUser: "app/features/fleetvehicleuser/",
    FleetOrder: "app/features/fleetorder/",

    // Guest Cards Feature paths.
    GuestCards: "app/features/guestcards/",

    //FST Checklist
    FSTCheckpointAdmin: "app/features/fstcheckpointadmin",

    // Haulier Feature paths.
    HaulierBreakdownDaily: "app/features/haulierbreakdowndaily/",
    HaulierBreakdownHourly: "app/features/haulierbreakdownhourly/",
    HaulierDashboard: "app/features/haulierdashboard/",
    HaulierOpenOrderDashboard: "app/features/haulieropenorderdashboard/",
    HaulierSiteDashboard: "app/features/hauliersitedashboard/",
    HaulierConfig: "app/features/haulierconfig/",
    HaulierInductions: "app/features/haulierinductions/",
    HaulierOrderStatus: "app/features/haulierorderstatus/",
    HaulierRouteAnalysis: "app/features/haulierrouteanalysis/",
    HaulierTicket: "app/features/haulierticket/",
    HaulierTicketsByProduct: "app/features/haulierticketsbyproduct/",
    HaulierTicketMatch: "app/features/haulierticketmatch/",
    HaulierTicketSearch: "app/features/haulierticketsearch/",
    HaulierDriverVehicleCards: "app/features/haulierdrivervehiclecards/",
    HaulierDriverVehicleInductions:
      "app/features/haulierdrivervehicleinductions/",

    // Import external spreadsheets.
    ImportSpreadsheets: "app/features/importspreadsheets/",

    // Mine specific features.
    MineOpenOrderDashboard: "app/features/mineopenorderdashboard/",
    MineOrderAdmin: "app/features/mineorderadmin/",
    MineOrderInductions: "app/features/mineorderinductions/",
    MineTicketSearch: "app/features/mineticketsearch/",
    MineTripSearch: "app/features/minetripsearch/",
    LoadMonitoring: "app/features/loadmonitoring/",
    MineVehicleExemption: "app/features/minevehicleexemption/",

    // Mobile App specific features.
    MobileAppUserSite: "app/features/mobileappusersite/",

    // Scan logs.
    LogWeighbridgeScan: "app/features/logweighbridgescan/",

    // Organisation Feature paths.
    OrgBranch: "app/features/orgbranch/",
    OrgBranchUser: "app/features/orgbranchuser/",
    OrgConfigure: "app/features/orgconfigure/",
    OrgFeature: "app/features/orgfeature/",
    OrgOrganisation: "app/features/orgorganisation/",
    OrgUser: "app/features/orguser/",
    OrgRelation: "app/features/orgrelation/",
    OrgMobileDevice: "app/features/orgmobiledevice",
    OrgAttendance: "app/features/orgattendance",
    OrgDownload: "app/features/orgdownload",
    ApplicationLevelAccess: "app/features/orgapplicationlevelaccess",
    OrgUserNotification: "app/features/orgusernotification",

    // Organisation Services - Products, locations etc.
    OrgServices: "app/features/orgservices",

    // Induction Feature paths.
    InductionConfig: "app/features/inductionconfig",
    InductionUser: "app/features/inductionuser",
    InductionUserAll: "app/features/inductionuserall",
    InductionUserBulk: "app/features/inductionuserbulk",
    InductionVehicle: "app/features/inductionvehicle",
    InductionVehicleAll: "app/features/inductionvehicleall",
    InductionVehicleBulk: "app/features/inductionvehiclebulk",
    InductionFuelUser: "app/features/inductionfueluser",
    InductionFuelVehicle: "app/features/inductionfuelvehicle",
    InductionWeighbridgeUser: "app/features/inductionweighbridgeuser",
    InductionWeighbridgeVehicle: "app/features/inductionweighbridgevehicle",
    InductionExpiration: "app/features/inductionexpirations",

    // Remote Scripts.
    RemoteApplicationAccess: "app/features/remoteapplicationaccess",
    RemoteProductArea: "app/features/remoteproductarea",
    RemoteProductLimit: "app/features/remoteproductlimit",
    RemoteScripts: "app/features/remotescripts",
    RemoteSite: "app/features/remotesite",

    // Sales Feature paths.
    SalesNonTonTracClients: "app/features/salesnontontracclients",

    // Security Seals.
    SecuritySeal: "app/features/securityseal",
    SecuritySealSite: "app/features/securitysealsite",
    SiteSealException: "app/features/sitesealexception",

    // Sencha Features and Fields.
    SenchaFeature: "app/features/senchafeature",

    // StockPile Feature paths.
    StockDashDay: "app/features/stockdashday",
    StockPile: "app/features/stockpile",
    StockPileAnalysis: "app/features/stockpileanalysis",
    StockPileDash: "app/features/stockpiledash",
    StockPileGroup: "app/features/stockpilegroup",
    StockGroupDashboard: "app/features/stockgroupdashboard",
    StockPileSurvey: "app/features/stockpilesurvey",

    // Target Feature paths.
    TargetAllocation: "app/features/targetAllocation/",
    TargetDashboard: "app/features/targetdashboard/",

    // Vehicle OnSite Warings.
    VehicleOnSiteWarnings: "app/features/vehicleonsitewarnings/",

    // Weighbridge Feature paths.
    WeighbridgeApplicationAccess: "app/features/weighbridgeapplicationaccess/",
    WeighbridgeDashboard: "app/features/weighbridgedashboard/",
    WeighbridgeOrderDashboard: "app/features/weighbridgeorderdashboard/",
    WeighbridgeOrder: "app/features/weighbridgeorder/",
    WeighbridgeOrdering: "app/features/weighbridgeordering/",
    WeighbridgeOrderAdmin: "app/features/weighbridgeorderadmin/",
    WeighbridgeOrderSecurity: "app/features/weighbridgeordersecurity/",
    WeighbridgeProduct: "app/features/weighbridgeproduct/",
    WeighbridgeLocation: "app/features/weighbridgelocation/",
    WeighbridgeRouteAnalysis: "app/features/weighbridgerouteanalysis/",
    WeighbridgeSiteStatus: "app/features/weighbridgesitestatus/",
    WeighbridgeTicket: "app/features/weighbridgeticket/",
    WeighbridgeTicketAnalysis: "app/features/weighbridgeticketanalysis/",
    WeighbridgeTicketLive: "app/features/weighbridgeticketlive/",
    WeighbridgeTicketHaulier: "app/features/weighbridgetickethaulier/",
    WeighbridgeTicketHourly: "app/features/weighbridgetickethourly/",
    WeighbridgeTicketSupplier: "app/features/weighbridgeticketsupplier/",
    WeighbridgeTicketVehicle: "app/features/weighbridgeticketvehicle/",
    WeighbridgeTicketProduct: "app/features/weighbridgeticketproduct/",
    WeighbridgeTicketProductOverride:
      "app/features/weighbridgeticketproductoverride/",
    WeighbridgeTicketDriver: "app/features/weighbridgeticketdriver/",
    WeighbridgeTicketCustomer: "app/features/weighbridgeticketcustomer/",
    WeighbridgeTicketWeighbridge: "app/features/weighbridgeticketweighbridge/",
    WeighbridgeMapping: "app/features/weighbridgemapping/",
    Weighbridge: "app/features/weighbridge/",
    WeighbridgeTicketStatus: "app/features/weighbridgeticketstatus",
    WeighbridgeMissingTickets: "app/features/weighbridgemissingtickets",
    WeighbridgeUser: "app/features/weighbridgeuser",
    WeighbridgeVehicleTare: "app/features/weighbridgevehicletare",
    WeighbridgeTicketSearch: "app/features/weighbridgeticketsearch",
    CustomQuery: "app/features/customquery",
    WeighbridgeMovementDashboard: "app/features/weighbridgemovementdashboard",
    FleetYellowMachineLog: "app/features/weighbridgeyellowmachinelog",
    WeighbridgePoint: "app/features/weighbridgepoint",

    //Weightometer Paths
    WeightometerStockDashboard: "app/features/weightometerstockdashboard/",

    //Stock Paths
    StockDashboard: "app/features/stockdashboard/",

    //Rail Application
    RailDashboard: "app/features/raildashboard/",
    RailTicketsSearch: "app/features/railticketssearch/",
    TrainsList: "app/features/trainslist/",
    CarriagesList: "app/features/carriageslist/",
    RailLocationMapping: "app/features/raillocationmapping/",
    RailStock: "app/features/railstock/",
    RailTicketSettings: "app/features/railticketsettings/",
    RailTicketUnlock: "app/features/railticketunlock/",

    // Security Feature paths.
    SecurityPoint: "app/features/securitypoint/",
    SecurityTransaction: "app/features/securitytransaction/",
    SecurityTransactionCheckpointTimes:
      "app/features/securitytransactioncheckpointtimes/",
    SecurityTransactionOverride: "app/features/securitytransactionoverride/",
    SecurityUser: "app/features/securityuser/",
    SecurityExemptedVehicle: "app/features/securityexemptedvehicle",

    // Reports feature paths.
    Reports: "app/features/reports/",
    ReportUser: "app/features/reportuser",
    ReportViewer: "app/features/reportviewer",
    AdminReport: "app/features/adminreport",

    // Card Printing feature paths
    PrintUserCards: "app/features/printusercards/",
    PrintVehicleCards: "app/features/printvehiclecards/",
    AdminPrintQueue: "app/features/adminprintqueue",
  },
});

Ext.define("PasswordField", {
  extend: "Ext.form.field.Text",
  alias: "widget.passwordfield",

  // Validator rules for the password field.
  validators: [
    {
      errorMessage: () => {
        return "Password must not contain spaces;";
      },
      fn: (value, policies) => {
        const regex = new RegExp("\\s");

        // Return false if spaces are found in the password.
        return !regex.test(value);
      },
    },
    {
      errorMessage: (policies) => {
        return (
          "Password should contain at least " +
          policies.getPasswordMinimumLength() +
          " character(s);"
        );
      },
      fn: (value, policies) => {
        // Validate that the password meets the minimum length requirement.
        return value.trim().length >= policies.getPasswordMinimumLength();
      },
    },
    {
      errorMessage: (policies) => {
        return (
          "Password should contain at least " +
          policies.getPasswordMinimumNumberCount() +
          " number;"
        );
      },
      fn: (value, policies) => {
        const regex = new RegExp(
          "(?=(?:.*[\\d]){" + policies.getPasswordMinimumNumberCount() + ",})"
        );
        // Ensure the password contains the required number of digits.
        return regex.test(value);
      },
    },
    {
      errorMessage: (policies) => {
        return (
          "Password should contain at least " +
          policies.getPasswordMinimumLowercaseAlphaCount() +
          " lowercase and " +
          policies.getPasswordMinimumUppercaseAlphaCount() +
          " uppercase letter;"
        );
      },
      fn: (value, policies) => {
        const regexLCase = new RegExp(
          "(?=(?:.*[a-z]){" +
            policies.getPasswordMinimumLowercaseAlphaCount() +
            ",})"
        );
        const regexUCase = new RegExp(
          "(?=(?:.*[A-Z]){" +
            policies.getPasswordMinimumUppercaseAlphaCount() +
            ",})"
        );
        // Ensure the password has the required number of both lowercase and uppercase letters.
        return regexLCase.test(value) && regexUCase.test(value);
      },
    },
    {
      errorMessage: (policies) => {
        return (
          "Password should contain at least " +
          policies.getPasswordMinimumSpecialCharCount() +
          " special character;"
        );
      },
      fn: (value, policies) => {
        const regex = new RegExp(
          "(?=(?:.*[@$!%*`~#_=+{};:',<.>\\^\\(\\)\\[\\]|\\\\/\\?\\&\\-\\\"]){" +
            policies.getPasswordMinimumSpecialCharCount() +
            ",})"
        );
        // Ensure the password contains the required number of special characters.
        return regex.test(value);
      },
    },
  ],

  initComponent: function () {
    var me = this;

    // Check if the password policies are already set, else get them from the application.
    if (me.policies === undefined) {
      me.policies = PasswordPolicies;
    }

    // Call the parent component's initComponent method.
    me.callParent();
  },

  onRender: function () {
    var me = this;

    // Call the parent component's onRender method.
    me.callParent();

    // Validate the field once it's rendered.
    me.validate();
  },

  validator: function (val) {
    var me = this;

    // If the policies are undefined, set them from the application.
    if (me.policies === undefined) {
      me.policies = PasswordPolicies;
    }

    const errorMessages = [];
    var canPass = true;

    // Iterate through each validator to validate the password value.
    me.validators.map((validator) => {
      // If the validation function fails, add the error message.
      if (!validator.fn(val, me.policies)) {
        errorMessages.push(`<li>${validator.errorMessage(me.policies)}</li>`);
        canPass = false;
      }
    });

    // If validation fails, return the error messages as a string.
    if (!canPass) {
      return errorMessages.join("");
    }

    // If all validations pass, return true.
    return canPass;
  },
});

Ext.application({
  requires: [
    "Ext.ux.CheckColumn", // Require the CheckColumn user extension.
  ],

  title: "TonTrac",
  autoCreateViewport: false,

  controllers: [
    // List of framework controllers.
    "Framework.controller.Framework",
    "WeighbridgeOrder.controller.OrderFormController",
    "WeighbridgeOrder.controller.OrderHaulierFormController",
    "WeighbridgeOrder.controller.OrderHaulierVehicleFormController",
    "WeighbridgeTicket.controller.WeighbridgeTicket",
  ],

  launch: function () {
    var me = this;

    // Fetch the password rules when the app launches.
    PasswordPolicies.getPasswordRules();

    // Console log the password policy properties to verify they have been set.
    // console.log('Password Minimum Length:', PasswordPolicies.PasswordMinimumLength);
    // console.log('Password Minimum Uppercase Alpha Count:', PasswordPolicies.PasswordMinimumUppercaseAlphaCount);
    // console.log('Password Minimum Lowercase Alpha Count:', PasswordPolicies.PasswordMinimumLowercaseAlphaCount);
    // console.log('Password Minimum Number Count:', PasswordPolicies.PasswordMinimumNumberCount);
    // console.log('Password Minimum Special Character Count:', PasswordPolicies.PasswordMinimumSpecialCharCount);

    // Continue with the rest of the application launch.
    me.doApplication();
  },

  doApplication: function () {
    // Create the main viewport for the application.
    Ext.create("Framework.view.Viewport", {});

    // Remove the loading image from the page.
    Ext.get("loadingImage").destroy();

    // Make the 'powered by' section visible.
    Ext.get("poweredby").removeCls("hidden");

    // If the user needs to change their password, show an alert and force password change.
    if (userInfo.changePassword === 1) {
      alert(
        'Password Policy: Password must be changed after every 6 months and users using "tontrac" as password must change it for security reasons.'
      );

      // Disable system buttons until the password is changed.
      Ext.ComponentQuery.query(
        "container#toolbarButtonsContainer"
      )[0].disable();

      // Show the password change window, and disable the 'Cancel' button.
      Ext.create("Framework.view.ChangePassword", {
        closable: false, // Prevent the window from being closed.
      })
        .show()
        .down("button[action=Cancel]") // Hide the 'Cancel' button.
        .hide()
        .addListener("beforedestroy", function () {
          // Update the session to indicate that the password was changed.
          Ext.Ajax.request({
            url: "data/session_update.php?SessionName=changePassword&SessionValue=0",
            type: "POST",
          });

          // Re-enable system buttons after the password is changed.
          Ext.ComponentQuery.query(
            "container#toolbarButtonsContainer"
          )[0].enable();
        });
    }
  },

  addController: function (controller) {
    var me = this;

    // Check if the controller is already added to the application.
    for (var i = 0; i < me.controllers.keys.length; i++) {
      if (controller === me.controllers.keys[i]) {
        return; // If the controller is already added, exit the function.
      }
    }

    // If the controller is not already added, get and initialise it.
    var ctr = me.getController(controller);
    ctr.init(); // Initialise the controller.
  },
});

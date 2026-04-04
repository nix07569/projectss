sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
  "use strict";

  return UIComponent.extend("finsight.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments);

      // Global app state model
      var oStateModel = new JSONModel({
        segment: "Group",        // Group | CIB | WRB
        view: "Overview",        // Overview | Trends
        // Per-segment toggle memory
        toggles: {
          Group: { unit: "m", fx: "RFX" },
          CIB:   { unit: "m", fx: "RFX" },
          WRB:   { unit: "m", fx: "RFX" }
        },
        // Derived convenience bindings (updated by controller)
        activeUnit: "m",
        activeFX: "RFX",
        headerTitle: "Group | Financials | Overview"
      });
      this.setModel(oStateModel, "state");
    }
  });
});

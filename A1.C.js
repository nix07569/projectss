sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.App", {

        /* ══════════════════════════════════════
           LIFECYCLE
        ══════════════════════════════════════ */

        onInit: function () {

            // ── State model (segment, view, per-segment toggle memory) ──
            var oStateModel = new JSONModel({
                segment     : "Group",
                view        : "Overview",
                headerTitle : "Group | Financials | Overview",
                activeUnit  : "m",
                activeFX    : "RFX",
                toggles: {
                    Group   : { unit: "m", fx: "RFX" },
                    CIB     : { unit: "m", fx: "RFX" },
                    WRB     : { unit: "m", fx: "RFX" }
                }
            });

            this.getView().setModel(oStateModel, "state");
            this._oState = oStateModel;

            // Apply default active styles on load
            this._syncButtons();
        },

        /* ══════════════════════════════════════
           SEGMENT  (Group / CIB / WRB)
        ══════════════════════════════════════ */

        onSegmentPress: function (oEvent) {
            var sKey = oEvent.getSource().data("key");
            var oData = this._oState.getData();

            if (oData.segment === sKey) { return; }

            oData.segment = sKey;
            this._oState.setData(oData);

            this._applyState(true);
        },

        /* ══════════════════════════════════════
           VIEW  (Overview / Trends)
        ══════════════════════════════════════ */

        onViewPress: function (oEvent) {
            var sKey = oEvent.getSource().data("key");
            var oData = this._oState.getData();

            if (oData.view === sKey) { return; }

            oData.view = sKey;
            this._oState.setData(oData);

            this._applyState(true);
        },

        /* ══════════════════════════════════════
           TOGGLES
        ══════════════════════════════════════ */

        // $m / $bn — saved per segment
        onUnitToggle: function (oEvent) {
            var sKey  = oEvent.getParameter("item").getKey();
            var oData = this._oState.getData();

            oData.toggles[oData.segment].unit = sKey;
            oData.activeUnit = sKey;
            this._oState.setData(oData);
        },

        // RFX / CFX — saved per segment
        onFXToggle: function (oEvent) {
            var sKey  = oEvent.getParameter("item").getKey();
            var oData = this._oState.getData();

            oData.toggles[oData.segment].fx = sKey;
            oData.activeFX = sKey;
            this._oState.setData(oData);
        },

        /* ══════════════════════════════════════
           RESET  — resets current segment toggles only
        ══════════════════════════════════════ */

        onReset: function () {
            var oData = this._oState.getData();
            var sSeg  = oData.segment;

            oData.toggles[sSeg] = { unit: "m", fx: "RFX" };
            oData.activeUnit    = "m";
            oData.activeFX      = "RFX";
            this._oState.setData(oData);

            this.byId("unitToggle").setSelectedKey("m");
            this.byId("fxToggle").setSelectedKey("RFX");

            MessageToast.show("Toggles reset to defaults");
        },

        onMenuPress: function () {
            MessageToast.show("Menu");
        },

        /* ══════════════════════════════════════
           PRIVATE HELPERS
        ══════════════════════════════════════ */

        /**
         * Master state sync:
         *  1. Restores per-segment toggle memory into active keys
         *  2. Updates header title binding
         *  3. Syncs toggle controls to saved state
         *  4. Updates active button CSS classes
         *  5. Shows busy on content area if bBusy = true
         *
         * @param {boolean} bBusy - show busy indicator during transition
         */
        _applyState: function (bBusy) {
            var oData = this._oState.getData();
            var sSeg  = oData.segment;
            var sView = oData.view;
            var oT    = oData.toggles[sSeg];

            // 1. Restore per-segment toggle memory
            oData.activeUnit  = oT.unit;
            oData.activeFX    = oT.fx;

            // 2. Update header title
            oData.headerTitle = sSeg + " | Financials | " + sView;
            this._oState.setData(oData);

            // 3. Sync toggle controls
            this.byId("unitToggle").setSelectedKey(oT.unit);
            this.byId("fxToggle").setSelectedKey(oT.fx);

            // 4. Refresh button active states
            this._syncButtons();

            // 5. Optional busy indicator on content area
            if (bBusy) {
                var oContent = this.byId("contentArea");
                oContent.setBusy(true);
                setTimeout(function () {
                    oContent.setBusy(false);
                }, 400);
            }
        },

        /**
         * Adds / removes the active CSS class on Segment and View buttons.
         * Called after every navigation action.
         */
        _syncButtons: function () {
            var oData = this._oState.getData();

            // Segment buttons
            ["Group", "CIB", "WRB"].forEach(function (sKey) {
                var oBtn = this.byId("btn" + sKey);
                if (!oBtn) { return; }
                oBtn.removeStyleClass("fsSegBtnActive");
                if (sKey === oData.segment) {
                    oBtn.addStyleClass("fsSegBtnActive");
                }
            }, this);

            // View buttons
            ["Overview", "Trends"].forEach(function (sKey) {
                var oBtn = this.byId("btn" + sKey);
                if (!oBtn) { return; }
                oBtn.removeStyleClass("fsViewBtnActive");
                if (sKey === oData.view) {
                    oBtn.addStyleClass("fsViewBtnActive");
                }
            }, this);
        }

    });
});

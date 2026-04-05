sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/Panel",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/FlexBox",
    "sap/m/Title",
    "sap/m/Text",
    "sap/m/Label",
    "sap/ui/core/HTML"
], function (
    Controller,
    JSONModel,
    MessageToast,
    Panel,
    VBox,
    HBox,
    FlexBox,
    Title,
    Text,
    Label,
    HTML
) {
    "use strict";

    /* ════════════════════════════════════════
       PRIVATE HELPERS  (no UI5 deps)
    ════════════════════════════════════════ */

    /**
     * Format a raw number for display.
     * @param {number}  v     raw value
     * @param {string}  unit  "m" | "bn"
     * @param {object}  card  card definition
     * @returns {string}
     */
    function _fmt(v, unit, card) {
        if (card.isHead)    return Number(v).toLocaleString();
        if (card.isPercent) return parseFloat(v).toFixed(1) + "%";
        if (unit === "bn")  return "$" + parseFloat(v).toFixed(3) + "bn";
        return "$" + Number(v).toLocaleString() + "m";
    }

    /**
     * Build an inline SVG sparkline.
     * Uses only SVG — no external library.
     */
    function _sparkSVG(data) {
        if (!data || data.length < 2) { return ""; }
        var W = 200, H = 32, P = 3;
        var mn = Math.min.apply(null, data);
        var mx = Math.max.apply(null, data);
        var rng  = mx - mn || 1;
        var step = (W - P * 2) / (data.length - 1);

        var pts = data.map(function (v, i) {
            var x = (P + i * step).toFixed(1);
            var y = (H - P - ((v - mn) / rng) * (H - P * 2)).toFixed(1);
            return x + "," + y;
        }).join(" ");

        var lx = (P + (data.length - 1) * step).toFixed(1);
        var ly = (H - P - ((data[data.length - 1] - mn) / rng) * (H - P * 2)).toFixed(1);

        return '<svg width="100%" height="' + H +
            '" viewBox="0 0 ' + W + ' ' + H +
            '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">' +
            '<defs>' +
              '<linearGradient id="spkGrad_' + W + '" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0%"   stop-color="#1870C5" stop-opacity="0.13"/>' +
                '<stop offset="100%" stop-color="#1870C5" stop-opacity="0"/>' +
              '</linearGradient>' +
            '</defs>' +
            '<polygon fill="url(#spkGrad_' + W + ')" points="' +
                P + ',' + H + ' ' + pts + ' ' + lx + ',' + H + '"/>' +
            '<polyline fill="none" stroke="#1870C5" stroke-width="1.5" points="' + pts + '"/>' +
            '<circle cx="' + lx + '" cy="' + ly +
                '" r="3" fill="#1870C5" stroke="#ffffff" stroke-width="1.5"/>' +
            '</svg>';
    }

    /**
     * Build an inline SVG bar chart for trend cards.
     */
    function _barSVG(data) {
        if (!data || !data.length) { return ""; }
        var W = 300, H = 72, BW = 30, GAP = 12, P = 4;
        var mx = Math.max.apply(null, data) * 1.18 || 1;

        var svg = '<svg width="100%" height="' + H +
            '" viewBox="0 0 ' + W + ' ' + H +
            '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">';

        data.forEach(function (v, i) {
            var bh = Math.max(2, (v / mx) * (H - P * 2));
            var x  = (P + i * (BW + GAP)).toFixed(1);
            var y  = (H - P - bh).toFixed(1);
            var fill = (i === data.length - 1) ? "#1870C5" : "#B8D4F0";
            svg += '<rect x="' + x + '" y="' + y +
                '" width="' + BW + '" height="' + bh.toFixed(1) +
                '" fill="' + fill + '" rx="2"/>';
        });

        return svg + '</svg>';
    }

    /* ════════════════════════════════════════
       CONTROLLER
    ════════════════════════════════════════ */
    return Controller.extend("project1.controller.App", {

        /* ── onInit ─────────────────────────────── */
        onInit: function () {
            var oComp = this.getOwnerComponent();

            this._oState = oComp.getModel("state");
            this._oMock  = oComp.getModel("mockData");

            // Expose state model to this view
            this.getView().setModel(this._oState, "state");

            // Initialise state
            this._oState.setData({
                segment     : "Group",
                view        : "Overview",
                headerTitle : "Group | Financials | Overview",
                activeUnit  : "m",
                activeFX    : "RFX",
                toggles: {
                    Group : { unit: "m", fx: "RFX" },
                    CIB   : { unit: "m", fx: "RFX" },
                    WRB   : { unit: "m", fx: "RFX" }
                }
            });

            var that = this;

            // Wait for mockData to be available before first render
            if (this._oMock) {
                var oData = this._oMock.getData();
                if (oData && Object.keys(oData).length > 0) {
                    that._applyState(false);
                } else {
                    this._oMock.attachRequestCompleted(function () {
                        that._applyState(false);
                    });
                    // Safety fallback
                    setTimeout(function () {
                        if (!that._firstRenderDone) { that._applyState(false); }
                    }, 1000);
                }
            } else {
                setTimeout(function () { that._applyState(false); }, 400);
            }
        },

        /* ── Segment press (Group / CIB / WRB) ─── */
        onSegmentPress: function (oEvent) {
            var sKey = oEvent.getSource().data("key");
            var oD   = this._oState.getData();
            if (oD.segment === sKey) { return; }
            oD.segment = sKey;
            this._oState.setData(oD);
            this._applyState(true);
        },

        /* ── View press (Overview / Trends) ──────── */
        onViewPress: function (oEvent) {
            var sKey = oEvent.getSource().data("key");
            var oD   = this._oState.getData();
            if (oD.view === sKey) { return; }
            oD.view = sKey;
            this._oState.setData(oD);
            this._applyState(true);
        },

        /* ── Unit toggle ($m / $bn) ──────────────── */
        onUnitToggle: function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            var oD   = this._oState.getData();
            oD.toggles[oD.segment].unit = sKey;
            oD.activeUnit = sKey;
            this._oState.setData(oD);
            this._renderCards();
        },

        /* ── FX toggle (RFX / CFX) ───────────────── */
        onFXToggle: function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey();
            var oD   = this._oState.getData();
            oD.toggles[oD.segment].fx = sKey;
            oD.activeFX = sKey;
            this._oState.setData(oD);
            this._renderCards();
        },

        /* ── Reset ───────────────────────────────── */
        onReset: function () {
            var oD  = this._oState.getData();
            var seg = oD.segment;
            oD.toggles[seg] = { unit: "m", fx: "RFX" };
            oD.activeUnit   = "m";
            oD.activeFX     = "RFX";
            this._oState.setData(oD);
            this.byId("unitToggle").setSelectedKey("m");
            this.byId("fxToggle").setSelectedKey("RFX");
            this._renderCards();
        },

        onMenuPress: function () {
            MessageToast.show("Navigation menu");
        },

        /* ════════════════════════════════════════
           PRIVATE
        ════════════════════════════════════════ */

        /**
         * Master orchestrator.
         * Syncs: headerTitle → toggle controls → button styles → cards.
         * @param {boolean} bBusy  show busy indicator while rendering
         */
        _applyState: function (bBusy) {
            var oD  = this._oState.getData();
            var seg = oD.segment;
            var t   = oD.toggles[seg];

            // Restore per-segment toggle memory
            oD.activeUnit    = t.unit;
            oD.activeFX      = t.fx;
            oD.headerTitle   = seg + " | Financials | " + oD.view;
            this._oState.setData(oD);

            // Sync SegmentedButton controls
            var oUnit = this.byId("unitToggle");
            var oFX   = this.byId("fxToggle");
            if (oUnit) { oUnit.setSelectedKey(t.unit); }
            if (oFX)   { oFX.setSelectedKey(t.fx); }

            // Refresh button active classes
            this._syncButtonStyles();

            var oContainer = this.byId("cardContainer");

            if (bBusy && oContainer) {
                oContainer.setBusy(true);
                var that = this;
                setTimeout(function () {
                    oContainer.setBusy(false);
                    that._renderCards();
                }, 550);
            } else {
                this._renderCards();
            }
        },

        /** Build and inject cards into #cardContainer */
        _renderCards: function () {
            var oD    = this._oState.getData();
            var seg   = oD.segment;
            var view  = oD.view;
            var unit  = oD.activeUnit;
            var fx    = oD.activeFX;
            var isOv  = (view === "Overview");

            // Safely read mock data
            var rawCards = [];
            if (this._oMock) {
                var oAll = this._oMock.getData();
                if (oAll && oAll[seg] && oAll[seg][view]) {
                    rawCards = oAll[seg][view].cards || [];
                }
            }

            var oContainer = this.byId("cardContainer");
            if (!oContainer) { return; }
            oContainer.destroyItems();

            // Outer FlexBox grid
            var oGrid = new FlexBox({
                wrap          : "Wrap",
                alignItems    : "Stretch",
                justifyContent: "Start",
                addStyleClass : isOv ? "fsOverviewGrid" : "fsTrendsGrid"
            });

            var that = this;
            rawCards.forEach(function (card) {
                oGrid.addItem(
                    isOv ? that._mkKPICard(card, unit, fx)
                         : that._mkTrendCard(card)
                );
            });

            oContainer.addItem(oGrid);
            this._firstRenderDone = true;
        },

        /* ── Build one KPI Overview card ─────────────────────── */
        _mkKPICard: function (card, unit, fx) {
            // Resolve active value
            var actual = (fx === "CFX")
                ? (card.cfx !== undefined ? card.cfx : card["actual_" + unit])
                : card["actual_" + unit];
            var prior  = card["prior_"  + unit];
            var budget = card["budget_" + unit];

            // Fallback to _m if _bn undefined
            if (actual  === undefined) { actual  = card.actual_m;  }
            if (prior   === undefined) { prior   = card.prior_m;   }
            if (budget  === undefined) { budget  = card.budget_m;  }

            var isUp     = (card.dir === "up");
            var varColor = isUp ? "#1d6f2f" : "#bb0000";
            var arrow    = isUp ? "&#9650;" : "&#9660;";
            var absVar   = Math.abs(card.variance).toFixed(1) + "%";

            /* Panel wrapper */
            var oPanel = new Panel({
                backgroundDesign: "Solid",
                addStyleClass   : "fsKPICard"
            });

            var oBody = new VBox({ addStyleClass: "fsKPIBody" });

            // 1. Card title
            oBody.addItem(new Title({
                text         : card.title,
                level        : "H5",
                addStyleClass: "fsCardTitle"
            }));

            // 2. Actual value block
            oBody.addItem(new Label({ text: "Actual", addStyleClass: "fsKPIMeta" }));
            oBody.addItem(new Text({
                text         : _fmt(actual, unit, card),
                addStyleClass: "fsKPIActual"
            }));

            // 3. Prior Year + Budget sub-row
            var oPriorVBox = new VBox({ addStyleClass: "fsKPICol" });
            oPriorVBox.addItem(new Label({ text: "Prior Year", addStyleClass: "fsKPIMetaSub" }));
            oPriorVBox.addItem(new Text({ text: _fmt(prior, unit, card), addStyleClass: "fsKPIPrior" }));

            var oBudgetVBox = new VBox({ addStyleClass: "fsKPICol" });
            oBudgetVBox.addItem(new Label({ text: "Budget", addStyleClass: "fsKPIMetaSub" }));
            oBudgetVBox.addItem(new Text({ text: _fmt(budget, unit, card), addStyleClass: "fsKPIBudget" }));

            var oSubRow = new HBox({ addStyleClass: "fsKPISubRow" });
            oSubRow.addItem(oPriorVBox);
            oSubRow.addItem(oBudgetVBox);
            oBody.addItem(oSubRow);

            // 4. Variance row
            var oVRow = new HBox({ alignItems: "Center", addStyleClass: "fsVarianceRow" });
            oVRow.addItem(new HTML({
                content: '<span style="font-size:11px;color:' + varColor + '">' + arrow + '</span>'
            }));
            oVRow.addItem(new Text({
                text         : absVar,
                addStyleClass: isUp ? "fsVarUp" : "fsVarDown"
            }));
            oVRow.addItem(new Label({ text: "\u00a0vs PY", addStyleClass: "fsVarLabel" }));
            oBody.addItem(oVRow);

            // 5. Sparkline
            oBody.addItem(new HTML({
                content: '<div class="fsSparkRow">' + _sparkSVG(card.spark) + '</div>'
            }));

            oPanel.addContent(oBody);
            return oPanel;
        },

        /* ── Build one Trend card ─────────────────────────────── */
        _mkTrendCard: function (card) {
            var isUp     = (card.yoy >= 0);
            var yoyColor = isUp ? "#1d6f2f" : "#bb0000";
            var yoyArrow = isUp ? "&#9650;" : "&#9660;";
            var yoyText  = Math.abs(card.yoy).toFixed(1) + "% YoY";

            var oPanel = new Panel({
                backgroundDesign: "Solid",
                addStyleClass   : "fsTrendCard"
            });

            var oBody = new VBox({ addStyleClass: "fsTrendBody" });

            // Header: title + YoY badge
            var oHeader = new HBox({
                justifyContent: "SpaceBetween",
                alignItems    : "Center",
                addStyleClass : "fsTrendHeader"
            });
            oHeader.addItem(new Title({ text: card.title, level: "H5", addStyleClass: "fsCardTitle" }));
            oHeader.addItem(new HTML({
                content: '<span class="fsYoYBadge" style="color:' + yoyColor + '">' +
                    yoyArrow + '&nbsp;' + yoyText + '</span>'
            }));
            oBody.addItem(oHeader);

            // Bar chart
            oBody.addItem(new HTML({
                content: '<div class="fsTrendChart">' + _barSVG(card.data) + '</div>'
            }));

            // Month labels
            var oLabels = new HBox({ justifyContent: "SpaceBetween", addStyleClass: "fsTrendLabels" });
            (card.labels || []).forEach(function (lbl) {
                oLabels.addItem(new Label({ text: lbl, addStyleClass: "fsTrendLabel" }));
            });
            oBody.addItem(oLabels);

            oPanel.addContent(oBody);
            return oPanel;
        },

        /* ── Sync active CSS class on nav buttons ─────────────── */
        _syncButtonStyles: function () {
            var oD = this._oState.getData();

            ["Group", "CIB", "WRB"].forEach(function (s) {
                var oBtn = this.byId("btn" + s);
                if (!oBtn) { return; }
                oBtn.removeStyleClass("fsSegBtnActive");
                if (s === oD.segment) { oBtn.addStyleClass("fsSegBtnActive"); }
            }, this);

            ["Overview", "Trends"].forEach(function (v) {
                var oBtn = this.byId("btn" + v);
                if (!oBtn) { return; }
                oBtn.removeStyleClass("fsViewBtnActive");
                if (v === oD.view) { oBtn.addStyleClass("fsViewBtnActive"); }
            }, this);
        }

    });
});

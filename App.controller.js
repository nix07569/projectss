sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/Fragment"
], function (Controller, JSONModel, Fragment) {
  "use strict";

  /* ─────────────────────────────────────────────
   *  HELPERS
   * ───────────────────────────────────────────── */

  /**
   * Format a raw number for display based on active unit & card type.
   * @param {number} val
   * @param {string} unit  "m" | "bn"
   * @param {object} card  card data object
   * @returns {string}
   */
  function _formatValue(val, unit, card) {
    if (card.isHeadcount) {
      return Number(val).toLocaleString();
    }
    if (card.isPercent) {
      return val.toFixed(1) + "%";
    }
    if (unit === "bn") {
      return "$" + Number(val).toFixed(1) + "bn";
    }
    return "$" + Number(val).toLocaleString() + "m";
  }

  /**
   * Generate an inline SVG sparkline string for a card.
   * @param {number[]} data
   * @returns {string} HTML string containing <svg>
   */
  function _buildSparkHtml(data) {
    var w = 160, h = 36, pad = 4;
    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    var range = max - min || 1;
    var step = (w - pad * 2) / (data.length - 1);

    var points = data.map(function (v, i) {
      var x = pad + i * step;
      var y = h - pad - ((v - min) / range) * (h - pad * 2);
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");

    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">' +
      '<polyline fill="none" stroke="#1870C5" stroke-width="1.5" points="' + points + '"/>' +
      '<circle cx="' + (pad + (data.length - 1) * step).toFixed(1) + '" cy="' +
        (h - pad - ((data[data.length - 1] - min) / range) * (h - pad * 2)).toFixed(1) +
        '" r="3" fill="#1870C5"/>' +
      '</svg>';
  }

  /**
   * Generate an SVG bar trend chart for a trend card.
   * @param {number[]} data
   * @returns {string} HTML string containing <svg>
   */
  function _buildTrendChartHtml(data) {
    var w = 320, h = 100, barW = 32, gap = 16, pad = 8;
    var min = 0;
    var max = Math.max.apply(null, data) * 1.15;

    var svg = '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">';

    data.forEach(function (v, i) {
      var barH = ((v - min) / (max - min)) * (h - pad * 2);
      var x = pad + i * (barW + gap);
      var y = h - pad - barH;
      var isLast = i === data.length - 1;
      svg += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW + '" height="' + barH.toFixed(1) + '" fill="' + (isLast ? "#1870C5" : "#9FC7EE") + '" rx="2"/>';
    });

    svg += '</svg>';
    return svg;
  }

  /**
   * Prepare the view model cards array for a given segment + view + unit + fx.
   */
  function _prepareCards(rawCards, unit, fx, isOverview) {
    return rawCards.map(function (card) {
      var actualVal = (fx === "CFX") ? card.cfx_actual : card.rfx_actual;
      if (!actualVal) actualVal = card["actual_" + unit] || card.actual_m;

      var priorVal  = card["prior_" + unit]  || card.prior_m;
      var budgetVal = card["budget_" + unit] || card.budget_m;

      return Object.assign({}, card, {
        displayActual : _formatValue(actualVal,  unit, card),
        displayPrior  : _formatValue(priorVal,   unit, card),
        displayBudget : _formatValue(budgetVal,  unit, card),
        sparkHtml     : isOverview ? _buildSparkHtml(card.sparkData || []) : "",
        trendChartHtml: !isOverview ? _buildTrendChartHtml(card.trendData || []) : "",
        label0: (card.labels || [])[0] || "",
        label1: (card.labels || [])[1] || "",
        label2: (card.labels || [])[2] || "",
        label3: (card.labels || [])[3] || "",
        label4: (card.labels || [])[4] || "",
        label5: (card.labels || [])[5] || ""
      });
    });
  }

  /* ─────────────────────────────────────────────
   *  CONTROLLER
   * ───────────────────────────────────────────── */
  return Controller.extend("finsight.controller.App", {

    /* ── Lifecycle ── */
    onInit: function () {
      this._oStateModel  = this.getOwnerComponent().getModel("state");
      this._oMockModel   = this.getOwnerComponent().getModel("mockData");

      // View model for rendered card data
      this._oViewModel = new JSONModel({ cards: [] });
      this.getView().setModel(this._oViewModel, "view");

      // Init with defaults: Group > Overview > m > RFX
      this._applyState();
      this._refreshActiveButtons();
    },

    /* ── Navigation: Segment ── */
    onSegmentPress: function (oEvent) {
      var sKey = oEvent.getSource().data("key");
      var oState = this._oStateModel.getData();

      // Switch segment but keep current view
      oState.segment = sKey;
      this._oStateModel.setData(oState);
      this._applyState();
      this._refreshActiveButtons();
    },

    /* ── Navigation: View ── */
    onViewPress: function (oEvent) {
      var sKey = oEvent.getSource().data("key");
      var oState = this._oStateModel.getData();

      oState.view = sKey;
      this._oStateModel.setData(oState);
      this._applyState();
      this._refreshActiveButtons();
    },

    /* ── Toggles ── */
    onUnitToggle: function (oEvent) {
      var sKey = oEvent.getParameter("item").getKey();
      var oState = this._oStateModel.getData();

      // Save per-segment
      oState.toggles[oState.segment].unit = sKey;
      oState.activeUnit = sKey;
      this._oStateModel.setData(oState);
      this._renderCards();
    },

    onFXToggle: function (oEvent) {
      var sKey = oEvent.getParameter("item").getKey();
      var oState = this._oStateModel.getData();

      oState.toggles[oState.segment].fx = sKey;
      oState.activeFX = sKey;
      this._oStateModel.setData(oState);
      this._renderCards();
    },

    /* ── Reset ── */
    onReset: function () {
      var oState = this._oStateModel.getData();
      var seg    = oState.segment;

      // Reset only current segment toggles
      oState.toggles[seg] = { unit: "m", fx: "RFX" };
      oState.activeUnit = "m";
      oState.activeFX   = "RFX";
      this._oStateModel.setData(oState);

      // Reset toggle UI
      this.byId("unitToggle").setSelectedKey("m");
      this.byId("fxToggle").setSelectedKey("RFX");

      this._renderCards();
    },

    /* ── Menu ── */
    onMenuPress: function () {
      // Placeholder for side navigation
      sap.m.MessageToast.show("Navigation panel");
    },

    /* ─────────────────────────────────────────────
     *  PRIVATE: orchestrate state → UI
     * ───────────────────────────────────────────── */
    _applyState: function () {
      var oState = this._oStateModel.getData();
      var seg    = oState.segment;
      var view   = oState.view;

      // Restore per-segment toggles into active
      var t = oState.toggles[seg];
      oState.activeUnit = t.unit;
      oState.activeFX   = t.fx;

      // Update header title
      oState.headerTitle = seg + " | Financials | " + view;
      this._oStateModel.setData(oState);

      // Sync toggle controls to segment's saved state
      this.byId("unitToggle").setSelectedKey(t.unit);
      this.byId("fxToggle").setSelectedKey(t.fx);

      // Render cards
      this._renderCards();
    },

    _renderCards: function () {
      var oState   = this._oStateModel.getData();
      var seg      = oState.segment;
      var view     = oState.view;
      var unit     = oState.activeUnit;
      var fx       = oState.activeFX;
      var isOverview = (view === "Overview");

      var oMock    = this._oMockModel.getData();
      var rawCards = oMock[seg][view].cards;

      var cards = _prepareCards(rawCards, unit, fx, isOverview);
      this._oViewModel.setProperty("/cards", cards);

      this._loadFragment(isOverview);
    },

    _loadFragment: function (isOverview) {
      var oContainer = this.byId("cardContainer");
      oContainer.destroyItems();

      var sFragName = isOverview
        ? "finsight.fragment.OverviewCards"
        : "finsight.fragment.TrendsCards";

      var oThis = this;
      Fragment.load({
        name      : sFragName,
        controller: oThis
      }).then(function (oFragment) {
        oContainer.addItem(oFragment);
        oThis._bindFragmentGrid(oFragment, isOverview);
      });
    },

    _bindFragmentGrid: function (oFragment, isOverview) {
      // Find the Grid inside the fragment and bind its content
      var sGridId  = isOverview ? "overviewGrid" : "trendsGrid";
      // Fragment is the grid itself or its parent; traverse
      var oGrid = oFragment.getId && oFragment.getId().indexOf(sGridId) !== -1
        ? oFragment
        : sap.ui.getCore().byId(sGridId);

      if (!oGrid) { return; }

      var oTemplate = this._buildCardTemplate(isOverview);

      oGrid.bindAggregation("content", {
        path    : "view>/cards",
        template : oTemplate
      });
    },

    /**
     * Build a programmatic card template (avoids needing a separate fragment for the template).
     */
    _buildCardTemplate: function (isOverview) {
      var Panel    = sap.m.Panel;
      var VBox     = sap.m.VBox;
      var HBox     = sap.m.HBox;
      var Title    = sap.m.Title;
      var Text     = sap.m.Text;
      var Label    = sap.m.Label;
      var HTML     = sap.ui.core.HTML;
      var Icon     = sap.ui.core.Icon;

      if (isOverview) {
        return new Panel({ backgroundDesign: "Solid", addStyleClass: "finsightKPICard" }).addContent(
          new VBox({ addStyleClass: "finsightKPICardInner" })
            .addItem(new Title({ text: "{view>title}", level: "H5", addStyleClass: "finsightCardTitle" }))
            .addItem(
              new HBox({ justifyContent: "SpaceBetween", addStyleClass: "finsightKPIRow" })
                .addItem(new VBox()
                  .addItem(new Label({ text: "Actual",    addStyleClass: "finsightKPIMeta" }))
                  .addItem(new Text({ text: "{view>displayActual}", addStyleClass: "finsightKPIActual" })))
                .addItem(new VBox()
                  .addItem(new Label({ text: "Prior Year", addStyleClass: "finsightKPIMeta" }))
                  .addItem(new Text({ text: "{view>displayPrior}",  addStyleClass: "finsightKPIPrior" })))
                .addItem(new VBox()
                  .addItem(new Label({ text: "Budget",    addStyleClass: "finsightKPIMeta" }))
                  .addItem(new Text({ text: "{view>displayBudget}", addStyleClass: "finsightKPIBudget" })))
            )
            .addItem(
              new HBox({ alignItems: "Center", addStyleClass: "finsightVarianceRow" })
                .addItem(new Icon({
                  src: "{= ${view>varianceDir} === 'up' ? 'sap-icon://trend-up' : 'sap-icon://trend-down' }",
                  addStyleClass: "{= ${view>varianceDir} === 'up' ? 'finsightVarUp' : 'finsightVarDown' }"
                }))
                .addItem(new Text({
                  text: "{= Math.abs(${view>variance}).toFixed(1) + '%' }",
                  addStyleClass: "{= ${view>varianceDir} === 'up' ? 'finsightVarUpText' : 'finsightVarDownText' }"
                }))
                .addItem(new Label({ text: " vs PY", addStyleClass: "finsightVarLabel" }))
            )
            .addItem(new HTML({ content: "{view>sparkHtml}", addStyleClass: "finsightSparkRow" }))
        );
      } else {
        // Trends card
        return new Panel({ backgroundDesign: "Solid", addStyleClass: "finsightTrendCard" }).addContent(
          new VBox({ addStyleClass: "finsightTrendCardInner" })
            .addItem(
              new HBox({ justifyContent: "SpaceBetween", alignItems: "Center", addStyleClass: "finsightTrendHeader" })
                .addItem(new Title({ text: "{view>title}", level: "H5", addStyleClass: "finsightCardTitle" }))
                .addItem(
                  new HBox({ alignItems: "Center", addStyleClass: "finsightYoYBadge" })
                    .addItem(new Icon({
                      src: "{= ${view>yoy} >= 0 ? 'sap-icon://trend-up' : 'sap-icon://trend-down' }",
                      addStyleClass: "{= ${view>yoy} >= 0 ? 'finsightVarUp' : 'finsightVarDown' }"
                    }))
                    .addItem(new Text({
                      text: "{= Math.abs(${view>yoy}).toFixed(1) + '% YoY' }",
                      addStyleClass: "{= ${view>yoy} >= 0 ? 'finsightVarUpText' : 'finsightVarDownText' }"
                    }))
                )
            )
            .addItem(new HTML({ content: "{view>trendChartHtml}", addStyleClass: "finsightTrendChartWrap" }))
            .addItem(
              new HBox({ justifyContent: "SpaceBetween", addStyleClass: "finsightTrendLabels" })
                .addItem(new Label({ text: "{view>label0}", addStyleClass: "finsightTrendLabel" }))
                .addItem(new Label({ text: "{view>label1}", addStyleClass: "finsightTrendLabel" }))
                .addItem(new Label({ text: "{view>label2}", addStyleClass: "finsightTrendLabel" }))
                .addItem(new Label({ text: "{view>label3}", addStyleClass: "finsightTrendLabel" }))
                .addItem(new Label({ text: "{view>label4}", addStyleClass: "finsightTrendLabel" }))
                .addItem(new Label({ text: "{view>label5}", addStyleClass: "finsightTrendLabel" }))
            )
        );
      }
    },

    /* ── Refresh active/selected state on nav buttons ── */
    _refreshActiveButtons: function () {
      var oState = this._oStateModel.getData();
      var seg    = oState.segment;
      var view   = oState.view;

      // Segment buttons
      ["Group", "CIB", "WRB"].forEach(function (s) {
        var oBtn = this.byId("btn" + s);
        if (oBtn) {
          oBtn.removeStyleClass("finsightSegBtnActive");
          if (s === seg) { oBtn.addStyleClass("finsightSegBtnActive"); }
        }
      }, this);

      // View buttons
      ["Overview", "Trends"].forEach(function (v) {
        var oBtn = this.byId("btn" + v);
        if (oBtn) {
          oBtn.removeStyleClass("finsightViewBtnActive");
          if (v === view) { oBtn.addStyleClass("finsightViewBtnActive"); }
        }
      }, this);
    }

  });
});

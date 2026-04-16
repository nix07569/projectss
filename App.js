sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("project1.controller.View1", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("overview").attachPatternMatched(
                this._onOverviewMatched, this
            );
        },

        _onOverviewMatched: function () {
            var oView = this.getView();
            var oComponent = this.getOwnerComponent();

            var oStoreModel = oComponent.getModel("store"); 
            
            if (!oStoreModel) {
                oStoreModel = new JSONModel({
                    state: {
                        selectedTop: "Group",
                        selectedSub: "Overview",
                        unit: "$m",
                        currency: "RFX"
                    }
                });
                oComponent.setModel(oStoreModel, "store"); 
                
                this._refreshNavToggles();
                this._updateGrid(); 
            } else {
                oStoreModel.setProperty("/state/selectedSub", "Overview");
                this._refreshNavToggles();
                this._updateGrid();
            }

            var oChartModel = oView.getModel("chartStore");
            if (!oChartModel) {
                var sChartPath = sap.ui.require.toUrl("project1/model/data.json");
                oChartModel = new JSONModel();
                oChartModel.attachRequestCompleted(function () {
                    this._chartData = oChartModel.getData().chartData;
                    oView.setModel(oChartModel, "chartStore");
                    setTimeout(function () {
                        this._loadAndRenderECharts();
                    }.bind(this), 150);
                }.bind(this));
                oChartModel.loadData(sChartPath);
            } else {
                this._chartData = oChartModel.getData().chartData;
                setTimeout(function () {
                    this._loadAndRenderECharts();
                }.bind(this), 150);
            }
        },

        _refreshNavToggles: function () {
            var oModel = this.getOwnerComponent().getModel("store");
            if (!oModel) return;

            var sTop      = oModel.getProperty("/state/selectedTop");
            var sSub      = oModel.getProperty("/state/selectedSub");
            var sUnit     = oModel.getProperty("/state/unit");
            var sCurrency = oModel.getProperty("/state/currency");

            this._setToggleActive("groupToggle",    sTop === "Group");
            this._setToggleActive("CIBtoggle",      sTop === "CIB");
            this._setToggleActive("WRBtoggle",      sTop === "WRB");
            this._setToggleActive("overviewToggle", sSub === "Overview");
            this._setToggleActive("trendsToggle",   sSub === "Trends");
            this._setToggleActive("btnM",           sUnit === "$m");
            this._setToggleActive("btnBn",          sUnit === "$bn");
            this._setToggleActive("btnRFX",         sCurrency === "RFX");
            this._setToggleActive("btnCFX",         sCurrency === "CFX");
        },

        _setToggleActive: function (sLocalId, bActive) {
            var oControl = this.byId(sLocalId);
            if (!oControl) return;
            var oDom = oControl.getDomRef();
            if (oDom) {
                oDom.setAttribute("data-activeItem", bActive ? "true" : "false");
            }
        },

        onPageSelect: function (oEvent) {
            var sText  = oEvent.getSource().getText();
            var oModel = this.getOwnerComponent().getModel("store");
            oModel.setProperty("/state/selectedTop", sText);
            this._refreshNavToggles();
            this._updateGrid();
        },

        onSubPageSelect: function (oEvent) {
            var sText  = oEvent.getSource().getText();
            var oModel = this.getOwnerComponent().getModel("store");
            oModel.setProperty("/state/selectedSub", sText);
            this._refreshNavToggles();
            this._updateGrid();
        },

        oncustomToggleClick: function (oEvent) {
            var sText  = oEvent.getSource().getText();
            var oModel = this.getOwnerComponent().getModel("store");
            
            if (sText === "$m" || sText === "$bn") {
                oModel.setProperty("/state/unit", sText);
            } else if (sText === "RFX" || sText === "CFX") {
                oModel.setProperty("/state/currency", sText);
            }
            this._refreshNavToggles();
            this._updateGrid();
        },

        onTrendsNavigate: function () {
            var oModel = this.getOwnerComponent().getModel("store");
            if (oModel) {
                oModel.setProperty("/state/selectedSub", "Trends");
                this._refreshNavToggles();
            }
            this.getOwnerComponent().getRouter().navTo("trends");
        },

        _updateGrid: function () {
            var oView      = this.getView();
            var oModel     = this.getOwnerComponent().getModel("store");
            if (!oModel) return;

            var oState     = oModel.getProperty("/state");
            var oContainer = this.byId("mainCardsContainer");
            if (!oContainer) return;

            oContainer.destroyItems();
            this._fetchId = (this._fetchId || 0) + 1;
            var iCurrentFetchId = this._fetchId;

            var oPayload = {
                topGroup: oState.selectedTop || "Group",
                displayUnit: oState.unit || "$m",
                currencyType: oState.currency || "RFX"
            };

            var that = this;
            var sCurrencyKey = oState.currency ? oState.currency.toLowerCase() : "rfx";

            var pLoadSkeleton = this._oSkeletonTemplate ? Promise.resolve() : sap.ui.core.Fragment.load({ name: "project1.view.fragments.SkeletonCard", controller: this }).then(function(f) { that._oSkeletonTemplate = f; });
            var pLoadCard = this._oKpiCardTemplate ? Promise.resolve() : sap.ui.core.Fragment.load({ name: "project1.view.fragments.KpiCard", controller: this }).then(function(f) { that._oKpiCardTemplate = f; });

            Promise.all([pLoadSkeleton, pLoadCard]).then(function() {
                $.ajax({
                    url: "/api/nrfp/getWidgetNames",
                    method: "POST",
                    contentType: "application/json",
                    data: "{}",
                    success: function (oResp) {
                        if (that._fetchId !== iCurrentFetchId) return;

                        var aWidgets = oResp.value || oResp;
                        
                        var tDashboardStart = performance.now(); 
                        var aPromises = []; 

                        aWidgets.forEach(function (sWidgetName) {
                            var oSkeleton = that._oSkeletonTemplate.clone();
                            oContainer.addItem(oSkeleton);

                            var oSinglePayload = Object.assign({}, oPayload, { widgetName: sWidgetName });

                            var pSingleRequest = new Promise(function(resolve) {
                                var tCardStart = performance.now();

                                $.ajax({
                                    url: "/api/nrfp/getWidgetDataSingle", 
                                    method: "POST",
                                    contentType: "application/json",
                                    data: JSON.stringify(oSinglePayload),
                                    success: function (oWidgetResp) {
                                        if (that._fetchId === iCurrentFetchId) {
                                            var oResult = oWidgetResp.value || oWidgetResp;
                                            
                                            var tCardEnd = performance.now();
                                            var nCardDuration = Math.round(tCardEnd - tCardStart);
                                            console.log("⏱️ [Card] " + sWidgetName + " | Total UI Time: " + nCardDuration + "ms | Backend DB Time: " + oResult.durationMs + "ms");

                                            if (oResult.status === "ok" && oResult.data) {
                                                try {
                                                    var oParsed = JSON.parse(oResult.data);
                                                    var oCardData = oParsed[sCurrencyKey] || {};
                                                    oCardData.widget = oParsed.widget;

                                                    // ── NEW LOGIC: $m / $bn Unit Scaling ──
                                                    if (oState.unit === "$bn") {
                                                        // Explicitly target ONLY the main numbers, avoiding the YoY bracket values
                                                        var aScaleFields = ["ytdActuals", "vsBudget", "pqActuals", "fyOutlook"];
                                                        
                                                        aScaleFields.forEach(function (sField) {
                                                            if (oCardData[sField] !== undefined) {
                                                                var nVal = parseFloat(oCardData[sField]);
                                                                if (!isNaN(nVal)) {
                                                                    // Divide by 1000 to convert millions to billions
                                                                    oCardData[sField] = (nVal / 1000).toFixed(2);
                                                                }
                                                            }
                                                        });
                                                    }
                                                    // ── END NEW LOGIC ──

                                                    var oCard = that._oKpiCardTemplate.clone();
                                                    var oCardModel = new sap.ui.model.json.JSONModel(oCardData);
                                                    oCard.setModel(oCardModel, "card");

                                                    var iIndex = oContainer.indexOfItem(oSkeleton);
                                                    if (iIndex !== -1) {
                                                        oContainer.removeItem(oSkeleton);
                                                        oContainer.insertItem(oCard, iIndex);
                                                        oSkeleton.destroy(); 
                                                    }
                                                } catch (e) {
                                                    console.error("JSON parsing failed for widget:", sWidgetName, e);
                                                }
                                            }
                                        }
                                        resolve(); 
                                    },
                                    error: function () {
                                        console.error("Failed to fetch data for:", sWidgetName);
                                        resolve(); 
                                    }
                                });
                            });

                            aPromises.push(pSingleRequest); 
                        });

                        Promise.all(aPromises).then(function() {
                            if (that._fetchId === iCurrentFetchId) {
                                var tDashboardEnd = performance.now();
                                var nTotalDuration = Math.round(tDashboardEnd - tDashboardStart);
                                console.log("🚀 [DASHBOARD] All cards fully loaded! Total time: " + nTotalDuration + "ms");
                            }
                        });
                    }
                });
            });
        },

        _loadAndRenderECharts: function () {
            if (window.echarts) {
                this._renderChart();
                return;
            }
            var oScript    = document.createElement("script");
            oScript.src    = "https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js";
            oScript.onload = function () {
                this._renderChart();
            }.bind(this);
            document.head.appendChild(oScript);
        },

        _renderChart: function () {
            var sDomId = this.getView().getId() + "--echartsContainer";
            var oDom   = document.getElementById(sDomId);
            if (!oDom || !this._chartData) return;

            var oExisting = window.echarts.getInstanceByDom(oDom);
            if (oExisting) oExisting.dispose();

            var oChart = echarts.init(oDom);
            var aData  = this._chartData;

            function fmt(val) {
                if (val === 0) return "0";
                var abs  = Math.abs(val);
                var sign = val < 0 ? "-" : "";
                if (abs >= 1e9) return sign + (abs / 1e9).toFixed(3).replace(/\.?0+$/, "") + "B";
                if (abs >= 1e6) return sign + (abs / 1e6).toFixed(3).replace(/\.?0+$/, "") + "M";
                return sign + abs.toLocaleString();
            }

            var aCategories = aData.map(function (d) { return d.product; });
            var aFyOutlook  = aData.map(function (d) { return d.fyOutlook; });
            var aYtd        = aData.map(function (d) { return d.ytd; });
            var aFyBudget   = aData.map(function (d) { return d.fyBudget; });

            oChart.setOption({
                backgroundColor: "#ffffff",
                legend: {
                    top: 0, right: 0,
                    itemWidth: 12, itemHeight: 12,
                    textStyle: { fontSize: 11, color: "#333" },
                    data: [
                        { name: "FY Outlook", icon: "rect" },
                        { name: "YTD", icon: "rect" },
                        { name: "FY Budget", icon: "rect" }
                    ]
                },
                grid: { left: 60, right: 20, top: 40, bottom: 50 },
                xAxis: {
                    type: "category",
                    data: aCategories,
                    axisLine: { lineStyle: { color: "#ccc" } },
                    axisTick: { show: false },
                    axisLabel: { color: "#555", fontSize: 11 }
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        color: "#555", fontSize: 10,
                        formatter: function (val) { return fmt(val); }
                    },
                    splitLine: { lineStyle: { color: "#f0f0f0" } },
                    axisLine: { show: false }
                },
                tooltip: {
                    trigger: "axis",
                    formatter: function (params) {
                        var str = params[0].axisValue + "<br/>";
                        params.forEach(function (p) {
                            str += p.marker + " " + p.seriesName +
                                   ": " + fmt(p.value) + "<br/>";
                        });
                        return str;
                    }
                },
                series: [
                    {
                        name: "FY Outlook", type: "bar",
                        data: aFyOutlook, barWidth: 50, z: 1,
                        itemStyle: { color: "#1565c0" },
                        label: {
                            show: true, position: "top",
                            color: "#333", fontSize: 9,
                            formatter: function (p) { return fmt(p.value); }
                        }
                    },
                    {
                        name: "YTD", type: "bar",
                        data: aYtd, barWidth: 35,
                        barGap: "-100%", z: 2,
                        itemStyle: { color: "#1e88e5" },
                        label: {
                            show: true, position: "top",
                            color: "#333", fontSize: 9,
                            formatter: function (p) { return fmt(p.value); }
                        }
                    },
                    {
                        name: "FY Budget", type: "bar",
                        data: aFyBudget, barWidth: 20,
                        barGap: "-100%", z: 3,
                        itemStyle: { color: "#90caf9" },
                        label: { show: false }
                    }
                ]
            });

            window.addEventListener("resize", function () { oChart.resize(); });
        }
    });
});

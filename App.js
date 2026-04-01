sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("project1.controller.View1", {

        onInit: function () {
            // 1. Define the Initial State and Mock Data structure
            var oData = {
                state: {
                    selectedTop: "Group",
                    selectedSub: "Overview",
                    unit: "$m",
                    currency: "RFX"
                },
                content: {
                    "Group": {
                        "Overview": {
                            "$m": {
                                "RFX": [
                                    { title: "Funded Assets", primaryValue: "-0.01", primaryPercent: "(166.16%)", isNegative: true, subLabel: "YTD Actuals (YoY %)", budgetVal: "0.27", cyPqValue: "-0.04", cyPqPercent: "(138.54%)" },
                                    { title: "Net Interest Income", primaryValue: "1.25", primaryPercent: "5.4%", isNegative: false, subLabel: "YTD Actuals (YoY %)", budgetVal: "1.10", cyPqValue: "1.05", cyPqPercent: "2.1%" }
                                ],
                                "CFX": [] // Empty arrays will naturally clear the screen
                            },
                            "$bn": { "RFX": [], "CFX": [] }
                        },
                        "Trends": {
                            "$m": { "RFX": [], "CFX": [] },
                            "$bn": { "RFX": [], "CFX": [] }
                        }
                    },
                    "CIB": {
                        "Overview": { "$m": { "RFX": [], "CFX": [] }, "$bn": { "RFX": [], "CFX": [] } },
                        "Trends": { "$m": { "RFX": [], "CFX": [] }, "$bn": { "RFX": [], "CFX": [] } }
                    },
                    "WRB": {
                        "Overview": { "$m": { "RFX": [], "CFX": [] }, "$bn": { "RFX": [], "CFX": [] } },
                        "Trends": { "$m": { "RFX": [], "CFX": [] }, "$bn": { "RFX": [], "CFX": [] } }
                    }
                }
            };

            // 2. Set the Model to the View named "store"
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "store");

            // 3. Load the initial grid based on the default state
            this._updateGrid();
        },

        // --- EVENT HANDLERS ---
        // These correspond directly to the 'press' events in your XML screenshot

        // Triggered by "Group", "CIB", "WRB" links (press=".onPageSelect")
        onPageSelect: function (oEvent) {
            var sText = oEvent.getSource().getText();
            this.getView().getModel("store").setProperty("/state/selectedTop", sText);
            this._updateGrid();
        },

        // Triggered by "Overview", "Trends" links (press=".onSubPageSelect")
        onSubPageSelect: function (oEvent) {
            var sText = oEvent.getSource().getText();
            this.getView().getModel("store").setProperty("/state/selectedSub", sText);
            this._updateGrid();
        },

        // Triggered by "$m", "$bn", "RFX", "CFX" (press=".oncustomToggleClick")
        oncustomToggleClick: function (oEvent) {
            var sText = oEvent.getSource().getText();
            var oModel = this.getView().getModel("store");

            // Determine which toggle category was clicked based on the text
            if (sText === "$m" || sText === "$bn") {
                oModel.setProperty("/state/unit", sText);
            } else if (sText === "RFX" || sText === "CFX") {
                oModel.setProperty("/state/currency", sText);
            }
            
            this._updateGrid();
        },

        // --- MAIN LOGIC ---

        _updateGrid: function () {
            var oView = this.getView();
            var oModel = oView.getModel("store");
            var oState = oModel.getProperty("/state");
            var oContainer = this.byId("mainCardsContainer");
            
            // Build the path based on the 4 selected variables (e.g., /content/Group/Overview/$m/RFX)
            var sPath = "/content/" + oState.selectedTop + "/" + oState.selectedSub + "/" + oState.unit + "/" + oState.currency;
            
            // Get the array of card data for this specific path
            var aCards = oModel.getProperty(sPath);

            // 1. Clear the existing cards on the screen
            oContainer.destroyItems();

            // 2. If data exists for this combination, generate the fragments
            if (aCards && aCards.length > 0) {
                
                // We use Promise.all to ensure all cards load asynchronously but render in the correct array order
                var aFragmentPromises = aCards.map(function (oCardData) {
                    return Fragment.load({
                        name: "project1.view.fragments.KpiCard", // IMPORTANT: Ensure this path matches your folder structure
                        controller: this
                    }).then(function (oFragment) {
                        // Bind the specific card's data to this newly created fragment instance using the name "card"
                        var oCardModel = new JSONModel(oCardData);
                        oFragment.setModel(oCardModel, "card");
                        return oFragment;
                    });
                }.bind(this));

                // Once all fragments are generated, attach them to the container
                Promise.all(aFragmentPromises).then(function (aFragments) {
                    aFragments.forEach(function (oFragment) {
                        oContainer.addItem(oFragment);
                    });
                });

            } else {
                // Optional: If the array is empty, show a fallback message instead of just blank space
                // oContainer.addItem(new sap.m.Text({ text: "No data available for this view.", class: "sapUiLargeMargin" }));
            }
        }
    });
});




{
    "state": {
        "selectedTop": "Group",
        "selectedSub": "Overview",
        "unit": "$m",
        "currency": "RFX"
    },
    "content": {
        "Group": {
            "Overview": {
                "$m": {
                    "RFX": [
                        { 
                            "title": "Funded Assets", 
                            "primaryValue": "-0.01", 
                            "primaryPercent": "(166.16%)", 
                            "isNegative": true, 
                            "subLabel": "YTD Actuals (YoY %)", 
                            "budgetVal": "0.27", 
                            "cyPqValue": "-0.04", 
                            "cyPqPercent": "(138.54%)" 
                        }
                    ],
                    "CFX": []
                },
                "$bn": { "RFX": [], "CFX": [] }
            },
            "Trends": {
                "$m": { "RFX": [], "CFX": [] },
                "$bn": { "RFX": [], "CFX": [] }
            }
        },
        "CIB": {
            "Overview": { "$m": { "RFX": [], "CFX": [] }, "$bn": { "RFX": [], "CFX": [] } },
            "Trends": { "$m": { "RFX": [], "CFX": [] }, "$bn": { "RFX": [], "CFX": [] } }
        },
        "WRB": {
            "Overview": { "$m": { "RFX": [], "CFX": [] }, "$bn": { "RFX": [], "CFX": [] } },
            "Trends": { "$m": { "RFX": [], "CFX": [] }, "$bn": { "RFX": [], "CFX": [] } }
        }
    }
}


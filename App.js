{
    "title": "Funded Assets",
    "primaryValue": "-0.01",
    "primaryPercent": "166.16%",
    "isNegative": true,
    "subLabel": "YTD Actuals (YoY %)",

    "row1Label": "Vs. Budget",
    "row1Value": "0.27",

    "row2Label": "CY PQ Actuals (YoY %)",
    "row2Value": "-0.04",
    "row2Percent": "138.54%",
    "row2IsNegative": true,

    "row3Label": "FY Outlook (YoY %)",
    "row3Value": "0.28",
    "row3Percent": "49.84%",
    "row3IsNegative": false
}






sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("project1.controller.View1", {

        onInit: function () {
            // 1. Load the JSON file
            // IMPORTANT: Change "project1" if your app namespace is different
            var sDataPath = sap.ui.require.toUrl("project1/model/mockData.json");
            var oModel = new JSONModel();
            
            // 2. Attach a success handler before loading data
            oModel.attachRequestCompleted(function() {
                this._updateGrid();
            }.bind(this));

            // 3. Load the data and set to view
            oModel.loadData(sDataPath);
            this.getView().setModel(oModel, "store");
        },

        onPageSelect: function (oEvent) {
            var sText = oEvent.getSource().getText();
            this.getView().getModel("store").setProperty("/state/selectedTop", sText);
            this._updateGrid();
        },

        onSubPageSelect: function (oEvent) {
            var sText = oEvent.getSource().getText();
            this.getView().getModel("store").setProperty("/state/selectedSub", sText);
            this._updateGrid();
        },

        oncustomToggleClick: function (oEvent) {
            var sText = oEvent.getSource().getText();
            var oModel = this.getView().getModel("store");

            if (sText === "$m" || sText === "$bn") {
                oModel.setProperty("/state/unit", sText);
            } else if (sText === "RFX" || sText === "CFX") {
                oModel.setProperty("/state/currency", sText);
            }
            this._updateGrid();
        },

        _updateGrid: function () {
            var oView = this.getView();
            var oModel = oView.getModel("store");
            var oState = oModel.getProperty("/state");
            var oContainer = this.byId("mainCardsContainer");
            
            if (!oContainer) {
                console.error("Container 'mainCardsContainer' not found in View!");
                return;
            }

            var sPath = "/content/" + oState.selectedTop + "/" + oState.selectedSub + "/" + oState.unit + "/" + oState.currency;
            var aCards = oModel.getProperty(sPath);

            oContainer.destroyItems();

            if (aCards && aCards.length > 0) {
                var aFragmentPromises = aCards.map(function (oCardData) {
                    return Fragment.load({
                        // IMPORTANT: Ensure this path matches your folder structure
                        name: "project1.view.fragments.KpiCard", 
                        controller: this
                    }).then(function (oFragment) {
                        var oCardModel = new JSONModel(oCardData);
                        oFragment.setModel(oCardModel, "card");
                        return oFragment;
                    });
                }.bind(this));

                Promise.all(aFragmentPromises).then(function (aFragments) {
                    aFragments.forEach(function (oFragment) {
                        oContainer.addItem(oFragment);
                    });
                }).catch(function(err) {
                    console.error("Fragment loading failed:", err);
                });
            }
        }
    });
});



<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">
    <VBox class="customKpiCard sapUiSmallMargin">
        <Title text="{card>/title}" class="kpiCardTitle"/>
        
        <VBox>
            <HBox class="cardValue">
                <Text text="{card>/primaryValue}" class="primaryKpiValue sapUiTinyMarginEnd" />
                <Text text="{card>/primaryPercent}" 
                      class="{= ${card>/isNegative} ? 'negativePercentText' : 'positivePercentText'} primaryKpiPercent" />
            </HBox>
            <Text text="{card>/subLabel}" class="kpiSubLabel" />
        </VBox>

        <VBox class="impairmentsBottom" width="100%">
            <HBox justifyContent="SpaceBetween">
                <Text text="Vs. Budget" class="kpiSubLabel" />
                <Text text="{card>/budgetVal}" class="secondaryKpiValue" />
            </HBox>
            
            <HBox justifyContent="SpaceBetween" class="tightrow">
                <Text text="CY PQ Actuals (YoY %)" class="kpiSubLabel" />
                <HBox alignItems="Baseline">
                    <Text text="{card>/cyPqValue}" class="secondaryKpiValue sapUiTinyMarginEnd" />
                    <Text text="{card>/cyPqPercent}" class="negativePercentText secondaryKpiPercent" />
                </HBox>
            </HBox>
        </VBox>
    </VBox>
</core:FragmentDefinition>




chxchh

<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">
    <VBox class="customKpiCard sapUiSmallMargin">
        
        <Title text="{card>/title}" class="kpiCardTitle"/>
        
        <VBox>
            <HBox class="cardValue" alignItems="Center">
                <Text text="{card>/primaryValue}" class="primaryKpiValue sapUiTinyMarginEnd" />
                
                <core:Icon 
                    src="{= ${card>/isNegative} === true ? 'sap-icon://down' : 'sap-icon://up' }"
                    class="{= ${card>/isNegative} === true ? 'negativePercentText' : 'positivePercentText' } sapUiTinyMarginEnd" />
                
                <Text 
                    text="{card>/primaryPercent}" 
                    class="{= ${card>/isNegative} === true ? 'negativePercentText' : 'positivePercentText' } primaryKpiPercent" />
            </HBox>
            <Text text="{card>/subLabel}" class="kpiSubLabel" />
        </VBox>

        <VBox class="impairmentsBottom" width="100%">
            
            <HBox justifyContent="SpaceBetween" class="tightrow">
                <Text text="Vs. Budget" class="kpiSubLabel" />
                <Text text="{card>/budgetVal}" class="secondaryKpiValue" />
            </HBox>
            
            <HBox justifyContent="SpaceBetween" class="tightrow">
                <Text text="CY PQ Actuals (YoY %)" class="kpiSubLabel" />
                <HBox alignItems="Center">
                    <Text text="{card>/cyPqValue}" class="secondaryKpiValue sapUiTinyMarginEnd" />
                    
                    <core:Icon 
                        src="{= ${card>/cyPqIsNegative} === true ? 'sap-icon://down' : 'sap-icon://up' }"
                        class="{= ${card>/cyPqIsNegative} === true ? 'negativePercentText' : 'positivePercentText' } sapUiTinyMarginEnd" />
                    
                    <Text 
                        text="{card>/cyPqPercent}" 
                        class="{= ${card>/cyPqIsNegative} === true ? 'negativePercentText' : 'positivePercentText' } secondaryKpiPercent" />
                </HBox>
            </HBox>

            <HBox justifyContent="SpaceBetween" class="tightrow">
                <Text text="FY Outlook (YoY %)" class="kpiSubLabel" />
                <HBox alignItems="Center">
                    <Text text="{card>/fyOutlookValue}" class="secondaryKpiValue sapUiTinyMarginEnd" />
                    
                    <core:Icon 
                        src="{= ${card>/fyOutlookIsNegative} === true ? 'sap-icon://down' : 'sap-icon://up' }"
                        class="{= ${card>/fyOutlookIsNegative} === true ? 'negativePercentText' : 'positivePercentText' } sapUiTinyMarginEnd" />
                    
                    <Text 
                        text="{card>/fyOutlookPercent}" 
                        class="{= ${card>/fyOutlookIsNegative} === true ? 'negativePercentText' : 'positivePercentText' } secondaryKpiPercent" />
                </HBox>
            </HBox>

        </VBox>
    </VBox>
</core:FragmentDefinition>





jshshhsjsjwkwk


/* --- Card Container --- */
.customKpiCard {
    background-color: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 0.25rem;
    padding: 1rem;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
    min-width: 250px;
}

/* --- Title --- */
.kpiCardTitle {
    font-size: 1rem !important;
    font-weight: bold !important;
    color: #333333 !important;
    margin-bottom: 1rem !important;
}

/* --- Primary KPI Section (Top) --- */
.primaryKpiValue {
    font-size: 1rem !important;
    font-weight: bold !important;
    color: #333333 !important;
}

.primaryKpiPercent {
    font-size: 1rem !important;
    font-weight: bold !important;
}

/* --- Sub Labels (Grey text like "YTD Actuals") --- */
.kpiSubLabel {
    font-size: 0.75rem !important;
    color: #666666 !important;
    margin-top: 0.25rem !important;
}

/* --- Secondary KPI Section (Bottom rows) --- */
.impairmentsBottom {
    margin-top: 1rem;
    border-top: 1px solid #f2f2f2; /* Optional: adds a subtle line above the bottom section */
    padding-top: 0.5rem;
}

.tightrow {
    margin-top: 0.25rem;
}

.secondaryKpiValue {
    font-size: 0.75rem !important;
    color: #333333 !important;
}

.secondaryKpiPercent {
    font-size: 0.75rem !important;
}

/* --- Dynamic Colors --- */
.sapThemeNegativeText {
    color: var(--sapThemeNegativeText, #bb0000) !important;
}

.sapThemePositiveText {
    color: var(--sapThemePositiveText, #2b7d2b) !important;
}

/* --- Fix Icon Alignment --- */
.customKpiCard .sapUiIcon {
    vertical-align: baseline !important;
    margin: 0 1px !important; /* Keeps the arrow tight against the text */
}


<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">
    <VBox class="customKpiCard">
        
        <Title text="{card>/title}" class="kpiCardTitle"/>
        
        <VBox>
            <HBox class="cardValue" alignItems="Baseline">
                
                <Text text="{card>/primaryValue}" class="primaryKpiValue" />
                
                <HBox alignItems="Baseline" class="sapUiTinyMarginBegin">
                    <Text text="(" class="{= ${card>/isNegative} === true ? 'sapThemeNegativeText primaryKpiPercent' : 'sapThemePositiveText primaryKpiPercent' }" />
                    
                    <core:Icon 
                        src="{= ${card>/isNegative} === true ? 'sap-icon://arrow-bottom' : 'sap-icon://arrow-top' }"
                        size="1rem"
                        class="{= ${card>/isNegative} === true ? 'sapThemeNegativeText' : 'sapThemePositiveText' }" />
                    
                    <Text 
                        text="{card>/primaryPercent})" 
                        class="{= ${card>/isNegative} === true ? 'sapThemeNegativeText primaryKpiPercent' : 'sapThemePositiveText primaryKpiPercent' }" />
                </HBox>
            </HBox>
            
            <Text text="{card>/subLabel}" class="kpiSubLabel" />
        </VBox>

        <VBox class="impairmentsBottom" width="100%">
            
            <HBox justifyContent="SpaceBetween" visible="{= ${card>/row1Label} !== undefined }">
                <Text text="{card>/row1Label}" class="kpiSubLabel" />
                <Text text="{card>/row1Value}" class="secondaryKpiValue" />
            </HBox>
            
            <HBox justifyContent="SpaceBetween" class="tightrow" visible="{= ${card>/row2Label} !== undefined }">
                <Text text="{card>/row2Label}" class="kpiSubLabel" />
                
                <HBox alignItems="Baseline">
                    <Text text="{card>/row2Value}" class="secondaryKpiValue sapUiTinyMarginEnd" />
                    
                    <HBox alignItems="Baseline">
                        <Text text="(" class="{= ${card>/row2IsNegative} === true ? 'sapThemeNegativeText secondaryKpiPercent' : 'sapThemePositiveText secondaryKpiPercent' }" />
                        
                        <core:Icon 
                            src="{= ${card>/row2IsNegative} === true ? 'sap-icon://arrow-bottom' : 'sap-icon://arrow-top' }"
                            size="0.75rem"
                            class="{= ${card>/row2IsNegative} === true ? 'sapThemeNegativeText' : 'sapThemePositiveText' }" />
                        
                        <Text 
                            text="{card>/row2Percent})" 
                            class="{= ${card>/row2IsNegative} === true ? 'sapThemeNegativeText secondaryKpiPercent' : 'sapThemePositiveText secondaryKpiPercent' }" />
                    </HBox>
                </HBox>
            </HBox>

            <HBox justifyContent="SpaceBetween" class="tightrow" visible="{= ${card>/row3Label} !== undefined }">
                <Text text="{card>/row3Label}" class="kpiSubLabel" />
                
                <HBox alignItems="Baseline">
                    <Text text="{card>/row3Value}" class="secondaryKpiValue sapUiTinyMarginEnd" />
                    
                    <HBox alignItems="Baseline">
                        <Text text="(" class="{= ${card>/row3IsNegative} === true ? 'sapThemeNegativeText secondaryKpiPercent' : 'sapThemePositiveText secondaryKpiPercent' }" />
                        
                        <core:Icon 
                            src="{= ${card>/row3IsNegative} === true ? 'sap-icon://arrow-bottom' : 'sap-icon://arrow-top' }"
                            size="0.75rem"
                            class="{= ${card>/row3IsNegative} === true ? 'sapThemeNegativeText' : 'sapThemePositiveText' }" />
                        
                        <Text 
                            text="{card>/row3Percent})" 
                            class="{= ${card>/row3IsNegative} === true ? 'sapThemeNegativeText secondaryKpiPercent' : 'sapThemePositiveText secondaryKpiPercent' }" />
                    </HBox>
                </HBox>
            </HBox>

        </VBox>
    </VBox>
</core:FragmentDefinition>



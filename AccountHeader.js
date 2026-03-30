<mvc:View
    controllerName="project1.controller.View1"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m"
    xmlns:f="sap.f"
    xmlns:w="sap.ui.integration.widgets"
    displayBlock="true">

    <f:DynamicPage id="page" headerExpanded="true" fitContent="true">
        
        <f:title>
            <f:DynamicPageTitle>
                <f:heading>
                    <Title text="{pageState>/selectedOrg} | Financials {pageState>/selectedView}" level="H2" />
                </f:heading>
                
                <f:actions>
                    <SegmentedButton selectedKey="{pageState>/selectedOrg}" selectionChange=".onToggleChange">
                        <items>
                            <SegmentedButtonItem key="Group" text="Group" />
                            <SegmentedButtonItem key="CIB" text="CIB" />
                            <SegmentedButtonItem key="WRB" text="WRB" />
                        </items>
                    </SegmentedButton>

                    <SegmentedButton selectedKey="{pageState>/selectedView}" selectionChange=".onToggleChange">
                        <items>
                            <SegmentedButtonItem key="Overview" text="Overview" />
                            <SegmentedButtonItem key="Trends" text="Trends" />
                        </items>
                    </SegmentedButton>

                    <SegmentedButton selectedKey="{pageState>/selectedScale}" selectionChange=".onToggleChange">
                        <items>
                            <SegmentedButtonItem key="m" text="$m" />
                            <SegmentedButtonItem key="bn" text="$bn" />
                        </items>
                    </SegmentedButton>
                </f:actions>
            </f:DynamicPageTitle>
        </f:title>

        <f:content>
            <VBox id="mainContentWrapper" width="100%">
                
                <f:GridContainer 
                    id="overviewContainer" 
                    visible="{= ${pageState>/selectedView} === 'Overview' }"
                    snapToRow="true">
                    
                    <f:layout>
                        <f:GridContainerSettings id="defaultGridSettings" rowSize="80px" columnSize="16%" gap="1rem" />
                    </f:layout>
                    
                    <f:items>
                        <w:Card 
                            id="cardIncome"
                            manifest="./cards/income/manifest.json" 
                            parameters="{ 'org': '{pageState>/selectedOrg}', 'scale': '{pageState>/selectedScale}' }">
                            <w:layoutData>
                                <f:GridContainerItemLayoutData id="lytInc" columns="1" rows="3" />
                            </w:layoutData>
                        </w:Card>

                        </f:items>
                </f:GridContainer>

                <VBox 
                    id="trendsContainer" 
                    visible="{= ${pageState>/selectedView} === 'Trends' }"
                    alignItems="Center" 
                    justifyContent="Center"
                    height="400px">
                    <IllustratedMessage illustrationType="sapIllus-EmptyList" title="Trends Data" description="Trends reference will be added later." />
                </VBox>

            </VBox>
        </f:content>
    </f:DynamicPage>
</mvc:View>


controller....

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit: function () {
            // 1. Define the default state of the dashboard
            var oStateData = {
                selectedOrg: "CIB",      // Options: Group, CIB, WRB
                selectedView: "Overview", // Options: Overview, Trends
                selectedScale: "m"        // Options: m, bn
            };

            // 2. Bind it to the view so the UI and Cards can react to it
            var oStateModel = new JSONModel(oStateData);
            this.getView().setModel(oStateModel, "pageState");
        },

        onToggleChange: function(oEvent) {
            // Fetch the newly selected values
            var oModel = this.getView().getModel("pageState");
            var sOrg = oModel.getProperty("/selectedOrg");
            var sView = oModel.getProperty("/selectedView");

            // Optional: Provide visual feedback (The cards will update automatically)
            MessageToast.show("Switched to " + sOrg + " | " + sView);
            
            // Note: Because the Integration Cards have their parameters bound to this model,
            // they will automatically detect this change and re-fetch their data/titles.
        }
    });
});


manifest.json


{
  "sap.app": {
    "id": "my.app.cards.income",
    "type": "card"
  },
  "sap.card": {
    "type": "Analytical",
    "configuration": {
      "parameters": {
        "org": {"value": "CIB"},
        "scale": {"value": "m"}
      }
    },
    "data": {
      "request": {
        "url": "./cards/income/mockData.json"
      },
      "path": "/{{parameters.org}}"
    },
    "header": {
      "type": "Numeric",
      "title": "Income ({{parameters.org}})",
      "subTitle": "YTD Actuals",
      "mainIndicator": {
        "number": "{total}",
        "unit": "{{parameters.scale}}"
      },
      "details": "Vs Budget: {budgetDiff}%"
    },
    "content": {
      "chartType": "Line",
      "dimensions": [{"label": "Month", "value": "{Month}"}],
      "measures": [{"label": "Income", "value": "{Amount}"}]
    }
  }
}


mock data

{
    "Group": {
        "total": "28.50",
        "budgetDiff": "+4.2",
        "Month": "Dec",
        "Amount": "2.8"
    },
    "CIB": {
        "total": "9.01",
        "budgetDiff": "+1.85",
        "Month": "Dec",
        "Amount": "1.2"
    },
    "WRB": {
        "total": "14.22",
        "budgetDiff": "-0.5",
        "Month": "Dec",
        "Amount": "1.5"
    }
}


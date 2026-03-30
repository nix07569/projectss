<mvc:View
    controllerName="my.app.controller.Dashboard"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m"
    xmlns:f="sap.f"
    xmlns:w="sap.ui.integration.widgets"
    displayBlock="true">

    <f:DynamicPage id="page" headerExpanded="true">
        
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
            <f:GridContainer 
                id="overviewContainer" 
                visible="{= ${pageState>/selectedView} === 'Overview' }"
                snapToRow="true">
                <f:layout>
                    <f:GridContainerSettings rowSize="80px" columnSize="16%" gap="1rem" />
                </f:layout>
                <f:items>
                    <w:Card manifest="./cards/income/manifest.json" parameters="{
                        'org': '{pageState>/selectedOrg}', 
                        'scale': '{pageState>/selectedScale}'
                    }">
                        <w:layoutData><f:GridContainerItemLayoutData id="lytInc" columns="1" rows="3" /></w:layoutData>
                    </w:Card>

                    </f:items>
            </f:GridContainer>

            <VBox 
                id="trendsContainer" 
                visible="{= ${pageState>/selectedView} === 'Trends' }"
                alignItems="Center" 
                justifyContent="Center">
                <IllustratedMessage illustrationType="sapIllus-EmptyList" title="Trends Data" description="Trends reference will be added later." />
            </VBox>
        </f:content>
    </f:DynamicPage>
</mvc:View>


MANIFEST.JASON

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
        "url": "./sampleData/incomeData.json",
        "parameters": {
          "organization": "{{parameters.org}}",
          "dataScale": "{{parameters.scale}}"
        }
      }
    },
    "header": {
      "type": "Numeric",
      "title": "Income",
      "mainIndicator": {
        "number": "{/totalIncome}",
        "unit": "{{parameters.scale}}"
      }
    }
  }
}

CONTROLLER

// Dashboard.controller.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("my.app.controller.Dashboard", {
        onInit: function () {
            // Initialize the frontend state model
            var oStateModel = new JSONModel({
                selectedOrg: "CIB",      // Group, CIB, WRB
                selectedView: "Overview", // Overview, Trends
                selectedScale: "m"        // m, bn
            });
            this.getView().setModel(oStateModel, "pageState");
        },

        onToggleChange: function(oEvent) {
            // The Integration Cards will automatically detect changes to this model
            // and refresh their sample data/frontend logic accordingly.
            sap.m.MessageToast.show("Data updated for: " + 
                this.getView().getModel("pageState").getProperty("/selectedOrg"));
        }
    });
});

<mvc:View
    controllerName="my.app.controller.Dashboard"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns:f="sap.f"
    xmlns:w="sap.ui.integration.widgets"
    displayBlock="true">
    
    <f:ShellBar title="CIB | Financials Overview" />

    <f:GridContainer id="demoGrid" snapToRow="true">
        <f:layout>
            <f:GridContainerSettings rowSize="80px" columnSize="120px" gap="1rem" />
        </f:layout>
        <f:items>
            <w:Card manifest="./cards/income/manifest.json" width="300px">
                <w:layoutData>
                    <f:GridContainerItemLayoutData columns="3" rows="4" />
                </w:layoutData>
            </w:Card>

            <w:Card manifest="./cards/nii/manifest.json" width="300px">
                <w:layoutData>
                    <f:GridContainerItemLayoutData columns="3" rows="4" />
                </w:layoutData>
            </w:Card>

            <w:Card manifest="./cards/costs/manifest.json" width="300px">
                <w:layoutData>
                    <f:GridContainerItemLayoutData columns="3" rows="4" />
                </w:layoutData>
            </w:Card>
        </f:items>
    </f:GridContainer>
</mvc:View>




manifest . jason


{
  "sap.app": {
    "id": "my.app.cards.income",
    "type": "card"
  },
  "sap.card": {
    "type": "Analytical",
    "header": {
      "type": "Numeric",
      "title": "Income",
      "subTitle": "YTD Actuals",
      "unitOfMeasurement": "B",
      "mainIndicator": {
        "number": "{/mainKpi}",
        "unit": "B",
        "trend": "{/trend}",
        "state": "{/state}"
      },
      "details": "Vs Budget: {/budgetDiff}%"
    },
    "content": {
      "chartAttributes": {
        "chartType": "Line",
        "data": {
          "request": {
            "url": "/destinations/myBackend/ODataService/Financials",
            "parameters": {
              "$select": "Date,Amount",
              "$filter": "Category eq 'Income'",
              "$top": "12"
            }
          },
          "path": "/value"
        },
        "dimensions": [{
          "label": "Month",
          "value": "{Date}"
        }],
        "measures": [{
          "label": "Income",
          "value": "{Amount}"
        }]
      }
    }
  }
}


<Panel id="mainChartPanel" width="60%" class="customKpiCard sapUiSmallMarginBegin">
    <Title id="stackedTitle" text="MFU Templates by Modules" level="H3" class="sapUiSmallMarginBottom"/>
    
    <viz:VizFrame id="stackedChart" vizType="stacked_column" width="100%" height="320px" 
        uiConfig="{applicationSet:'fiori'}"
        vizProperties="{
            'plotArea': {
                'dataLabel': { 'visible': true, 'showTotal': true },
                'colorPalette': ['#2B4A8E', '#42B8D4', '#3AC582']
            },
            'title': { 'visible': false },
            'legendGroup': { 'layout': { 'position': 'top' } }
        }">
        
        <viz:dataset>
            <viz.data:FlattenedDataset id="stackDataset" data="{/StackedData}">
                <viz.data:dimensions>
                    <viz.data:DimensionDefinition id="dimModule" name="Module" value="{Module}" />
                </viz.data:dimensions>
                <viz.data:measures>
                    <viz.data:MeasureDefinition id="measApproved" name="approved" value="{approved}" />
                    <viz.data:MeasureDefinition id="measPending" name="pending" value="{pending}" />
                    <viz.data:MeasureDefinition id="measUploaded" name="uploaded" value="{uploaded}" />
                </viz.data:measures>
            </viz.data:FlattenedDataset>
        </viz:dataset>
        
        <viz:feeds>
            <viz.feeds:FeedItem id="feedValueAxis" uid="valueAxis" type="Measure" values="approved,pending,uploaded" />
            <viz.feeds:FeedItem id="feedCategoryAxis" uid="categoryAxis" type="Dimension" values="Module" />
        </viz:feeds>
        
    </viz:VizFrame>
</Panel>



bdbsbdb
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel" // 1. Import the JSONModel tool
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("project1.controller.task1", {
        
        onInit: function () {
            // 2. Build your sample frontend data matching the picture
            var oSampleData = {
                StackedData: [
                    { Module: "ESG",      Approved: 25, Pending: 5, Uploaded: 1 },
                    { Module: "FINCOST",  Approved: 2,  Pending: 2, Uploaded: 0 },
                    { Module: "ICON",     Approved: 6,  Pending: 0, Uploaded: 0 },
                    { Module: "NFRP",     Approved: 22, Pending: 2, Uploaded: 0 },
                    { Module: "TREASURY", Approved: 5,  Pending: 0, Uploaded: 1 }
                ]
            };

            // 3. Package the data into a Model
            var oModel = new JSONModel(oSampleData);

            // 4. Attach the Model to the View so the XML can read it
            this.getView().setModel(oModel);
        }
    });
});

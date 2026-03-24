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

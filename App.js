 <HBox id="dashboardTopHalf" width="100%" class="sapUiSmallMarginBottom sapUiSmallMarginBeginEnd">
                            
                            <VBox id="kpiGrid" width="40%" class="sapUiSmallMarginEnd">
                                <HBox id="kpiTopRow" width="100%" class="sapUiSmallMarginBottom">
                                    <VBox id="cardUploaded" class="customKpiCard sapUiSmallMarginEnd" width="50%">
                                        <Text id="titleUploaded" text="Total MFU Uploaded" class="kpiTitle" />
                                        <VBox id="valBoxUp"><Text id="valUploaded" text="71" class="kpiValue" /><Text id="subUploaded" text="MFU_COUNT" class="kpiSubText" /></VBox>
                                    </VBox>
                                    <VBox id="cardApproved" class="customKpiCard" width="50%">
                                        <Text id="titleApproved" text="Total MFU Approved" class="kpiTitle" />
                                        <VBox id="valBoxApp"><Text id="valApproved" text="60" class="kpiValue" /><Text id="subApproved" text="MFU_COUNT" class="kpiSubText" /></VBox>
                                    </VBox>
                                </HBox>
                                <HBox id="kpiBottomRow" width="100%">
                                    <VBox id="cardOnboarded" class="customKpiCard sapUiSmallMarginEnd" width="50%">
                                        <Text id="titleOnboarded" text="MFU Template Onboarded" class="kpiTitle" />
                                        <VBox id="valBoxOnb"><Text id="valOnboarded" text="114" class="kpiValue" /><Text id="subOnboarded" text="MFU_COUNT" class="kpiSubText" /></VBox>
                                    </VBox>
                                    <VBox id="cardRejected" class="customKpiCard" width="50%">
                                        <Text id="titleRejected" text="Total MFU Rejected" class="kpiTitle" />
                                        <VBox id="valBoxRej"><Text id="valRejected" text="-" class="kpiValue" /><Text id="subRejected" text="MFU_COUNT" class="kpiSubText" /></VBox>
                                    </VBox>
                                </HBox>
                            </VBox>
                            
                            <Panel id="mainChartPanel" width="60%" class="customKpiCard sapUiSmallMarginBegin">
                                <Title id="stackedTitle" text="MFU Templates by Modules" level="H3" class="sapUiSmallMarginBottom"/>
                                
                                <viz:VizFrame id="stackedChart" vizType="stacked_column" width="100%" height="320px" 
                                    uiConfig="{applicationSet:'fiori'}"
                                    vizProperties="{
                                        'plotArea': {
                                            'dataLabel': { 'visible': true, 'showTotal': true },
                                            'colorPalette': ['#2B4A8E', '#42B8D4', '#3AC582']
                                        },
                                        'title': { 'visible': true, 'text': 'Title of Stacked Column Chart' },
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
                        </HBox>

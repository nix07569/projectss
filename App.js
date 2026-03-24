    <VBox id="cardMonth" width="24%" class="customChartCard">
        <Text id="titleMonth" text="Top 3 MFU Templates by&#10;Usage&#10;(by Month)" class="kpiTitle sapUiSmallMarginBottom" />
        <viz:VizFrame id="chartMonth" vizType="column" width="100%" height="220px" uiConfig="{applicationSet:'fiori'}"
            vizProperties="{ title: { visible: false }, legend: { visible: false }, plotArea: { dataLabel: { visible: true }, colorPalette: ['#42B8D4'], dataPointSize: { max: 35 } } }">
            <viz:dataset>
                <viz.data:FlattenedDataset id="dsMonth" data="{/MonthData}">
                    <viz.data:dimensions><viz.data:DimensionDefinition id="dimMonth" name="Module" value="{Module}" /></viz.data:dimensions>
                    <viz.data:measures><viz.data:MeasureDefinition id="measMonth" name="Usage" value="{Usage}" /></viz.data:measures>
                </viz.data:FlattenedDataset>
            </viz:dataset>
            <viz:feeds>
                <viz.feeds:FeedItem id="feedMonthVal" uid="valueAxis" type="Measure" values="Usage" />
                <viz.feeds:FeedItem id="feedMonthCat" uid="categoryAxis" type="Dimension" values="Module" />
            </viz:feeds>
        </viz:VizFrame>
    </VBox>

    <VBox id="cardQuarter" width="24%" class="customChartCard">
        <Text id="titleQuarter" text="Top 3 MFU Templates by&#10;Usage&#10;(by Quarter)" class="kpiTitle sapUiSmallMarginBottom" />
        <viz:VizFrame id="chartQuarter" vizType="column" width="100%" height="220px" uiConfig="{applicationSet:'fiori'}"
            vizProperties="{ title: { visible: false }, legend: { visible: false }, plotArea: { dataLabel: { visible: true }, colorPalette: ['#2B4A8E'], dataPointSize: { max: 35 } } }">
            <viz:dataset>
                <viz.data:FlattenedDataset id="dsQuarter" data="{/QuarterData}">
                    <viz.data:dimensions><viz.data:DimensionDefinition id="dimQuarter" name="Module" value="{Module}" /></viz.data:dimensions>
                    <viz.data:measures><viz.data:MeasureDefinition id="measQuarter" name="Usage" value="{Usage}" /></viz.data:measures>
                </viz.data:FlattenedDataset>
            </viz:dataset>
            <viz:feeds>
                <viz.feeds:FeedItem id="feedQuarterVal" uid="valueAxis" type="Measure" values="Usage" />
                <viz.feeds:FeedItem id="feedQuarterCat" uid="categoryAxis" type="Dimension" values="Module" />
            </viz:feeds>
        </viz:VizFrame>
    </VBox>

    <VBox id="cardYear" width="24%" class="customChartCard">
        <Text id="titleYear" text="Top 3 MFU Templates by&#10;Usage&#10;(by Year)" class="kpiTitle sapUiSmallMarginBottom" />
        <viz:VizFrame id="chartYear" vizType="column" width="100%" height="220px" uiConfig="{applicationSet:'fiori'}"
            vizProperties="{ title: { visible: false }, legend: { visible: false }, plotArea: { dataLabel: { visible: true }, colorPalette: ['#3AC582'], dataPointSize: { max: 35 } } }">
            <viz:dataset>
                <viz.data:FlattenedDataset id="dsYear" data="{/YearData}">
                    <viz.data:dimensions><viz.data:DimensionDefinition id="dimYear" name="Module" value="{Module}" /></viz.data:dimensions>
                    <viz.data:measures><viz.data:MeasureDefinition id="measYear" name="Usage" value="{Usage}" /></viz.data:measures>
                </viz.data:FlattenedDataset>
            </viz:dataset>
            <viz:feeds>
                <viz.feeds:FeedItem id="feedYearVal" uid="valueAxis" type="Measure" values="Usage" />
                <viz.feeds:FeedItem id="feedYearCat" uid="categoryAxis" type="Dimension" values="Module" />
            </viz:feeds>
        </viz:VizFrame>
    </VBox>

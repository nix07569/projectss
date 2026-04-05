<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">
    <VBox class="kpiCard">
        
        <Title text="{card>/title}" class="kpiCard__headerTitle sapUiSmallMarginBottom"/>

        <VBox class="kpiCard__primarySection sapUiSmallMarginBottom">
            
            <HBox alignItems="Center" class="sapUiTinyMarginBottom">
                <Text text="{card>/primaryValue}" class="kpiCard__primaryValue sapUiTinyMarginEnd" />
                
                <HBox alignItems="Center" class="kpiCard__trendBlock">
                    <Text text="(" class="kpiCard__trendText" />
                    <core:Icon 
                        src="{= ${card>/dir1} ? 'sap-icon://arrow-top' : 'sap-icon://arrow-bottom' }" 
                        size="11px" 
                        color="{= ${card>/isNegative} ? '#bb0000' : '#2b7d2b' }"
                        class="sapUiTinyMarginBeginEnd" />
                    <ObjectStatus 
                        class="kpiCard__trendPercent" 
                        text="{card>/primaryPercent})" 
                        state="{= ${card>/isNegative} ? 'Error' : 'Success' }" />
                </HBox>
            </HBox>
            
            <HBox alignItems="Center">
                <Text text="{card>/subLabel}" class="kpiCard__subLabel sapUiTinyMarginEnd" />
                <ObjectStatus 
                    class="kpiCard__subLabelTrend" 
                    text="{card>/subLabelYOY}" 
                    state="{= ${card>/isNegative} ? 'Error' : 'Success' }" />
            </HBox>
            
        </VBox>

        <VBox class="kpiCard__secondarySection">
            
            <HBox justifyContent="SpaceBetween" alignItems="Center" class="kpiCard__row sapUiTinyMarginBottom" visible="{= ${card>/row1Label} !== undefined }">
                <Text text="{card>/row1Label}" class="kpiCard__rowLabel" />
                <Text text="{card>/row1Value}" class="kpiCard__rowValue" />
            </HBox>

            <HBox justifyContent="SpaceBetween" alignItems="Center" class="kpiCard__row sapUiTinyMarginBottom" visible="{= ${card>/row2Label} !== undefined }">
                <HBox alignItems="Center">
                    <Text text="{card>/row2Label}" class="kpiCard__rowLabel sapUiTinyMarginEnd" />
                    <ObjectStatus 
                        text="{card>/row2LabelYOY}" 
                        state="{= ${card>/row2IsNegative} ? 'Error' : 'Success' }" 
                        class="kpiCard__rowSubLabel" />
                </HBox>
                <HBox alignItems="Center">
                    <Text text="{card>/row2Value}" class="kpiCard__rowValue sapUiTinyMarginEnd" />
                    <Text text="(" class="kpiCard__trendText" />
                    <core:Icon 
                        src="{= ${card>/dir2} ? 'sap-icon://arrow-top' : 'sap-icon://arrow-bottom' }" 
                        size="9px" 
                        color="{= ${card>/row2IsNegative} ? '#bb0000' : '#2b7d2b' }"
                        class="sapUiTinyMarginBeginEnd" />
                    <ObjectStatus 
                        class="kpiCard__trendPercentSmall" 
                        text="{card>/row2Percent})" 
                        state="{= ${card>/row2IsNegative} ? 'Error' : 'Success' }" />
                </HBox>
            </HBox>

            <HBox justifyContent="SpaceBetween" alignItems="Center" class="kpiCard__row" visible="{= ${card>/row3Label} !== undefined }">
                <HBox alignItems="Center">
                    <Text text="{card>/row3Label}" class="kpiCard__rowLabel sapUiTinyMarginEnd" />
                    <ObjectStatus 
                        text="{card>/row3LabelYOY}" 
                        state="{= ${card>/row3IsNegative} ? 'Error' : 'Success' }" 
                        class="kpiCard__rowSubLabel" />
                </HBox>
                <HBox alignItems="Center">
                    <Text text="{card>/row3Value}" class="kpiCard__rowValue sapUiTinyMarginEnd" />
                    <Text text="(" class="kpiCard__trendText" />
                    <core:Icon 
                        src="{= ${card>/dir3} ? 'sap-icon://arrow-top' : 'sap-icon://arrow-bottom' }" 
                        size="9px" 
                        color="{= ${card>/row3IsNegative} ? '#bb0000' : '#2b7d2b' }"
                        class="sapUiTinyMarginBeginEnd" />
                    <ObjectStatus 
                        class="kpiCard__trendPercentSmall" 
                        text="{card>/row3Percent})" 
                        state="{= ${card>/row3IsNegative} ? 'Error' : 'Success' }" />
                </HBox>
            </HBox>
            
        </VBox>
    </VBox>
</core:FragmentDefinition>



/* =========================================
   KPI Card - Main Container
   ========================================= */
.kpiCard {
    background-color: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    padding: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

/* =========================================
   Header Section
   ========================================= */
.kpiCard__headerTitle {
    color: #333333;
    font-size: 14px;
    font-weight: 600;
}

/* =========================================
   Primary Value Section
   ========================================= */
.kpiCard__primaryValue {
    color: #333333;
    font-size: 18px; /* Increased slightly to establish visual hierarchy */
    font-weight: 700;
}

.kpiCard__trendPercent {
    font-size: 13px;
    font-weight: 600;
}

.kpiCard__subLabel {
    color: #888888;
    font-size: 11px;
    font-weight: 500;
}

.kpiCard__subLabelTrend {
    font-size: 11px;
    font-weight: 600;
}

/* =========================================
   Secondary/Row Metrics Section
   ========================================= */
.kpiCard__rowLabel {
    color: #666666;
    font-size: 11px;
    font-weight: 500;
}

.kpiCard__rowSubLabel {
    font-size: 10px;
    font-weight: 500;
}

.kpiCard__rowValue {
    color: #333333;
    font-size: 11px;
    font-weight: 700;
}

.kpiCard__trendPercentSmall {
    font-size: 11px;
    font-weight: 600;
}

/* Shared Utility for Text Symbols like "(" and ")" */
.kpiCard__trendText {
    color: #888888;
    font-size: 11px;
    font-weight: 500;
}


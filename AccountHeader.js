/* Container Spacing */
.topNavContainer {
    padding: 1rem;
    border-bottom: 1px solid #e5e5e5;
    background-color: #f7f9fa; /* Light background from screenshot */
}

/* --- Left Section Branding & Typography --- */
.brandSubtitle {
    color: #0066cc;
    font-size: 0.75rem;
    line-height: 1;
    margin-bottom: -2px;
    font-weight: 600;
}

.brandLogoBlue {
    color: #0066cc;
    font-size: 1.25rem;
    font-weight: bold;
    letter-spacing: -0.5px;
}

.brandLogoGreen {
    color: #7bc043; /* Adjusted green */
    font-size: 1.25rem;
    font-weight: bold;
    letter-spacing: -0.5px;
}

/* Icon overrides */
.customMenuBtn .sapMBtnIcon,
.customFilterBtn .sapMBtnIcon {
    color: #0066cc !important;
    font-size: 1.5rem;
}

/* Page Title Typography */
.titleLight {
    color: #666666;
    font-size: 1.75rem;
    font-weight: 300;
}

.titleSeparator {
    color: #cccccc;
    font-size: 1.75rem;
    font-weight: 300;
}

.titleBold {
    color: #333333;
    font-size: 1.75rem;
    font-weight: 700;
}

/* --- Right Section Layout & Typography --- */
.navItem {
    padding: 0 1rem;
    border-right: 1px solid transparent; /* Keeps spacing consistent */
}

.customNavText {
    color: #4a90e2; /* Softer blue for right nav items */
    font-size: 0.875rem;
}

.customNavText.boldText {
    font-weight: bold;
}

.sparklineIcon {
    color: #0066cc;
    font-size: 1.2rem;
}

/* --- Custom Segmented Button Overrides --- */
/* Flattening the buttons to make them square and solid like the screenshot */
.customToggle {
    border-radius: 2px !important;
    overflow: hidden;
}

.customToggle .sapMSegBBtn {
    border-radius: 0 !important;
    border: 1px solid #cccccc;
    background-color: #ffffff;
    color: #666666;
    text-shadow: none;
    min-width: 3.5rem;
}

/* Selected State Styling */
.customToggle .sapMSegBBtn.sapMSegBBtnSel {
    background-color: #0066cc !important;
    border-color: #0066cc !important;
    color: #ffffff !important;
}

/* Remove default focus outlines that distort the flat look */
.customToggle .sapMSegBBtnFocusable:focus {
    outline: none !important;
}



<mvc:View
    controllerName="your.namespace.controller.Main"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m"
    xmlns:core="sap.ui.core"
    displayBlock="true">
    
    <Page showHeader="false" class="sapUiContentPadding">
        <content>
            <HBox width="100%" justifyContent="SpaceBetween" alignItems="End" class="topNavContainer">
                
                <VBox class="leftNavSection">
                    
                    <HBox alignItems="End" class="logoRow sapUiSmallMarginBottom">
                        <Button icon="sap-icon://menu2" type="Transparent" class="customMenuBtn sapUiTinyMarginEnd" />
                        <VBox justifyContent="End">
                            <Text text="Aspire" class="brandSubtitle" />
                            <HBox alignItems="End">
                                <Text text="Fin" class="brandLogoBlue" />
                                <Text text="Sight." class="brandLogoGreen" />
                                <Text text="Performance" class="brandLogoBlue" />
                            </HBox>
                        </VBox>
                    </HBox>
                    
                    <HBox alignItems="Center" class="titleRow">
                        <Button icon="sap-icon://filter" type="Transparent" class="customFilterBtn sapUiTinyMarginEnd" />
                        <HBox alignItems="Center">
                            <Text text="CIB" class="titleLight" />
                            <Text text="|" class="titleSeparator sapUiTinyMarginBeginEnd" />
                            <Text id="dynamicHeading" text="Financials Overview" class="titleBold" />
                        </HBox>
                    </HBox>
                </VBox>

                <HBox alignItems="End" class="rightNavSection" wrap="Wrap">
                    
                    <VBox alignItems="Center" justifyContent="End" class="navItem sapUiMediumMarginEnd">
                        <Link text="Group" class="customNavText" />
                    </VBox>

                    <VBox alignItems="Center" class="navItem sapUiMediumMarginEnd">
                        <Text text="CIB" class="customNavText boldText sapUiTinyMarginBottom" />
                        <core:Icon src="sap-icon://business-objects-experience" class="sparklineIcon sapUiTinyMarginBottom" />
                        
                        <SegmentedButton id="scaleToggle" selectedKey="m" selectionChange=".onToggleChange" class="customToggle">
                            <items>
                                <SegmentedButtonItem text="$m" key="m" />
                                <SegmentedButtonItem text="$bn" key="bn" />
                            </items>
                        </SegmentedButton>
                    </VBox>

                    <VBox alignItems="Center" class="navItem">
                        <Text text="WRB" class="customNavText sapUiNoMargin" />
                        <Text text="Trends" class="customNavText sapUiTinyMarginBottom" />
                        
                        <SegmentedButton id="fxToggle" selectedKey="RFX" selectionChange=".onToggleChange" class="customToggle">
                            <items>
                                <SegmentedButtonItem text="RFX" key="RFX" />
                                <SegmentedButtonItem text="CFX" key="CFX" />
                            </items>
                        </SegmentedButton>
                    </VBox>
                    
                </HBox>
            </HBox>
        </content>
    </Page>
</mvc:View>

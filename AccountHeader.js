/* ========================================================= */
/* 1. SQUASH THE LIST PADDING (Bottom 3 lines)               */
/* ========================================================= */

/* Target the List Item Base (sapMLIB) to remove vertical space */
.flatTransparentCard .sapMLIB {
    min-height: 1.25rem !important; /* Overrides the default 3rem Fiori height */
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    padding-left: 0 !important; /* Aligns text perfectly to the left edge */
}

/* Remove default margins from the list container itself */
.flatTransparentCard .sapMList ul {
    margin: 0 !important;
    padding: 0 !important;
}

/* ========================================================= */
/* 2. SHRINK THE FONT SIZES                                  */
/* ========================================================= */

/* Shrink the List Text (Left-side labels like "Vs Budget") */
.flatTransparentCard .sapMSLITitle,
.flatTransparentCard .sapMText {
    font-size: 0.75rem !important;
}

/* Shrink the List Values (Right-side numbers like "4.20") */
.flatTransparentCard .sapMSLIInfo {
    font-size: 0.75rem !important;
}

/* Shrink the Card Subtitle ("YTD Actuals (YoY %)") */
.flatTransparentCard .sapFCardDetails {
    font-size: 0.7rem !important;
    margin-top: 0.2rem !important;
    margin-bottom: 0.5rem !important; /* Keeps a tiny gap before the list starts */
}

/* Shrink the Card Main Title ("Income") */
.flatTransparentCard .sapFCardTitle {
    font-size: 0.9rem !important;
}

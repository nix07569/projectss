-- ============================================================
--  INSERT ALL 12 WIDGETS INTO NEW TABLE
--  Table: T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER
--
--  Run in HANA Database Explorer.
--  Execute each INSERT one at a time, or all together.
--
--  ID  WIDGET
--  ─────────────────────────────────────
--   1  Income
--   2  Impairments
--   3  Underlying Profit
--   4  Funded Assets
--   5  RoTE
--   6  Costs
--   7  NII
--   8  First RWA
--   9  JAWS
--  10  CIR
--  11  Controllable Headcount
--  12  Second RWA
-- ============================================================

-- ── 1. Income ────────────────────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
1,
'Income',
'SELECT
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0 AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'' AND dateconfig.FILTER_DATE = ''CURRENT_MONTH'' AND dateconfig.FILTER_TYPE = ''PYR+CYR'' THEN alldata.RFX ELSE 0 END) AS YTD_ACTUALS_FPNA,

  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0 AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'' AND dateconfig.FILTER_DATE = ''CURRENT_MONTH'' AND dateconfig.FILTER_TYPE = ''PYR+CYR'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Budget'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0 AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'' AND dateconfig.FILTER_DATE = ''CURRENT_MONTH'' AND dateconfig.FILTER_TYPE = ''PYR+CYR'' THEN alldata.RFX ELSE 0 END) AS VS_BUDGET_FPNA,

  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals'' AND alldata.T_VERSION = ''QTD'' AND dateconfig.ADD17 = -1 AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'' AND dateconfig.FILTER_DATE = ''CURRENT_MONTH'' AND dateconfig.FILTER_TYPE = ''PYR+CYR'' THEN alldata.RFX ELSE 0 END) AS PQTD_ACTUALS_FPNA,

  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'' AND dateconfig.FILTER_DATE = ''CURRENT_MONTH'' AND dateconfig.FILTER_TYPE = ''PYR+CYR'' THEN alldata.RFX ELSE 0 END) AS FY_OUTLOOK_FPNA,

  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND alldata.MONTH_ABR = ''FY'' AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'' AND dateconfig.ADD19 = ''CY'' AND dateconfig.FILTER_DATE = ''CURRENT_MONTH'' AND dateconfig.FILTER_TYPE = ''PYR+CYR'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND alldata.MONTH_ABR = ''FY'' AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'' AND dateconfig.ADD19 = ''PY'' AND dateconfig.FILTER_DATE = ''CURRENT_MONTH'' AND dateconfig.FILTER_TYPE = ''PYR+CYR'' THEN alldata.RFX ELSE 0 END) AS VARIANCE_PYFY_OUTLOOK_FPNA,

  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals'' AND alldata.M_ACCOUNT_0 = ''Income'' AND dateconfig.ADD17 = -1 AND alldata.T_VERSION = ''QTD'' AND alldata.T_REPORTING = ''FPNA'' AND dateconfig.FILTER_DATE = ''CURRENT_MONTH'' AND dateconfig.FILTER_TYPE = ''PYR+CYR'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals'' AND alldata.M_ACCOUNT_0 = ''Income'' AND dateconfig.ADD17 = -5 AND alldata.T_VERSION = ''MTD'' AND alldata.T_REPORTING = ''FPNA'' AND dateconfig.FILTER_DATE = ''CURRENT_MONTH'' AND dateconfig.FILTER_TYPE = ''PYR+CYR'' THEN alldata.RFX ELSE 0 END) AS PYPQTD_ACTUALS_FPNA,

  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals'' AND alldata.M_ACCOUNT_0 = ''Income'' AND dateconfig.ADD16 = 0 AND alldata.T_VERSION = ''YTD'' AND alldata.T_REPORTING = ''FPNA'' AND dateconfig.FILTER_DATE = ''CURRENT_MONTH'' AND dateconfig.FILTER_TYPE = ''PYR+CYR'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals'' AND alldata.M_ACCOUNT_0 = ''Income'' AND dateconfig.ADD6 = ''PY_YTD'' AND alldata.T_VERSION = ''MTD'' AND alldata.T_REPORTING = ''FPNA'' AND dateconfig.FILTER_DATE = ''CURRENT_MONTH'' AND dateconfig.FILTER_TYPE = ''PYR+CYR'' THEN alldata.RFX ELSE 0 END) AS PY_YTD_ACTUALS_FPNA

FROM "T1NFRP_PHY"."CV_UP_NFRP_ALLDATA" alldata
INNER JOIN "T1NFRP_PHY"."TBL_NFRP_DATE_CONFIG" dateconfig
  ON alldata.E_PERIOD_DATE = dateconfig.E_PERIOD_DATE
WHERE
  (
    (alldata.DATA_TYPE = ''Actuals'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0 AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'')
    OR
    (alldata.DATA_TYPE = ''Budget'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0 AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'')
    OR
    (alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0 AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'' AND (alldata.DATA_TYPE = ''Actuals'' OR alldata.DATA_TYPE = ''Budget''))
    OR
    (alldata.DATA_TYPE = ''Actuals'' AND alldata.T_VERSION = ''QTD'' AND dateconfig.ADD17 = -1 AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'')
    OR
    (alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'')
    OR
    (alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND alldata.MONTH_ABR = ''FY'' AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'' AND (dateconfig.ADD19 = ''CY'' OR dateconfig.ADD19 = ''PY''))
    OR
    (alldata.DATA_TYPE = ''Actuals'' AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'' AND ((dateconfig.ADD17 = -1 AND alldata.T_VERSION = ''QTD'') OR (dateconfig.ADD17 = -5 AND alldata.T_VERSION = ''MTD'')))
    OR
    (alldata.DATA_TYPE = ''Actuals'' AND alldata.M_ACCOUNT_0 = ''Income'' AND alldata.T_REPORTING = ''FPNA'' AND ((dateconfig.ADD16 = 0 AND alldata.T_VERSION = ''YTD'') OR (dateconfig.ADD6 = ''PY_YTD'' AND alldata.T_VERSION = ''MTD'')))
  )
  AND dateconfig.FILTER_DATE = ''CURRENT_MONTH''
  AND dateconfig.FILTER_TYPE = ''PYR+CYR'''
);

-- ── 2. Impairments ───────────────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
2,
'Impairments',
'WITH
IMPAIRMENTS_CART AS (
    SELECT
        A.DATA_TYPE,
        A.T_VERSION,
        A.MONTH_ABR,
        A.CFX,
        A.RFX,
        D.ADD16,
        D.ADD17,
        D.ADD18
    FROM "T1NFRP_PHY"."CV_UP_NFRP_ALLDATA"          A
    CROSS JOIN "T1NFRP_PHY"."TBL_NFRP_DATE_CONFIG"  D
    WHERE A.M_ACCOUNT_0 = ''Impairments''
    AND   A.T_REPORTING = ''CIB''
    AND   D.FILTER_DATE = ''CURRENT_MONTH''
    AND   D.FILTER_TYPE = ''PYR+CYR''
),

IMPAIRMENTS_DATE AS (
    SELECT
        A.DATA_TYPE,
        A.T_VERSION,
        A.MONTH_ABR,
        A.CFX,
        A.RFX,
        D.ADD6,
        D.ADD16,
        D.ADD18
    FROM "T1NFRP_PHY"."CV_UP_NFRP_ALLDATA"         A
    JOIN "T1NFRP_PHY"."TBL_NFRP_DATE_CONFIG"       D
        ON A.E_PERIOD_DATE = D.E_PERIOD_DATE
    WHERE A.M_ACCOUNT_0 = ''Impairments''
    AND   A.T_REPORTING = ''CIB''
    AND   D.FILTER_DATE = ''CURRENT_MONTH''
    AND   D.FILTER_TYPE = ''PYR+CYR''
),

YTD_ACTUALS AS (
    SELECT
        SUM(CFX) AS YTD_ACTUALS_CFX,
        SUM(RFX) AS YTD_ACTUALS_RFX
    FROM IMPAIRMENTS_CART
    WHERE DATA_TYPE = ''Actuals''
    AND   T_VERSION = ''YTD''
    AND   ADD16     = 0
),

VS_BUDGET AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' THEN CFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Budget''  THEN CFX ELSE 0 END) AS VS_BUDGET_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' THEN RFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Budget''  THEN RFX ELSE 0 END) AS VS_BUDGET_RFX
    FROM IMPAIRMENTS_CART
    WHERE DATA_TYPE IN (''Actuals'',''Budget'')
    AND   T_VERSION  = ''YTD''
    AND   ADD16      = 0
),

CY_PQ_ACTUALS AS (
    SELECT
        SUM(CFX) AS CY_PQ_ACTUALS_CFX,
        SUM(RFX) AS CY_PQ_ACTUALS_RFX
    FROM IMPAIRMENTS_CART
    WHERE DATA_TYPE = ''Actuals''
    AND   T_VERSION = ''QTD''
    AND   ADD17     = -1
),

FY_OUTLOOK AS (
    SELECT
        SUM(CFX) AS FY_OUTLOOK_CFX,
        SUM(RFX) AS FY_OUTLOOK_RFX
    FROM IMPAIRMENTS_CART
    WHERE DATA_TYPE = ''Outlook_PM''
    AND   T_VERSION = ''YTD''
    AND   ADD18     = 0
    AND   ADD16     = 0
),

PY_PQ_VARIANCE AS (
    SELECT
        SUM(CASE WHEN ADD17 = -1 THEN CFX ELSE 0 END) -
        SUM(CASE WHEN ADD17 = -5 THEN CFX ELSE 0 END) AS PY_PQ_VARIANCE_CFX,
        SUM(CASE WHEN ADD17 = -1 THEN RFX ELSE 0 END) -
        SUM(CASE WHEN ADD17 = -5 THEN RFX ELSE 0 END) AS PY_PQ_VARIANCE_RFX
    FROM IMPAIRMENTS_CART
    WHERE DATA_TYPE = ''Actuals''
    AND   T_VERSION = ''QTD''
    AND   ADD17     IN (-1, -5)
),

YTD_ACTUAL_PY AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0        THEN CFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''MTD'' AND ADD6  = ''PY_YTD'' THEN CFX ELSE 0 END) AS YTD_ACTUAL_PY_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0        THEN RFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''MTD'' AND ADD6  = ''PY_YTD'' THEN RFX ELSE 0 END) AS YTD_ACTUAL_PY_RFX
    FROM IMPAIRMENTS_DATE
    WHERE DATA_TYPE = ''Actuals''
),

FY_VS_YTD_ACTUAL_PY AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD'' AND ADD18 = 0 AND ADD16 = 0 THEN CFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals''    AND T_VERSION = ''MTD'' AND ADD6 = ''PY_YTD''         THEN CFX ELSE 0 END) AS FY_VS_YTD_ACTUAL_PY_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD'' AND ADD18 = 0 AND ADD16 = 0 THEN RFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals''    AND T_VERSION = ''MTD'' AND ADD6 = ''PY_YTD''         THEN RFX ELSE 0 END) AS FY_VS_YTD_ACTUAL_PY_RFX
    FROM IMPAIRMENTS_DATE
    WHERE DATA_TYPE IN (''Outlook_PM'',''Actuals'')
)

SELECT
    Y.YTD_ACTUALS_CFX,
    Y.YTD_ACTUALS_RFX,
    B.VS_BUDGET_CFX,
    B.VS_BUDGET_RFX,
    C.CY_PQ_ACTUALS_CFX,
    C.CY_PQ_ACTUALS_RFX,
    F.FY_OUTLOOK_CFX,
    F.FY_OUTLOOK_RFX,
    P.PY_PQ_VARIANCE_CFX,
    P.PY_PQ_VARIANCE_RFX,
    V.YTD_ACTUAL_PY_CFX,
    V.YTD_ACTUAL_PY_RFX,
    O.FY_VS_YTD_ACTUAL_PY_CFX,
    O.FY_VS_YTD_ACTUAL_PY_RFX
FROM            YTD_ACTUALS         Y
CROSS JOIN      VS_BUDGET           B
CROSS JOIN      CY_PQ_ACTUALS       C
CROSS JOIN      FY_OUTLOOK          F
CROSS JOIN      PY_PQ_VARIANCE      P
CROSS JOIN      YTD_ACTUAL_PY       V
CROSS JOIN      FY_VS_YTD_ACTUAL_PY O'
);

-- ── 3. Underlying Profit ─────────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
3,
'Underlying Profit',
'WITH
UNDERLYING_PROFIT_BASE AS (
    SELECT
        A.DATA_TYPE,
        A.T_VERSION,
        A.MONTH_ABR,
        A.CFX,
        A.RFX,
        D.ADD6,
        D.ADD16,
        D.ADD17,
        D.ADD18
    FROM "T1NFRP_PHY"."CV_UP_NFRP_ALLDATA"  A
    JOIN "T1NFRP_PHY"."TBL_NFRP_DATE_CONFIG" D ON A.E_PERIOD_DATE = D.E_PERIOD_DATE
    WHERE A.M_ACCOUNT_0 = ''Operating Profit''
    AND   A.T_REPORTING = ''CIB''
    AND   D.FILTER_DATE = ''CURRENT_MONTH''
    AND   D.FILTER_TYPE = ''PYR+CYR''
),
YTD_ACTUALS AS (
    SELECT SUM(CFX) AS YTD_ACTUALS_CFX, SUM(RFX) AS YTD_ACTUALS_RFX
    FROM UNDERLYING_PROFIT_BASE
    WHERE DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0
),
VS_BUDGET AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN CFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Budget''  AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN CFX ELSE 0 END) AS VS_BUDGET_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN RFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Budget''  AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN RFX ELSE 0 END) AS VS_BUDGET_RFX
    FROM UNDERLYING_PROFIT_BASE
    WHERE DATA_TYPE IN (''Actuals'',''Budget'') AND T_VERSION = ''YTD''
),
CY_PQ_ACTUALS AS (
    SELECT SUM(CFX) AS CY_PQ_ACTUALS_CFX, SUM(RFX) AS CY_PQ_ACTUALS_RFX
    FROM UNDERLYING_PROFIT_BASE
    WHERE DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -1
),
FY_OUTLOOK AS (
    SELECT SUM(CFX) AS FY_OUTLOOK_CFX, SUM(RFX) AS FY_OUTLOOK_RFX
    FROM UNDERLYING_PROFIT_BASE
    WHERE DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD'' AND MONTH_ABR = ''FY'' AND ADD18 = -1
),
PY_PQ_VARIANCE AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -1 THEN CFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -5 THEN CFX ELSE 0 END) AS PY_PQ_VARIANCE_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -1 THEN RFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -5 THEN RFX ELSE 0 END) AS PY_PQ_VARIANCE_RFX
    FROM UNDERLYING_PROFIT_BASE
    WHERE DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 IN (-1,-5)
),
YTD_ACTUAL_PY AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0       THEN CFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''MTD'' AND ADD6 = ''PY_YTD'' THEN CFX ELSE 0 END) AS YTD_ACTUAL_PY_VARIANCE_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0       THEN RFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''MTD'' AND ADD6 = ''PY_YTD'' THEN RFX ELSE 0 END) AS YTD_ACTUAL_PY_VARIANCE_RFX
    FROM UNDERLYING_PROFIT_BASE WHERE DATA_TYPE = ''Actuals''
),
FY_VS_YTD_ACTUAL_PY AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD'' AND MONTH_ABR = ''FY'' AND ADD18 = -1    THEN CFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals''    AND T_VERSION = ''MTD'' AND ADD6 = ''PY_YTD''                   THEN CFX ELSE 0 END) AS FY_OUTLOOK_VS_YTD_ACTUAL_PY_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD'' AND MONTH_ABR = ''FY'' AND ADD18 = -1    THEN RFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals''    AND T_VERSION = ''MTD'' AND ADD6 = ''PY_YTD''                   THEN RFX ELSE 0 END) AS FY_OUTLOOK_VS_YTD_ACTUAL_PY_RFX
    FROM UNDERLYING_PROFIT_BASE WHERE DATA_TYPE IN (''Outlook_PM'',''Actuals'')
)
SELECT
    Y.YTD_ACTUALS_CFX, Y.YTD_ACTUALS_RFX,
    B.VS_BUDGET_CFX,   B.VS_BUDGET_RFX,
    C.CY_PQ_ACTUALS_CFX, C.CY_PQ_ACTUALS_RFX,
    F.FY_OUTLOOK_CFX,  F.FY_OUTLOOK_RFX,
    P.PY_PQ_VARIANCE_CFX, P.PY_PQ_VARIANCE_RFX,
    V.YTD_ACTUAL_PY_VARIANCE_CFX, V.YTD_ACTUAL_PY_VARIANCE_RFX,
    O.FY_OUTLOOK_VS_YTD_ACTUAL_PY_CFX, O.FY_OUTLOOK_VS_YTD_ACTUAL_PY_RFX
FROM YTD_ACTUALS Y CROSS JOIN VS_BUDGET B CROSS JOIN CY_PQ_ACTUALS C
CROSS JOIN FY_OUTLOOK F CROSS JOIN PY_PQ_VARIANCE P
CROSS JOIN YTD_ACTUAL_PY V CROSS JOIN FY_VS_YTD_ACTUAL_PY O'
);

-- ── 4. Funded Assets ─────────────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
4,
'Funded Assets',
'WITH
FUNDED_ASSETS_BASE AS (
    SELECT
        A.DATA_TYPE,
        A.T_VERSION,
        A.MONTH_ABR,
        A.CFX,
        A.RFX,
        D.ADD6,
        D.ADD16,
        D.ADD17,
        D.ADD18
    FROM "T1NFRP_PHY"."CV_UP_NFRP_ALLDATA"  A
    JOIN "T1NFRP_PHY"."TBL_NFRP_DATE_CONFIG" D ON A.E_PERIOD_DATE = D.E_PERIOD_DATE
    WHERE A.M_ACCOUNT_1 = ''Funded Assets''
    AND   A.T_REPORTING = ''CIB''
    AND   D.FILTER_DATE = ''CURRENT_MONTH''
    AND   D.FILTER_TYPE = ''PYR+CYR''
),
YTD_ACTUALS AS (
    SELECT SUM(CFX) AS YTD_ACTUALS_CFX, SUM(RFX) AS YTD_ACTUALS_RFX
    FROM FUNDED_ASSETS_BASE
    WHERE DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0
),
VS_BUDGET AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN CFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Budget''  AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN CFX ELSE 0 END) AS VS_BUDGET_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN RFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Budget''  AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN RFX ELSE 0 END) AS VS_BUDGET_RFX
    FROM FUNDED_ASSETS_BASE
    WHERE DATA_TYPE IN (''Actuals'',''Budget'') AND T_VERSION = ''YTD''
),
CY_PQ_ACTUALS AS (
    SELECT SUM(CFX) AS CY_PQ_ACTUALS_CFX, SUM(RFX) AS CY_PQ_ACTUALS_RFX
    FROM FUNDED_ASSETS_BASE
    WHERE DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -1
),
FY_OUTLOOK AS (
    SELECT SUM(CFX) AS FY_OUTLOOK_CFX, SUM(RFX) AS FY_OUTLOOK_RFX
    FROM FUNDED_ASSETS_BASE
    WHERE DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD'' AND ADD18 = 0 AND ADD16 = 0
),
PY_PQ_VARIANCE AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -1 THEN CFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -5 THEN CFX ELSE 0 END) AS PY_PQ_VARIANCE_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -1 THEN RFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -5 THEN RFX ELSE 0 END) AS PY_PQ_VARIANCE_RFX
    FROM FUNDED_ASSETS_BASE
    WHERE DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 IN (-1,-5)
),
YTD_ACTUAL_PY AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0       THEN CFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''MTD'' AND ADD6 = ''PY_YTD'' THEN CFX ELSE 0 END) AS YTD_ACTUAL_PY_VARIANCE_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0       THEN RFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''MTD'' AND ADD6 = ''PY_YTD'' THEN RFX ELSE 0 END) AS YTD_ACTUAL_PY_VARIANCE_RFX
    FROM FUNDED_ASSETS_BASE WHERE DATA_TYPE = ''Actuals''
),
FY_VS_YTD_ACTUAL_PY AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD'' AND ADD18 = 0 AND ADD16 = 0 THEN CFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals''    AND T_VERSION = ''MTD'' AND ADD6 = ''PY_YTD''       THEN CFX ELSE 0 END) AS FY_VS_YTD_ACTUAL_PY_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD'' AND ADD18 = 0 AND ADD16 = 0 THEN RFX ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals''    AND T_VERSION = ''MTD'' AND ADD6 = ''PY_YTD''       THEN RFX ELSE 0 END) AS FY_VS_YTD_ACTUAL_PY_RFX
    FROM FUNDED_ASSETS_BASE WHERE DATA_TYPE IN (''Outlook_PM'',''Actuals'')
)
SELECT
    Y.YTD_ACTUALS_CFX, Y.YTD_ACTUALS_RFX,
    B.VS_BUDGET_CFX,   B.VS_BUDGET_RFX,
    C.CY_PQ_ACTUALS_CFX, C.CY_PQ_ACTUALS_RFX,
    F.FY_OUTLOOK_CFX,  F.FY_OUTLOOK_RFX,
    P.PY_PQ_VARIANCE_CFX, P.PY_PQ_VARIANCE_RFX,
    V.YTD_ACTUAL_PY_VARIANCE_CFX, V.YTD_ACTUAL_PY_VARIANCE_RFX,
    O.FY_VS_YTD_ACTUAL_PY_CFX, O.FY_VS_YTD_ACTUAL_PY_RFX
FROM YTD_ACTUALS Y CROSS JOIN VS_BUDGET B CROSS JOIN CY_PQ_ACTUALS C
CROSS JOIN FY_OUTLOOK F CROSS JOIN PY_PQ_VARIANCE P
CROSS JOIN YTD_ACTUAL_PY V CROSS JOIN FY_VS_YTD_ACTUAL_PY O'
);

-- ── 5. RoTE ──────────────────────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
5,
'RoTE',
'WITH
ROTE_BASE AS (
    SELECT
        A.DATA_TYPE,
        A.T_VERSION,
        A.MONTH_ABR,
        A.CFX_N,
        A.RFX_N,
        D.ADD9,
        D.ADD16,
        D.ADD17,
        D.ADD18,
        D.ADD19
    FROM "T1NFRP_PHY"."CV_UP_NFRP_ALLRATIOS"  A
    JOIN "T1NFRP_PHY"."TBL_NFRP_DATE_CONFIG"   D ON A.E_PERIOD_DATE = D.E_PERIOD_DATE
    WHERE A.M_ACCOUNT_5 = ''RoTE %''
    AND   A.T_REPORTING = ''CIB''
    AND   D.FILTER_DATE = ''CURRENT_MONTH''
    AND   D.FILTER_TYPE = ''PYR+CYR''
),
YTD_ACTUALS AS (
    SELECT SUM(CFX_N) AS YTD_ACTUALS_CFX, SUM(RFX_N) AS YTD_ACTUALS_RFX
    FROM ROTE_BASE
    WHERE DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0
),
VS_BUDGET AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN CFX_N ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Budget''  AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN CFX_N ELSE 0 END) AS VS_BUDGET_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN RFX_N ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Budget''  AND T_VERSION = ''YTD'' AND ADD16 = 0 THEN RFX_N ELSE 0 END) AS VS_BUDGET_RFX
    FROM ROTE_BASE
    WHERE DATA_TYPE IN (''Actuals'',''Budget'') AND T_VERSION = ''YTD''
),
PQTR_ACTUALS AS (
    SELECT SUM(CFX_N) AS PQTR_ACTUALS_CFX, SUM(RFX_N) AS PQTR_ACTUALS_RFX
    FROM ROTE_BASE
    WHERE DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -1
),
FY_OUTLOOK AS (
    SELECT SUM(CFX_N) AS FY_OUTLOOK_CFX, SUM(RFX_N) AS FY_OUTLOOK_RFX
    FROM ROTE_BASE
    WHERE DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD'' AND MONTH_ABR = ''FY'' AND ADD18 = -1
),
FY_ACTPY AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD'' AND MONTH_ABR = ''FY'' AND ADD18 = -1   THEN CFX_N ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals''    AND T_VERSION = ''YTD'' AND MONTH_ABR = ''FY'' AND ADD19 = ''PY'' THEN CFX_N ELSE 0 END) AS FY_ACTPY_VARIANCE_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD'' AND MONTH_ABR = ''FY'' AND ADD18 = -1   THEN RFX_N ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals''    AND T_VERSION = ''YTD'' AND MONTH_ABR = ''FY'' AND ADD19 = ''PY'' THEN RFX_N ELSE 0 END) AS FY_ACTPY_VARIANCE_RFX
    FROM ROTE_BASE
    WHERE DATA_TYPE IN (''Outlook_PM'',''Actuals'') AND T_VERSION = ''YTD''
),
PY_PQTR_ACTUALS AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -1 THEN CFX_N ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -5 THEN CFX_N ELSE 0 END) AS PY_PQTR_VARIANCE_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -1 THEN RFX_N ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 = -5 THEN RFX_N ELSE 0 END) AS PY_PQTR_VARIANCE_RFX
    FROM ROTE_BASE
    WHERE DATA_TYPE = ''Actuals'' AND T_VERSION = ''QTD'' AND ADD17 IN (-1,-5)
),
PYYTD_ACTUALS AS (
    SELECT
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0          THEN CFX_N ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD9 = ''2025_M01'' THEN CFX_N ELSE 0 END) AS PYYTD_VARIANCE_CFX,
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD16 = 0          THEN RFX_N ELSE 0 END) -
        SUM(CASE WHEN DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND ADD9 = ''2025_M01'' THEN RFX_N ELSE 0 END) AS PYYTD_VARIANCE_RFX
    FROM ROTE_BASE
    WHERE DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD''
)
SELECT
    Y.YTD_ACTUALS_CFX, Y.YTD_ACTUALS_RFX,
    B.VS_BUDGET_CFX,   B.VS_BUDGET_RFX,
    C.PQTR_ACTUALS_CFX, C.PQTR_ACTUALS_RFX,
    F.FY_OUTLOOK_CFX,  F.FY_OUTLOOK_RFX,
    A.FY_ACTPY_VARIANCE_CFX, A.FY_ACTPY_VARIANCE_RFX,
    P.PY_PQTR_VARIANCE_CFX, P.PY_PQTR_VARIANCE_RFX,
    V.PYYTD_VARIANCE_CFX, V.PYYTD_VARIANCE_RFX
FROM YTD_ACTUALS Y CROSS JOIN VS_BUDGET B CROSS JOIN PQTR_ACTUALS C
CROSS JOIN FY_OUTLOOK F CROSS JOIN FY_ACTPY A CROSS JOIN PY_PQTR_ACTUALS P
CROSS JOIN PYYTD_ACTUALS V'
);

-- ── 6. Costs ─────────────────────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
6,
'Costs',
'SELECT
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.RFX ELSE 0 END) AS YTD_ACTUALS_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.CFX ELSE 0 END) AS YTD_ACTUALS_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Budget''   AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.RFX ELSE 0 END) AS VS_BUDGET_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Budget''   AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.CFX ELSE 0 END) AS VS_BUDGET_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''QTD'' AND dateconfig.ADD17 = -1 THEN alldata.RFX ELSE 0 END) AS CY_PQ_ACTUALS_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''QTD'' AND dateconfig.ADD17 = -1 THEN alldata.CFX ELSE 0 END) AS CY_PQ_ACTUALS_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.RFX ELSE 0 END) AS FY_OUTLOOK_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.CFX ELSE 0 END) AS FY_OUTLOOK_CFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD17 = -1 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD17 = -5 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END) AS PY_PQ_ACTUALS_RFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD17 = -1 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD17 = -5 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END) AS PY_PQ_ACTUALS_CFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD16 = 0 AND alldata.T_VERSION = ''YTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD6 = ''PY_YTD'' AND alldata.T_VERSION = ''MTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END) AS YTD_ACTUAL_PY_RFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD16 = 0 AND alldata.T_VERSION = ''YTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD6 = ''PY_YTD'' AND alldata.T_VERSION = ''MTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END) AS YTD_ACTUAL_PY_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''  AND alldata.T_VERSION = ''MTD'' AND dateconfig.ADD6 = ''PY_YTD'' THEN alldata.RFX ELSE 0 END) AS YTD_ACTUAL_PY2_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''  AND alldata.T_VERSION = ''MTD'' AND dateconfig.ADD6 = ''PY_YTD'' THEN alldata.CFX ELSE 0 END) AS YTD_ACTUAL_PY2_CFX_FPNA
FROM "T1NFRP_PHY"."CV_UP_NFRP_ALLDATA" alldata
INNER JOIN "T1NFRP_PHY"."TBL_NFRP_DATE_CONFIG" dateconfig
  ON alldata.E_PERIOD_DATE = dateconfig.E_PERIOD_DATE
WHERE alldata.T_REPORTING = ''FPNA''
  AND alldata.M_ACCOUNT_0 = ''Total Cost''
  AND dateconfig.FILTER_DATE = ''CURRENT_MONTH''
  AND dateconfig.FILTER_TYPE = ''PYR+CYR''
  AND (
    (alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0)
    OR (alldata.DATA_TYPE = ''Budget''  AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0)
    OR (alldata.DATA_TYPE = ''Actuals'' AND alldata.T_VERSION = ''QTD'' AND dateconfig.ADD17 = -1)
    OR (alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'')
    OR (dateconfig.ADD17 = -5 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'')
    OR (dateconfig.ADD6 = ''PY_YTD'' AND alldata.T_VERSION = ''MTD'' AND alldata.DATA_TYPE = ''Actuals'')
    OR (alldata.DATA_TYPE = ''Actuals'' AND alldata.T_VERSION = ''MTD'' AND dateconfig.ADD6 = ''PY_YTD'')
  )'
);

-- ── 7. NII ───────────────────────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
7,
'NII',
'SELECT
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.RFX ELSE 0 END) AS YTD_ACTUALS_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.CFX ELSE 0 END) AS YTD_ACTUALS_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Budget''   AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.RFX ELSE 0 END) AS VS_BUDGET_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Budget''   AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.CFX ELSE 0 END) AS VS_BUDGET_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''QTD'' AND dateconfig.ADD17 = -1 THEN alldata.RFX ELSE 0 END) AS PQTD_ACTUALS_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''QTD'' AND dateconfig.ADD17 = -1 THEN alldata.CFX ELSE 0 END) AS PQTD_ACTUALS_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.RFX ELSE 0 END) AS FY_OUTLOOK_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.CFX ELSE 0 END) AS FY_OUTLOOK_CFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD16 = 0 AND alldata.T_VERSION = ''YTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD6 = ''PY_YTD'' AND alldata.T_VERSION = ''MTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END) AS VARIANCE_YTD_ACTUAL_PY_RFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD16 = 0 AND alldata.T_VERSION = ''YTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD6 = ''PY_YTD'' AND alldata.T_VERSION = ''MTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END) AS VARIANCE_YTD_ACTUAL_PY_CFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD17 = -1 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD17 = -5 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END) AS PY_PQ_ACTUALS_RFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD17 = -1 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD17 = -5 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END) AS PY_PQ_ACTUALS_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''  AND alldata.T_VERSION = ''MTD'' AND dateconfig.ADD6 = ''PY_YTD'' THEN alldata.RFX ELSE 0 END) AS PY_YTD_ACTUALS_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''  AND alldata.T_VERSION = ''MTD'' AND dateconfig.ADD6 = ''PY_YTD'' THEN alldata.CFX ELSE 0 END) AS PY_YTD_ACTUALS_CFX_FPNA
FROM "T1NFRP_PHY"."CV_UP_NFRP_ALLDATA" alldata
INNER JOIN "T1NFRP_PHY"."TBL_NFRP_DATE_CONFIG" dateconfig
  ON alldata.E_PERIOD_DATE = dateconfig.E_PERIOD_DATE
WHERE alldata.T_REPORTING = ''FPNA''
  AND alldata.M_ACCOUNT_0 = ''Income''
  AND alldata.M_ACCOUNT_1 = ''Net Interest Income''
  AND dateconfig.FILTER_DATE = ''CURRENT_MONTH''
  AND dateconfig.FILTER_TYPE = ''PYR+CYR''
  AND (
    (alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0)
    OR (alldata.DATA_TYPE = ''Budget''  AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0)
    OR (alldata.DATA_TYPE = ''Actuals'' AND alldata.T_VERSION = ''QTD'' AND dateconfig.ADD17 = -1)
    OR (alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'')
    OR (dateconfig.ADD6 = ''PY_YTD'' AND alldata.T_VERSION = ''MTD'' AND alldata.DATA_TYPE = ''Actuals'')
    OR (dateconfig.ADD17 = -5 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'')
    OR (alldata.DATA_TYPE = ''Actuals'' AND alldata.T_VERSION = ''MTD'' AND dateconfig.ADD6 = ''PY_YTD'')
  )'
);

-- ── 8. First RWA ─────────────────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
8,
'First RWA',
'SELECT
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.RFX ELSE 0 END) AS YTD_ACTUALS_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.CFX ELSE 0 END) AS YTD_ACTUALS_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Budget''   AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.RFX ELSE 0 END) AS VS_BUDGET_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Budget''   AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0  THEN alldata.CFX ELSE 0 END) AS VS_BUDGET_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''QTD'' AND dateconfig.ADD17 = -1 THEN alldata.RFX ELSE 0 END) AS CY_PQ_ACTUALS_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''QTD'' AND dateconfig.ADD17 = -1 THEN alldata.CFX ELSE 0 END) AS CY_PQ_ACTUALS_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.RFX ELSE 0 END) AS FY_OUTLOOK_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.CFX ELSE 0 END) AS FY_OUTLOOK_CFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD17 = -1 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD17 = -5 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END) AS PY_PQ_ACTUALS_RFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD17 = -1 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD17 = -5 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END) AS PY_PQ_ACTUALS_CFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD16 = 0 AND alldata.T_VERSION = ''YTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD6 = ''PY_YTD'' AND alldata.T_VERSION = ''MTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.RFX ELSE 0 END) AS YTD_ACTUAL_PY_RFX_FPNA,
  SUM(CASE WHEN dateconfig.ADD16 = 0 AND alldata.T_VERSION = ''YTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN dateconfig.ADD6 = ''PY_YTD'' AND alldata.T_VERSION = ''MTD'' AND alldata.DATA_TYPE = ''Actuals'' THEN alldata.CFX ELSE 0 END) AS YTD_ACTUAL_PY_CFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.RFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''  AND alldata.T_VERSION = ''MTD'' AND dateconfig.ADD6 = ''PY_YTD'' THEN alldata.RFX ELSE 0 END) AS YTD_ACTUAL_PY2_RFX_FPNA,
  SUM(CASE WHEN alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'' THEN alldata.CFX ELSE 0 END)
  - SUM(CASE WHEN alldata.DATA_TYPE = ''Actuals''  AND alldata.T_VERSION = ''MTD'' AND dateconfig.ADD6 = ''PY_YTD'' THEN alldata.CFX ELSE 0 END) AS YTD_ACTUAL_PY2_CFX_FPNA
FROM "T1NFRP_PHY"."CV_UP_NFRP_ALLDATA" alldata
INNER JOIN "T1NFRP_PHY"."TBL_NFRP_DATE_CONFIG" dateconfig
  ON alldata.E_PERIOD_DATE = dateconfig.E_PERIOD_DATE
WHERE alldata.T_REPORTING = ''FPNA''
  AND alldata.M_ACCOUNT_1 = ''Funded Liabilities''
  AND dateconfig.FILTER_DATE = ''CURRENT_MONTH''
  AND dateconfig.FILTER_TYPE = ''PYR+CYR''
  AND (
    (alldata.DATA_TYPE = ''Actuals''    AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0)
    OR (alldata.DATA_TYPE = ''Budget''  AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD16 = 0)
    OR (alldata.DATA_TYPE = ''Actuals'' AND alldata.T_VERSION = ''QTD'' AND dateconfig.ADD17 = -1)
    OR (alldata.DATA_TYPE = ''Outlook_PM'' AND alldata.T_VERSION = ''YTD'' AND dateconfig.ADD19 = ''CY'' AND alldata.MONTH_ABR = ''FY'')
    OR (dateconfig.ADD17 = -5 AND alldata.T_VERSION = ''QTD'' AND alldata.DATA_TYPE = ''Actuals'')
    OR (dateconfig.ADD6 = ''PY_YTD'' AND alldata.T_VERSION = ''MTD'' AND alldata.DATA_TYPE = ''Actuals'')
    OR (alldata.DATA_TYPE = ''Actuals'' AND alldata.T_VERSION = ''MTD'' AND dateconfig.ADD6 = ''PY_YTD'')
  )'
);

-- ── 9. JAWS ──────────────────────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
9,
'JAWS',
'WITH DATA_ANCHOR AS (
    SELECT MAX(A.E_PERIOD_DATE) AS ACTUALS_YTD_DATE
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLDATA" A
    WHERE A.M_ACCOUNT_5 = ''Software''
    AND   A.T_REPORTING = ''FPNA''
    AND   A.DATA_TYPE   = ''Actuals''
    AND   A.T_VERSION   = ''YTD''
    AND   A.CFX        != 0
    AND EXISTS (
        SELECT 1 FROM T1NFRP_PHY."TBL_NFRP_DATE_CONFIG" D
        WHERE D.FILTER_DATE = TO_VARCHAR(A.E_PERIOD_DATE, ''YYYY-MM-DD'')
    )
),
PERIODS AS (
    SELECT
        MAX(CASE WHEN D.ADD16 = ''0''                         THEN D.E_PERIOD_DATE END) AS CURRENT_YTD_PERIOD,
        MAX(CASE WHEN D.ADD16 = ''-12''                       THEN D.E_PERIOD_DATE END) AS PYYTD_PERIOD,
        MAX(CASE WHEN D.ADD17 = ''-1'' AND D.ADD19 = ''CY''   THEN D.E_PERIOD_DATE END) AS PREV_QTR_PERIOD,
        MAX(CASE WHEN D.ADD17 = ''-5'' AND D.ADD19 = ''PY''   THEN D.E_PERIOD_DATE END) AS PYPQTR_PERIOD
    FROM T1NFRP_PHY."TBL_NFRP_DATE_CONFIG" D
    CROSS JOIN DATA_ANCHOR A
    WHERE D.FILTER_DATE = TO_VARCHAR(A.ACTUALS_YTD_DATE, ''YYYY-MM-DD'')
),
FY_ANCHOR AS (
    SELECT MAX(E_PERIOD_DATE) AS FY_ACTPY_PERIOD
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLDATA"
    WHERE M_ACCOUNT_5 = ''Software'' AND T_REPORTING = ''FPNA''
    AND   DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND MONTH_ABR = ''FY''
),
FY_OUTLOOK_ANCHOR AS (
    SELECT MAX(E_PERIOD_DATE) AS FY_OUTLOOK_PERIOD
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLDATA"
    WHERE M_ACCOUNT_5 = ''Software'' AND E_BOOKS = ''NEWF - OL''
    AND   T_REPORTING = ''FPNA'' AND DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD''
),
PERIOD_SET AS (
    SELECT P.CURRENT_YTD_PERIOD, P.PYYTD_PERIOD, P.PREV_QTR_PERIOD, P.PYPQTR_PERIOD,
           FA.FY_ACTPY_PERIOD, OA.FY_OUTLOOK_PERIOD
    FROM PERIODS P CROSS JOIN FY_ANCHOR FA CROSS JOIN FY_OUTLOOK_ANCHOR OA
),
ALL_MEASURES AS (
    SELECT
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''   AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.CFX ELSE 0 END) AS YTD_ACTUALS_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Budget''    AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.CFX ELSE 0 END) AS RBUDYTD_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''   AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.PREV_QTR_PERIOD    THEN A.CFX ELSE 0 END) AS PQTR_ACTUALS_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Outlook_PM'' AND A.T_VERSION=''YTD'' AND A.E_BOOKS=''NEWF - OL'' AND A.E_PERIOD_DATE=PS.FY_OUTLOOK_PERIOD THEN A.CFX ELSE 0 END) AS FY_OUTLOOK_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''   AND A.T_VERSION=''YTD'' AND A.MONTH_ABR=''FY'' AND A.E_PERIOD_DATE=PS.FY_ACTPY_PERIOD   THEN A.CFX ELSE 0 END) AS FY_ACTPY_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''   AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.PYYTD_PERIOD       THEN A.CFX ELSE 0 END) AS PYYTD_ACTUALS_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''   AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.PYPQTR_PERIOD      THEN A.CFX ELSE 0 END) AS PYPQTR_ACTUALS_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''   AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.RFX ELSE 0 END) AS YTD_ACTUALS_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Budget''    AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.RFX ELSE 0 END) AS RBUDYTD_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''   AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.PREV_QTR_PERIOD    THEN A.RFX ELSE 0 END) AS PQTR_ACTUALS_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Outlook_PM'' AND A.T_VERSION=''YTD'' AND A.E_BOOKS=''NEWF - OL'' AND A.E_PERIOD_DATE=PS.FY_OUTLOOK_PERIOD THEN A.RFX ELSE 0 END) AS FY_OUTLOOK_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''   AND A.T_VERSION=''YTD'' AND A.MONTH_ABR=''FY'' AND A.E_PERIOD_DATE=PS.FY_ACTPY_PERIOD   THEN A.RFX ELSE 0 END) AS FY_ACTPY_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''   AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.PYYTD_PERIOD       THEN A.RFX ELSE 0 END) AS PYYTD_ACTUALS_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''   AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.PYPQTR_PERIOD      THEN A.RFX ELSE 0 END) AS PYPQTR_ACTUALS_RFX
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLDATA" A CROSS JOIN PERIOD_SET PS
    WHERE A.M_ACCOUNT_5 = ''Software'' AND A.T_REPORTING = ''FPNA''
    AND A.E_PERIOD_DATE IN (PS.CURRENT_YTD_PERIOD,PS.PYYTD_PERIOD,PS.PREV_QTR_PERIOD,PS.PYPQTR_PERIOD,PS.FY_ACTPY_PERIOD,PS.FY_OUTLOOK_PERIOD)
)
SELECT
    M.YTD_ACTUALS_CFX,
    (M.YTD_ACTUALS_CFX  - M.RBUDYTD_CFX)        AS VS_BUDGET_CFX,
    M.PQTR_ACTUALS_CFX,
    M.FY_OUTLOOK_CFX,
    (M.FY_OUTLOOK_CFX   - M.FY_ACTPY_CFX)       AS VAR_FY_ACTPY_CFX,
    (M.PQTR_ACTUALS_CFX - M.PYPQTR_ACTUALS_CFX) AS VAR_PYPQTR_CFX,
    (M.YTD_ACTUALS_CFX  - M.PYYTD_ACTUALS_CFX)  AS VAR_PYYTD_CFX,
    M.YTD_ACTUALS_RFX,
    (M.YTD_ACTUALS_RFX  - M.RBUDYTD_RFX)        AS VS_BUDGET_RFX,
    M.PQTR_ACTUALS_RFX,
    M.FY_OUTLOOK_RFX,
    (M.FY_OUTLOOK_RFX   - M.FY_ACTPY_RFX)       AS VAR_FY_ACTPY_RFX,
    (M.PQTR_ACTUALS_RFX - M.PYPQTR_ACTUALS_RFX) AS VAR_PYPQTR_RFX,
    (M.YTD_ACTUALS_RFX  - M.PYYTD_ACTUALS_RFX)  AS VAR_PYYTD_RFX
FROM PERIOD_SET PS CROSS JOIN ALL_MEASURES M'
);

-- ── 10. CIR ───────────────────────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
10,
'CIR',
'WITH DATA_ANCHOR AS (
    SELECT MAX(R.E_PERIOD_DATE) AS ACTUALS_YTD_DATE
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLRATIOS" R
    WHERE R.M_ACCOUNT_5 LIKE ''CIR %''
    AND   R.T_REPORTING = ''FPNA''
    AND   R.DATA_TYPE   = ''Actuals''
    AND   R.T_VERSION   = ''YTD''
    AND   R.CFX_N      != 0
    AND EXISTS (
        SELECT 1 FROM T1NFRP_PHY."TBL_NFRP_DATE_CONFIG" D
        WHERE D.FILTER_DATE = TO_VARCHAR(R.E_PERIOD_DATE, ''YYYY-MM-DD'')
    )
),
PERIODS AS (
    SELECT
        MAX(CASE WHEN D.ADD16 = ''0''                         THEN D.E_PERIOD_DATE END) AS CURRENT_YTD_PERIOD,
        MAX(CASE WHEN D.ADD16 = ''-12''                       THEN D.E_PERIOD_DATE END) AS PYYTD_PERIOD,
        MAX(CASE WHEN D.ADD17 = ''-1'' AND D.ADD19 = ''CY''   THEN D.E_PERIOD_DATE END) AS PREV_QTR_PERIOD,
        MAX(CASE WHEN D.ADD17 = ''-5'' AND D.ADD19 = ''PY''   THEN D.E_PERIOD_DATE END) AS PYPQTR_PERIOD
    FROM T1NFRP_PHY."TBL_NFRP_DATE_CONFIG" D
    CROSS JOIN DATA_ANCHOR A
    WHERE D.FILTER_DATE = TO_VARCHAR(A.ACTUALS_YTD_DATE, ''YYYY-MM-DD'')
),
FY_ANCHOR AS (
    SELECT MAX(E_PERIOD_DATE) AS FY_ACTPY_PERIOD
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLRATIOS"
    WHERE M_ACCOUNT_5 LIKE ''CIR %'' AND T_REPORTING = ''FPNA''
    AND   DATA_TYPE = ''Actuals'' AND T_VERSION = ''YTD'' AND MONTH_ABR = ''FY''
),
FY_OUTLOOK_ANCHOR AS (
    SELECT MAX(E_PERIOD_DATE) AS FY_OUTLOOK_PERIOD
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLRATIOS"
    WHERE M_ACCOUNT_5 LIKE ''CIR %'' AND E_BOOKS = ''NEWF - OL''
    AND   T_REPORTING = ''FPNA'' AND DATA_TYPE = ''Outlook_PM'' AND T_VERSION = ''YTD''
),
PERIOD_SET AS (
    SELECT P.CURRENT_YTD_PERIOD, P.PYYTD_PERIOD, P.PREV_QTR_PERIOD, P.PYPQTR_PERIOD,
           FA.FY_ACTPY_PERIOD, OA.FY_OUTLOOK_PERIOD
    FROM PERIODS P CROSS JOIN FY_ANCHOR FA CROSS JOIN FY_OUTLOOK_ANCHOR OA
),
ALL_MEASURES AS (
    SELECT
        SUM(CASE WHEN R.DATA_TYPE=''Actuals''    AND R.T_VERSION=''YTD'' AND R.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN R.CFX_N ELSE 0 END) AS YTD_ACTUALS_CFX,
        SUM(CASE WHEN R.DATA_TYPE=''Budget''     AND R.T_VERSION=''YTD'' AND R.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN R.CFX_N ELSE 0 END) AS RBUDYTD_CFX,
        SUM(CASE WHEN R.DATA_TYPE=''Actuals''    AND R.T_VERSION=''QTD'' AND R.E_PERIOD_DATE=PS.PREV_QTR_PERIOD    THEN R.CFX_N ELSE 0 END) AS PQTR_ACTUALS_CFX,
        SUM(CASE WHEN R.DATA_TYPE=''Outlook_PM'' AND R.T_VERSION=''YTD'' AND R.E_BOOKS=''NEWF - OL'' AND R.E_PERIOD_DATE=PS.FY_OUTLOOK_PERIOD THEN R.CFX_N ELSE 0 END) AS FY_OUTLOOK_CFX,
        SUM(CASE WHEN R.DATA_TYPE=''Actuals''    AND R.T_VERSION=''YTD'' AND R.MONTH_ABR=''FY'' AND R.E_PERIOD_DATE=PS.FY_ACTPY_PERIOD   THEN R.CFX_N ELSE 0 END) AS FY_ACTPY_CFX,
        SUM(CASE WHEN R.DATA_TYPE=''Actuals''    AND R.T_VERSION=''YTD'' AND R.E_PERIOD_DATE=PS.PYYTD_PERIOD       THEN R.CFX_N ELSE 0 END) AS PYYTD_ACTUALS_CFX,
        SUM(CASE WHEN R.DATA_TYPE=''Actuals''    AND R.T_VERSION=''QTD'' AND R.E_PERIOD_DATE=PS.PYPQTR_PERIOD      THEN R.CFX_N ELSE 0 END) AS PYPQTR_ACTUALS_CFX,
        SUM(CASE WHEN R.DATA_TYPE=''Actuals''    AND R.T_VERSION=''YTD'' AND R.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN R.RFX_N ELSE 0 END) AS YTD_ACTUALS_RFX,
        SUM(CASE WHEN R.DATA_TYPE=''Budget''     AND R.T_VERSION=''YTD'' AND R.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN R.RFX_N ELSE 0 END) AS RBUDYTD_RFX,
        SUM(CASE WHEN R.DATA_TYPE=''Actuals''    AND R.T_VERSION=''QTD'' AND R.E_PERIOD_DATE=PS.PREV_QTR_PERIOD    THEN R.RFX_N ELSE 0 END) AS PQTR_ACTUALS_RFX,
        SUM(CASE WHEN R.DATA_TYPE=''Outlook_PM'' AND R.T_VERSION=''YTD'' AND R.E_BOOKS=''NEWF - OL'' AND R.E_PERIOD_DATE=PS.FY_OUTLOOK_PERIOD THEN R.RFX_N ELSE 0 END) AS FY_OUTLOOK_RFX,
        SUM(CASE WHEN R.DATA_TYPE=''Actuals''    AND R.T_VERSION=''YTD'' AND R.MONTH_ABR=''FY'' AND R.E_PERIOD_DATE=PS.FY_ACTPY_PERIOD   THEN R.RFX_N ELSE 0 END) AS FY_ACTPY_RFX,
        SUM(CASE WHEN R.DATA_TYPE=''Actuals''    AND R.T_VERSION=''YTD'' AND R.E_PERIOD_DATE=PS.PYYTD_PERIOD       THEN R.RFX_N ELSE 0 END) AS PYYTD_ACTUALS_RFX,
        SUM(CASE WHEN R.DATA_TYPE=''Actuals''    AND R.T_VERSION=''QTD'' AND R.E_PERIOD_DATE=PS.PYPQTR_PERIOD      THEN R.RFX_N ELSE 0 END) AS PYPQTR_ACTUALS_RFX
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLRATIOS" R CROSS JOIN PERIOD_SET PS
    WHERE R.M_ACCOUNT_5 LIKE ''CIR %'' AND R.T_REPORTING = ''FPNA''
    AND R.E_PERIOD_DATE IN (PS.CURRENT_YTD_PERIOD,PS.PYYTD_PERIOD,PS.PREV_QTR_PERIOD,PS.PYPQTR_PERIOD,PS.FY_ACTPY_PERIOD,PS.FY_OUTLOOK_PERIOD)
)
SELECT
    M.YTD_ACTUALS_CFX,
    (M.YTD_ACTUALS_CFX  - M.RBUDYTD_CFX)        AS VS_BUDGET_CFX,
    M.PQTR_ACTUALS_CFX,
    M.FY_OUTLOOK_CFX,
    (M.FY_OUTLOOK_CFX   - M.FY_ACTPY_CFX)       AS VAR_FY_ACTPY_CFX,
    (M.PQTR_ACTUALS_CFX - M.PYPQTR_ACTUALS_CFX) AS VAR_PYPQTR_CFX,
    (M.YTD_ACTUALS_CFX  - M.PYYTD_ACTUALS_CFX)  AS VAR_PYYTD_CFX,
    M.YTD_ACTUALS_RFX,
    (M.YTD_ACTUALS_RFX  - M.RBUDYTD_RFX)        AS VS_BUDGET_RFX,
    M.PQTR_ACTUALS_RFX,
    M.FY_OUTLOOK_RFX,
    (M.FY_OUTLOOK_RFX   - M.FY_ACTPY_RFX)       AS VAR_FY_ACTPY_RFX,
    (M.PQTR_ACTUALS_RFX - M.PYPQTR_ACTUALS_RFX) AS VAR_PYPQTR_RFX,
    (M.YTD_ACTUALS_RFX  - M.PYYTD_ACTUALS_RFX)  AS VAR_PYYTD_RFX
FROM PERIOD_SET PS CROSS JOIN ALL_MEASURES M'
);

-- ── 11. Controllable Headcount ────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
11,
'Controllable Headcount',
'WITH DATA_ANCHOR AS (
    SELECT MAX(A.E_PERIOD_DATE) AS ACTUALS_YTD_DATE
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLDATA" A
    WHERE A.M_ACCOUNT_0 = ''Headcount''
    AND   A.M_ACCOUNT_1 = ''Controllable FTE''
    AND   A.T_REPORTING = ''FPNA''
    AND   A.DATA_TYPE   = ''Actuals''
    AND   A.T_VERSION   = ''YTD''
    AND   A.CFX        != 0
    AND EXISTS (
        SELECT 1 FROM T1NFRP_PHY."TBL_NFRP_DATE_CONFIG" D
        WHERE D.FILTER_DATE = TO_VARCHAR(A.E_PERIOD_DATE, ''YYYY-MM-DD'')
    )
),
PERIODS AS (
    SELECT
        MAX(CASE WHEN D.ADD16 = ''0''                         THEN D.E_PERIOD_DATE END) AS CURRENT_YTD_PERIOD,
        MAX(CASE WHEN D.ADD17 = ''-1'' AND D.ADD19 = ''CY''   THEN D.E_PERIOD_DATE END) AS CY_PQ_PERIOD,
        MAX(CASE WHEN D.ADD17 = ''-5'' AND D.ADD19 = ''PY''   THEN D.E_PERIOD_DATE END) AS PY_PQ_PERIOD,
        MAX(CASE WHEN D.ADD6  = ''PY_YTD''                    THEN D.E_PERIOD_DATE END) AS YTD_PY_PERIOD
    FROM T1NFRP_PHY."TBL_NFRP_DATE_CONFIG" D
    CROSS JOIN DATA_ANCHOR A
    WHERE D.FILTER_DATE = TO_VARCHAR(A.ACTUALS_YTD_DATE, ''YYYY-MM-DD'')
),
FY_OUTLOOK_ANCHOR AS (
    SELECT MAX(E_PERIOD_DATE) AS FY_OUTLOOK_PERIOD
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLDATA"
    WHERE M_ACCOUNT_0 = ''Headcount'' AND M_ACCOUNT_1 = ''Controllable FTE''
    AND   T_REPORTING = ''FPNA'' AND DATA_TYPE = ''Outlook_PM''
    AND   T_VERSION = ''YTD'' AND MONTH_ABR = ''FY''
),
PERIOD_SET AS (
    SELECT P.CURRENT_YTD_PERIOD, P.CY_PQ_PERIOD, P.PY_PQ_PERIOD,
           P.YTD_PY_PERIOD, OA.FY_OUTLOOK_PERIOD
    FROM PERIODS P CROSS JOIN FY_OUTLOOK_ANCHOR OA
),
ALL_MEASURES AS (
    SELECT
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.CFX ELSE 0 END) AS YTD_ACTUALS_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Budget''     AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.CFX ELSE 0 END) AS YTDB_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.CY_PQ_PERIOD       THEN A.CFX ELSE 0 END) AS CY_PQ_ACTUALS_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Outlook_PM'' AND A.T_VERSION=''YTD'' AND A.MONTH_ABR=''FY'' AND A.E_PERIOD_DATE=PS.FY_OUTLOOK_PERIOD THEN A.CFX ELSE 0 END) AS FY_OUTLOOK_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''MTD'' AND A.E_PERIOD_DATE=PS.YTD_PY_PERIOD      THEN A.CFX ELSE 0 END) AS YTD_ACTUALS_PY_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.PY_PQ_PERIOD       THEN A.CFX ELSE 0 END) AS PY_PQ_ACTUALS_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.RFX ELSE 0 END) AS YTD_ACTUALS_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Budget''     AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.RFX ELSE 0 END) AS YTDB_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.CY_PQ_PERIOD       THEN A.RFX ELSE 0 END) AS CY_PQ_ACTUALS_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Outlook_PM'' AND A.T_VERSION=''YTD'' AND A.MONTH_ABR=''FY'' AND A.E_PERIOD_DATE=PS.FY_OUTLOOK_PERIOD THEN A.RFX ELSE 0 END) AS FY_OUTLOOK_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''MTD'' AND A.E_PERIOD_DATE=PS.YTD_PY_PERIOD      THEN A.RFX ELSE 0 END) AS YTD_ACTUALS_PY_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.PY_PQ_PERIOD       THEN A.RFX ELSE 0 END) AS PY_PQ_ACTUALS_RFX
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLDATA" A CROSS JOIN PERIOD_SET PS
    WHERE A.M_ACCOUNT_0 = ''Headcount'' AND A.M_ACCOUNT_1 = ''Controllable FTE''
    AND   A.T_REPORTING = ''FPNA''
    AND   A.E_PERIOD_DATE IN (PS.CURRENT_YTD_PERIOD,PS.CY_PQ_PERIOD,PS.PY_PQ_PERIOD,PS.YTD_PY_PERIOD,PS.FY_OUTLOOK_PERIOD)
)
SELECT
    M.YTD_ACTUALS_CFX,
    (M.YTD_ACTUALS_CFX   - M.YTDB_CFX)           AS VS_BUDGET_CFX,
    M.CY_PQ_ACTUALS_CFX,
    M.FY_OUTLOOK_CFX,
    (M.CY_PQ_ACTUALS_CFX - M.PY_PQ_ACTUALS_CFX)  AS VAR_PY_PQ_YOY_CFX,
    (M.YTD_ACTUALS_CFX   - M.YTD_ACTUALS_PY_CFX) AS VAR_YTD_PY_YOY_CFX,
    (M.FY_OUTLOOK_CFX    - M.YTD_ACTUALS_PY_CFX) AS VAR_FY_VS_PY_CFX,
    M.YTD_ACTUALS_RFX,
    (M.YTD_ACTUALS_RFX   - M.YTDB_RFX)           AS VS_BUDGET_RFX,
    M.CY_PQ_ACTUALS_RFX,
    M.FY_OUTLOOK_RFX,
    (M.CY_PQ_ACTUALS_RFX - M.PY_PQ_ACTUALS_RFX)  AS VAR_PY_PQ_YOY_RFX,
    (M.YTD_ACTUALS_RFX   - M.YTD_ACTUALS_PY_RFX) AS VAR_YTD_PY_YOY_RFX,
    (M.FY_OUTLOOK_RFX    - M.YTD_ACTUALS_PY_RFX) AS VAR_FY_VS_PY_RFX
FROM PERIOD_SET PS CROSS JOIN ALL_MEASURES M'
);

-- ── 12. Second RWA ────────────────────────────────────────

INSERT INTO "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
("ID", "WIDGET", "QUERY")
VALUES (
12,
'Second RWA',
'WITH DATA_ANCHOR AS (
    SELECT MAX(A.E_PERIOD_DATE) AS ACTUALS_YTD_DATE
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLDATA" A
    WHERE A.M_ACCOUNT_0 = ''Risk Weighted Assets''
    AND   A.T_REPORTING = ''FPNA''
    AND   A.DATA_TYPE   = ''Actuals''
    AND   A.T_VERSION   = ''YTD''
    AND   A.CFX        != 0
    AND EXISTS (
        SELECT 1 FROM T1NFRP_PHY."TBL_NFRP_DATE_CONFIG" D
        WHERE D.FILTER_DATE = TO_VARCHAR(A.E_PERIOD_DATE, ''YYYY-MM-DD'')
    )
),
PERIODS AS (
    SELECT
        MAX(CASE WHEN D.ADD16 = ''0''                         THEN D.E_PERIOD_DATE END) AS CURRENT_YTD_PERIOD,
        MAX(CASE WHEN D.ADD17 = ''-1'' AND D.ADD19 = ''CY''   THEN D.E_PERIOD_DATE END) AS CY_PQ_PERIOD,
        MAX(CASE WHEN D.ADD17 = ''-5'' AND D.ADD19 = ''PY''   THEN D.E_PERIOD_DATE END) AS PY_PQ_PERIOD,
        MAX(CASE WHEN D.ADD6  = ''PY_YTD''                    THEN D.E_PERIOD_DATE END) AS YTD_PY_PERIOD
    FROM T1NFRP_PHY."TBL_NFRP_DATE_CONFIG" D
    CROSS JOIN DATA_ANCHOR A
    WHERE D.FILTER_DATE = TO_VARCHAR(A.ACTUALS_YTD_DATE, ''YYYY-MM-DD'')
),
FY_OUTLOOK_ANCHOR AS (
    SELECT MAX(E_PERIOD_DATE) AS FY_OUTLOOK_PERIOD
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLDATA"
    WHERE M_ACCOUNT_0 = ''Risk Weighted Assets''
    AND   T_REPORTING = ''FPNA'' AND DATA_TYPE = ''Outlook_PM''
    AND   T_VERSION = ''YTD'' AND MONTH_ABR = ''FY''
),
PERIOD_SET AS (
    SELECT P.CURRENT_YTD_PERIOD, P.CY_PQ_PERIOD, P.PY_PQ_PERIOD,
           P.YTD_PY_PERIOD, OA.FY_OUTLOOK_PERIOD
    FROM PERIODS P CROSS JOIN FY_OUTLOOK_ANCHOR OA
),
ALL_MEASURES AS (
    SELECT
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.CFX ELSE 0 END) AS YTD_ACTUALS_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Budget''     AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.CFX ELSE 0 END) AS YTDB_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.CY_PQ_PERIOD       THEN A.CFX ELSE 0 END) AS CY_PQ_ACTUALS_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Outlook_PM'' AND A.T_VERSION=''YTD'' AND A.MONTH_ABR=''FY'' AND A.E_PERIOD_DATE=PS.FY_OUTLOOK_PERIOD THEN A.CFX ELSE 0 END) AS FY_OUTLOOK_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''MTD'' AND A.E_PERIOD_DATE=PS.YTD_PY_PERIOD      THEN A.CFX ELSE 0 END) AS YTD_ACTUALS_PY_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.PY_PQ_PERIOD       THEN A.CFX ELSE 0 END) AS PY_PQ_ACTUALS_CFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.RFX ELSE 0 END) AS YTD_ACTUALS_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Budget''     AND A.T_VERSION=''YTD'' AND A.E_PERIOD_DATE=PS.CURRENT_YTD_PERIOD THEN A.RFX ELSE 0 END) AS YTDB_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.CY_PQ_PERIOD       THEN A.RFX ELSE 0 END) AS CY_PQ_ACTUALS_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Outlook_PM'' AND A.T_VERSION=''YTD'' AND A.MONTH_ABR=''FY'' AND A.E_PERIOD_DATE=PS.FY_OUTLOOK_PERIOD THEN A.RFX ELSE 0 END) AS FY_OUTLOOK_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''MTD'' AND A.E_PERIOD_DATE=PS.YTD_PY_PERIOD      THEN A.RFX ELSE 0 END) AS YTD_ACTUALS_PY_RFX,
        SUM(CASE WHEN A.DATA_TYPE=''Actuals''    AND A.T_VERSION=''QTD'' AND A.E_PERIOD_DATE=PS.PY_PQ_PERIOD       THEN A.RFX ELSE 0 END) AS PY_PQ_ACTUALS_RFX
    FROM T1NFRP_PHY."CV_UP_NFRP_ALLDATA" A CROSS JOIN PERIOD_SET PS
    WHERE A.M_ACCOUNT_0 = ''Risk Weighted Assets'' AND A.T_REPORTING = ''FPNA''
    AND   A.E_PERIOD_DATE IN (PS.CURRENT_YTD_PERIOD,PS.CY_PQ_PERIOD,PS.PY_PQ_PERIOD,PS.YTD_PY_PERIOD,PS.FY_OUTLOOK_PERIOD)
)
SELECT
    M.YTD_ACTUALS_CFX,
    (M.YTD_ACTUALS_CFX   - M.YTDB_CFX)           AS VS_BUDGET_CFX,
    M.CY_PQ_ACTUALS_CFX,
    M.FY_OUTLOOK_CFX,
    (M.CY_PQ_ACTUALS_CFX - M.PY_PQ_ACTUALS_CFX)  AS VAR_PY_PQ_YOY_CFX,
    (M.YTD_ACTUALS_CFX   - M.YTD_ACTUALS_PY_CFX) AS VAR_YTD_PY_YOY_CFX,
    (M.FY_OUTLOOK_CFX    - M.YTD_ACTUALS_PY_CFX) AS VAR_FY_VS_PY_CFX,
    M.YTD_ACTUALS_RFX,
    (M.YTD_ACTUALS_RFX   - M.YTDB_RFX)           AS VS_BUDGET_RFX,
    M.CY_PQ_ACTUALS_RFX,
    M.FY_OUTLOOK_RFX,
    (M.CY_PQ_ACTUALS_RFX - M.PY_PQ_ACTUALS_RFX)  AS VAR_PY_PQ_YOY_RFX,
    (M.YTD_ACTUALS_RFX   - M.YTD_ACTUALS_PY_RFX) AS VAR_YTD_PY_YOY_RFX,
    (M.FY_OUTLOOK_RFX    - M.YTD_ACTUALS_PY_RFX) AS VAR_FY_VS_PY_RFX
FROM PERIOD_SET PS CROSS JOIN ALL_MEASURES M'
);


-- ── Verify all 12 rows inserted correctly ─────────────────

SELECT "ID", "WIDGET", LENGTH("QUERY") AS QUERY_LEN
FROM "T1NFRP_NFRP_FINANCIALS_REPORTING_MASTER"
ORDER BY "ID";

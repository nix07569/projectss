import React, { useState } from "react";
import "./TransactionHistory.css";
import html2pdf from "html2pdf.js";

const currencies = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
];

function TransactionHistory({
  batches = [],
  employees = [],
  currency = "USD",
  accountBalance = 0,
  accountName = "",
  accountNumber = "",
  bankName = "Standard Chartered",
  initialBalance = 0,
}) {
  const [filter, setFilter] = useState({ start: "", end: "" });

  const getCurrencySymbol = (code) =>
    currencies.find((c) => c.code === code)?.symbol || "$";

  function handleDownload() {
    const symbol = getCurrencySymbol(currency);
    const today = new Date().toISOString().split("T")[0];

    const content = document.createElement("div");
    content.style.padding = "20px";
    content.style.fontFamily = "Arial, sans-serif";

    content.innerHTML = `
      <h1 style="font-size: 20px; margin-bottom: 12px;">Transaction Report</h1>
      <div style="margin: 16px 0 20px 0; font-size: 11px; border-bottom: 2px solid #333; padding-bottom: 12px;">
        <div><strong>Account Name:</strong> ${accountName}</div>
        <div><strong>Account Number:</strong> ${accountNumber}</div>
        <div><strong>Bank:</strong> ${bankName}</div>
        <div><strong>Current Balance:</strong> ${symbol} ${accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Transaction ID</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Batch Name</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${batches
            .map(
              (b) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${b.date || "-"}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">-</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${b.batchName || "-"}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">-</td>
              </tr>`
            )
            .join("")}
          ${employees
            .map(
              (e) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">-</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${e.transactionId || "-"}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">-</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${symbol} ${Number(
                  e.amount || 0
                ).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;

    const options = {
      margin: 10,
      filename: `transaction-report-${today}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(content).save();
  }

  return (
    <div className="txn-root">
      {/* Header actions */}
      <div className="txn-filter-row">
        <div className="txn-actions">
          <button className="download-btn" onClick={handleDownload}>
            Download PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="txn-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>Batch Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((b, i) => (
            <tr key={`batch-${i}`}>
              <td>{b.date || "-"}</td>
              <td>-</td>
              <td>{b.batchName || "-"}</td>
              <td style={{ textAlign: "right" }}>-</td>
            </tr>
          ))}

          {employees.map((e, i) => (
            <tr key={`emp-${i}`}>
              <td>-</td>
              <td>{e.transactionId || "-"}</td>
              <td>-</td>
              <td style={{ textAlign: "right" }}>
                {getCurrencySymbol(currency)}{" "}
                {Number(e.amount || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;

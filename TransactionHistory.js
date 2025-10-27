// TransactionHistory.js
import React, { useState } from "react";
import "./TransactionHistory.css";

const currencies = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
];

const exchangeRates = {
  INR: 88,
  USD: 1,
};

function convertBalance(balance, target) {
  return (balance * exchangeRates[target]).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
}

function TransactionHistory({ 
  transactions = [], 
  currency = "USD",
  accountBalance = 0 
}) {
  const [filter, setFilter] = useState({ start: "", end: "" });

  // Get default date range (one month ago to today)
  const getDefaultDateRange = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    return { start: oneMonthAgo, end: today };
  };

  // Filter transactions by date range
  const filtered = transactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    const defaultRange = getDefaultDateRange();
    const startDate = filter.start ? new Date(filter.start) : defaultRange.start;
    const endDate = filter.end ? new Date(filter.end) : defaultRange.end;
    return txnDate >= startDate && txnDate <= endDate;
  });

  // Sort by newest on top
  const sortedTransactions = [...filtered].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Calculate balances
  const transactionTotal = sortedTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const closingBalance = accountBalance;
  const openingBalance = closingBalance + transactionTotal;

  // Get currency symbol
  const getCurrencySymbol = (code) => {
    return currencies.find((c) => c.code === code)?.symbol || "$";
  };

  return (
    <div className="txn-root">
      <div className="txn-filter-row">
        <div className="txn-date-filters">
          <label>
            Start Date:
            <input
              type="date"
              value={filter.start}
              onChange={(e) => setFilter({ ...filter, start: e.target.value })}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={filter.end}
              onChange={(e) => setFilter({ ...filter, end: e.target.value })}
            />
          </label>
        </div>
        <div className="txn-actions">
          <button
            className="clear-btn"
            onClick={() => setFilter({ start: "", end: "" })}
          >
            Clear
          </button>
          <button className="download-btn">Download</button>
        </div>
      </div>
      <div className="txn-balances-row">
        <span className="openingBalance">
          Opening Balance:{" "}
          <strong>
            {getCurrencySymbol(currency)}
            {convertBalance(openingBalance, currency)}
          </strong>
        </span>
        <span className="closingBalance">
          Closing Balance:{" "}
          <strong>
            {getCurrencySymbol(currency)}
            {convertBalance(closingBalance, currency)}
          </strong>
        </span>
      </div>
      <table className="txn-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction ID</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Approved By</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((txn, i) => (
            <tr key={txn.id || i}>
              <td>{txn.date}</td>
              <td>{txn.id}</td>
              <td>{txn.description}</td>
              <td>
                {getCurrencySymbol(txn.currency)}{" "}
                {txn.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td>{txn.approver}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;

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
  return (balance * (exchangeRates[target] || 1)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
}

function TransactionHistory({
  transactions = [],
  currency = "USD",
  accountBalance = 0,
}) {
  const [filter, setFilter] = useState({ start: "", end: "" });

  // Extract initial balance from transactions or fallback to 0
  const initialBalance =
    transactions.length > 0 && transactions[0].initialBalance !== undefined
      ? transactions[0].initialBalance
      : 0;

  // Default date range - one month ago to today
  const getDefaultDateRange = () => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    return { start: oneMonthAgo, end: today };
  };

  // Filter transactions by date range
  const filtered = transactions.filter((txn) => {
    if (txn.initialBalance !== undefined) {
      // Exclude initialBalance object from transactions list
      return false;
    }
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

  // Calculate opening balance at start of filter range
  const openingBalance = (() => {
    const defaultRange = getDefaultDateRange();
    const startDate = filter.start ? new Date(filter.start) : defaultRange.start;

    // Sum of all transactions before startDate
    const totalBeforeStart = transactions
      .filter((txn) => {
        if (txn.initialBalance !== undefined) return false;
        return new Date(txn.date) < startDate;
      })
      .reduce((sum, txn) => sum + txn.amount, 0);

    // Opening balance = initialBalance + sum of transactions before start date
    return initialBalance + totalBeforeStart;
  })();

  // Sum of transactions within date range
  const transactionTotal = sortedTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  // Closing balance = opening + transactions in range
  const closingBalance = openingBalance - transactionTotal;

  // Get currency symbol helper
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
          <button className="clear-btn" onClick={() => setFilter({ start: "", end: "" })}>
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

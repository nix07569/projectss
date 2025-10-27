// AccountHeader.js
import React from "react";
import "./AccountHeader.css";


const currencies = [
    {code: "INR", symbol: "₹"},
    {code: "USD", symbol: "$"},
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

function AccountHeader({ name, accountNumber, balance, currency, onCurrencyChange }) {

  return (
    <div className="account-header-root">
      <div>
        <h2>{name}</h2>
        <div className="account-header-accnum">{accountNumber}</div>
      </div>
      <div className="account-header-balance-section">
        <span className="account-header-balance-amount">
          {currencies.find(c => c.code === currency)?.symbol}
          {convertBalance(balance, currency)}
        </span>
        <select
          className="account-header-select"
         value={currency} 
          onChange={(e) => onCurrencyChange(e.target.value)}>
            {currencies.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default AccountHeader;

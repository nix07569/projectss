import React, { useEffect, useState } from "react";
import LandingPage from "./aaaaa/LandingPage";
import AccountHeader from "./aaaaa/AccountHeader";
import TransactionHistory from "./aaaaa/TransactionHistory";

export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    fetch("http://localhost:8080/api/accounts")
      .then((res) => res.json())
      .then((data) => {
        // Map backend model to frontend-friendly shape
        const mapped = data.map((a) => ({
          id: a.id,
          name: a.name,
          accountNumber: a.accountNumber,
          bankName: a.bankName,
          balance: a.balance,
          initialBalance: a.initialBalance,
          currency: a.currency || "USD",
          transactions: (a.transactions || []).map((t) => ({
            date: t.date,
            id: t.txnId,
            description: t.description,
            amount: t.amount,
            approver: t.approver,
            currency: a.currency || "USD"
          }))
        }));
        setAccounts(mapped);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!selectedAccount) {
    return <LandingPage profiles={accounts} onSelectProfile={(acc) => { setSelectedAccount(acc); setCurrency(acc.currency); }} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <AccountHeader
        name={selectedAccount.name}
        accountNumber={selectedAccount.accountNumber}
        balance={selectedAccount.balance}
        currency={currency}
        onCurrencyChange={setCurrency}
      />
      <TransactionHistory
        transactions={selectedAccount.transactions}
        accountBalance={selectedAccount.balance}
        initialBalance={selectedAccount.initialBalance}
        accountName={selectedAccount.name}
        accountNumber={selectedAccount.accountNumber}
        bankName={selectedAccount.bankName}
        currency={currency}
      />
    </div>
  );
}

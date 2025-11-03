export default function App() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [currency, setCurrency] = useState("INR");

  if (!selectedAccount) {
    return <LandingPage profiles={accounts} onSelectProfile={acc => { setSelectedAccount(acc); setCurrency(acc.currency); }} />;
  }

  // You can add currency switch logic for balances here
  return (
    <div>
      <AccountHeader
        name={selectedAccount.name}
        accountNumber={selectedAccount.accountNumber}
        balance={selectedAccount.balance}
        currency={currency}
      />
      <TransactionHistory
        transactions={selectedAccount.transactions}
        balance={selectedAccount.balance}
        currency={currency}
        accountName ={selectedAccount.name}
        accountNumber ={selectedAccount.accountNumber}
      />
    </div>
  );
}



//lund
import React, { useState } from "react";
import LandingPage from "./aaaaa/LandingPage";
import AccountHeader from "./aaaaa/AccountHeader";
import TransactionHistory from "./aaaaa/TransactionHistory";

const accounts = [
  {
    id: 1,
    name: "Alexx Kumar",
    accountNumber: "4412 1234 7890 6753",
    initialBalance: 3000000,
    transactions: [
  {
        date: "2025-10-07",
        id: "TNX005298076301",
        description: "Managerial Batch salary",
        amount: 11380,
        approver: "Jane Margolis"
      },
      {
        date: "2025-10-11",
        id: "TNX0098765432",
        description: "Operations Batch salary",
        amount: 14000,
        approver: "Jesse Pinkman"
      },
      {
        date: "2025-10-13",
        id: "TNX003591878654",
        description: "Executives Salary",
        amount: 76860,
        approver: "Mr.White"
      },
      {
        date: "2025-10-16",
        id: "TNX008922875820",
        description: "Miscellaneous",
        amount: 42500,
        approver: "Skyler"
      }
],
    balance: 97851.32,
    currency: "USD"
  },
  {
    id: 2,
    name: "Heisenberg",
    accountNumber: "4412 1234 7890 6753",
    transactions: [
      {
        date: "2025-10-07",
        id: "TNX005298076301",
        description: "Managerial Batch salary",
        amount: 113800,
        approver: "Jane Margolis"
      },
      {
        date: "2025-10-11",
        id: "TNX0098765432",
        description: "Operations Batch salary",
        amount: 14000,
        approver: "Jesse Pinkman"
      },
      {
        date: "2025-10-13",
        id: "TNX003591878654",
        description: "Executives Salary",
        amount: 768636000,
        approver: "Mr.White"
      },
      {
        date: "2025-10-16",
        id: "TNX008922875820",
        description: "Miscellaneous",
        amount: 42504000,
        approver: "Skyler"
      }
    ],
    balance: 97851.32,
    currency: "USD"
  },
  {
    id: 3,
    name: "Elon Musk",
    accountNumber: "4412 1234 7890 6753",
    transactions: [
      {
        date: "2025-10-07",
        id: "TNX005298076301",
        description: "Managerial Batch salary",
        amount: 113800,
        approver: "Jane Margolis"
      },
      {
        date: "2025-10-11",
        id: "TNX0098765432",
        description: "Operations Batch salary",
        amount: 14000,
        approver: "Jesse Pinkman"
      },
      {
        date: "2025-10-13",
        id: "TNX003591878654",
        description: "Executives Salary",
        amount: 768636000,
        approver: "Mr.White"
      },
      {
        date: "2025-10-16",
        id: "TNX008922875820",
        description: "Miscellaneous",
        amount: 42504000,
        approver: "Skyler"
      }
    ],
    balance: 97851.32,
    currency: "USD"
  },
  {
    id: 4,
    name: "Alex Kumar",
    accountNumber: "4412 1234 7890 6753",
    transactions: [
      {
        date: "2025-10-07",
        id: "TNX005298076301",
        description: "Managerial Batch salary",
        amount: 25000,
        approver: "Jane Margolis"
      },
      {
        date: "2025-10-11",
        id: "TNX0098765432",
        description: "Operations Batch salary",
        amount: 20000,
        approver: "Jesse Pinkman"
      },
      {
        date: "2025-10-13",
        id: "TNX003591878654",
        description: "Executives Salary",
        amount: 15000,
        approver: "Mr.White"
      },
      {
        date: "2025-08-16",
        id: "TNX008922875820",
        description: "Miscellaneous",
        amount: 10000,
        approver: "Skyler"
      }
    ],
    balance: 100000.00,
    currency: "USD"
  },
];

export default function App() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [currency, setCurrency] = useState("INR");

  if (!selectedAccount) {
    return <LandingPage profiles={accounts} onSelectProfile={acc => { setSelectedAccount(acc); setCurrency(acc.currency); }} />;
  }

  // You can add currency switch logic for balances here
  return (
    <div>
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
        currency={currency}
      />
    </div>
  );
}

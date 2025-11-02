import React, { useState, useEffect } from "react";
import LandingPage from "./aaaaa/LandingPage";
import AccountHeader from "./aaaaa/AccountHeader";
import TransactionHistory from "./aaaaa/TransactionHistory";
import { getBankAccounts, getBatches } from "./api";

export default function App() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch both accounts and batches
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bankAccountsData, batchesData] = await Promise.all([
          getBankAccounts(),
          getBatches(),
        ]);

        console.log("Fetched bank accounts:", bankAccountsData);
        console.log("Fetched batches:", batchesData);

        setBankAccounts(bankAccountsData);
        setBatches(batchesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data from server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading accounts...</div>;
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  // 🧩 LandingPage: map bank accounts + currency info
  if (!selectedAccount) {
    const mergedAccounts = bankAccounts.map((acc) => {
      const relatedBatch = batches.find(
        (b) => b.debitAccount === acc.accountNumber
      );

      return {
        id: acc.id,
        name: acc.accountName,
        accountNumber: acc.accountNumber,
        balance: acc.balance,
        currency: relatedBatch?.currency || "USD",
      };
    });

    return (
      <LandingPage
        profiles={mergedAccounts}
        onSelectProfile={(acc) => {
          // save selectedAccount as the full /api/bank-accounts object
          const actualAccount = bankAccounts.find(
            (a) => a.accountNumber === acc.accountNumber
          );
          setSelectedAccount(actualAccount);
          setCurrency(acc.currency);
        }}
      />
    );
  }

  // 🧾 Get currency for selected account from batches
  const relatedBatch = batches.find(
    (b) => b.debitAccount === selectedAccount.accountNumber
  );
  const accountCurrency = relatedBatch?.currency || currency;

  return (
    <div>
      <AccountHeader
        name={selectedAccount.accountName} // ✅ direct from /api/bank-accounts
        accountNumber={selectedAccount.accountNumber} // ✅ direct from /api/bank-accounts
        balance={selectedAccount.balance} // ✅ direct from /api/bank-accounts
        currency={accountCurrency} // ✅ from /api/batches
        onCurrencyChange={setCurrency}
      />
      <TransactionHistory
        transactions={selectedAccount.transactions || []}
        accountBalance={selectedAccount.balance}
        initialBalance={selectedAccount.initialBalance}
        currency={accountCurrency}
      />
    </div>
  );
}

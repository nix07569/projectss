import React, { useState, useEffect } from "react";
import LandingPage from "./aaaaa/LandingPage";
import AccountHeader from "./aaaaa/AccountHeader";
import TransactionHistory from "./aaaaa/TransactionHistory";
import { getBankAccounts, getBatches, getEmployees } from "./api";

export default function App() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bankAccountsData, batchesData, employeesData] = await Promise.all([
          getBankAccounts(),
          getBatches(),
          getEmployees(),
        ]);

        console.log("Fetched bank accounts:", bankAccountsData);
        console.log("Fetched batches:", batchesData);
        console.log("Fetched employees:", employeesData);

        setBankAccounts(bankAccountsData);
        setBatches(batchesData);
        setEmployees(employeesData);
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
    return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading data...</div>;
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  // 🧩 LandingPage: merge bank accounts + currency info
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
          const actualAccount = bankAccounts.find(
            (a) => a.accountNumber === acc.accountNumber
          );
          setSelectedAccount(actualAccount);
          setCurrency(acc.currency);
        }}
      />
    );
  }

  // 🧾 Map Transaction Data
  const relatedBatch = batches.find(
    (b) => b.debitAccount === selectedAccount.accountNumber
  );
  const accountCurrency = relatedBatch?.currency || currency;

  // Combine batches + employees to make transaction objects
  const transactions = employees
    .filter((emp) => emp.batchId === relatedBatch?.id) // match employee to its batch
    .map((emp) => ({
      id: emp.transactionId, // from /api/employees
      amount: emp.amount, // from /api/employees
      date: relatedBatch?.date, // from /api/batches
      description: relatedBatch?.batchName || relatedBatch?.description, // from /api/batches
      approver: relatedBatch?.approvedBy || "N/A", // optional
    }));

  return (
    <div>
      <AccountHeader
        name={selectedAccount.accountName}
        accountNumber={selectedAccount.accountNumber}
        balance={selectedAccount.balance}
        currency={accountCurrency}
        onCurrencyChange={setCurrency}
      />
      <TransactionHistory
        transactions={transactions} // ✅ merged data
        accountBalance={selectedAccount.balance}
        initialBalance={selectedAccount.initialBalance || 0}
        currency={accountCurrency}
        accountName={selectedAccount.accountName}
        accountNumber={selectedAccount.accountNumber}
      />
    </div>
  );
}

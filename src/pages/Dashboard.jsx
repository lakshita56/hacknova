import { useContext, useState } from "react";
import { ExpenseContext } from "../contexts/ExpenseContext";

function Dashboard() {
  const { expenses, setExpenses } = useContext(ExpenseContext);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState("all");

  const addExpense = (e) => {
    e.preventDefault();
    if (!desc || !amount) return;

    const newExpense = {
      id: Date.now(),
      description: desc,
      amount: parseFloat(amount),
    };

    setExpenses([...expenses, newExpense]);
    setDesc("");
    setAmount("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const filteredExpenses = expenses.filter((exp) => {
    if (filter === "high") return exp.amount > 1000;
    if (filter === "low") return exp.amount <= 1000;
    return true; // all
  });

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Here you will manage your expenses.</p>

      {/* Expense Form */}
      <form onSubmit={addExpense} className="expense-form">
        <input
          type="text"
          placeholder="Expense description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>

      {/* Filters */}
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "high" ? "active" : ""}
          onClick={() => setFilter("high")}
        >
          Above ₹1000
        </button>
        <button
          className={filter === "low" ? "active" : ""}
          onClick={() => setFilter("low")}
        >
          Below ₹1000
        </button>
      </div>

      {/* Expense List */}
      <ul className="expense-list">
        {filteredExpenses.map((exp) => (
          <li
            key={exp.id}
            className={exp.amount > 1000 ? "high-expense" : ""}
          >
            <span>{exp.description}</span>
            <span>₹{exp.amount}</span>
            <button onClick={() => deleteExpense(exp.id)}>❌</button>
          </li>
        ))}
      </ul>

      {/* Total */}
      <div className="total">Total Expenses: ₹{total}</div>
    </div>
  );
}

export default Dashboard;

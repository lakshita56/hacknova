import { useState } from "react";

export default function Dashboard() {
  // Dummy sample data
  const [expenses] = useState([
    { id: 1, title: "Groceries", amount: 120, category: "Food", date: "2025-10-01" },
    { id: 2, title: "Electricity Bill", amount: 80, category: "Utilities", date: "2025-10-02" },
    { id: 3, title: "Movie Night", amount: 45, category: "Entertainment", date: "2025-10-03" },
  ]);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <table className="expense-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount ($)</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.title}</td>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{expense.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}




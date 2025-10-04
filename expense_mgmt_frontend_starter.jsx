# Expense Management — Frontend Starter (React + Vite + Tailwind)

This single-file project scaffold contains all the starter code you need to begin frontend development for the Expense Management System. Copy the sections into separate files as named and follow the instructions in the README to run locally.

---

## FILE: package.json
```json
{
  "name": "expense-mgmt-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.1",
    "axios": "^1.4.0",
    "dayjs": "^1.11.9"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.5.2",
    "vite": "^5.0.0"
  }
}
```

---

## FILE: vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

---

## FILE: tailwind.config.cjs
```js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

---

## FILE: postcss.config.cjs
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## FILE: index.html
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Expense Management - Frontend</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## FILE: src/main.jsx
```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

---

## FILE: src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body { @apply bg-gray-50 text-gray-900; }
```

---

## FILE: src/App.jsx
```jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ExpenseForm from './components/ExpenseForm'
import ApprovalList from './components/ApprovalList'

function AppRoutes() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomeRouter />} />
      <Route path="/submit" element={<ExpenseForm />} />
      <Route path="/approvals" element={<ApprovalList />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function HomeRouter() {
  const { user } = useAuth()
  if (user.role === 'admin') return <AdminDashboard />
  if (user.role === 'manager') return <ManagerDashboard />
  return <EmployeeDashboard />
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
```

---

## FILE: src/contexts/AuthContext.jsx
```jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Very small mock-auth for starter. Replace with real API calls.
const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: 2, name: 'Manager One', email: 'manager@example.com', role: 'manager' },
  { id: 3, name: 'Employee One', email: 'employee@example.com', role: 'employee' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('ems_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  function login(email) {
    const u = MOCK_USERS.find(x => x.email === email)
    if (u) {
      setUser(u)
      localStorage.setItem('ems_user', JSON.stringify(u))
      return true
    }
    return false
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('ems_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

---

## FILE: src/pages/LoginPage.jsx
```jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const auth = useAuth()
  const nav = useNavigate()

  function onSubmit(e) {
    e.preventDefault()
    const ok = auth.login(email)
    if (!ok) return setError('Unknown user. Use admin@example.com, manager@example.com, or employee@example.com')
    nav('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        {error && <div className="mb-2 text-red-600">{error}</div>}
        <label className="block mb-2">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" className="w-full border p-2 rounded mb-4" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Sign In</button>
        <p className="mt-4 text-sm text-gray-600">Test users: admin@example.com, manager@example.com, employee@example.com</p>
      </form>
    </div>
  )
}
```

---

## FILE: src/pages/EmployeeDashboard.jsx
```jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
        <div>{user.name} — <Link to="/submit" className="text-blue-600">Submit Expense</Link></div>
      </header>
      <section className="bg-white p-4 rounded shadow">Your recent expenses (stub).</section>
    </div>
  )
}
```

---

## FILE: src/pages/ManagerDashboard.jsx
```jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ManagerDashboard() {
  const { user } = useAuth()
  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
        <div>{user.name} — <Link to="/approvals" className="text-blue-600">Approvals</Link></div>
      </header>
      <section className="bg-white p-4 rounded shadow">Team expenses and pending approvals (stub).</section>
    </div>
  )
}
```

---

## FILE: src/pages/AdminDashboard.jsx
```jsx
import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div>{user.name}</div>
      </header>
      <section className="bg-white p-4 rounded shadow">User management and rule configuration (stub).</section>
    </div>
  )
}
```

---

## FILE: src/components/ExpenseForm.jsx
```jsx
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

export default function ExpenseForm() {
  const { user } = useAuth()
  const [form, setForm] = useState({ amount: '', currency: 'USD', category: 'Travel', date: '', description: '' })
  const [receipt, setReceipt] = useState(null)
  const [message, setMessage] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    // Convert currency example - use real API in production
    try {
      // For starter, we'll mock a POST to /api/expenses
      console.log('Submitting', { ...form, receipt, submittedBy: user })
      setMessage('Submitted (mock).')
    } catch (err) {
      setMessage('Submission failed.')
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Submit Expense</h2>
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow">
        <label className="block mb-2">Amount</label>
        <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border p-2 rounded mb-4" />

        <label className="block mb-2">Currency</label>
        <input value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full border p-2 rounded mb-4" />

        <label className="block mb-2">Category</label>
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border p-2 rounded mb-4">
          <option>Travel</option>
          <option>Meals</option>
          <option>Accommodation</option>
          <option>Office Supplies</option>
        </select>

        <label className="block mb-2">Date</label>
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border p-2 rounded mb-4" />

        <label className="block mb-2">Description</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border p-2 rounded mb-4" />

        <label className="block mb-2">Receipt</label>
        <input type="file" accept="image/*,application/pdf" onChange={e => setReceipt(e.target.files[0])} className="w-full mb-4" />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
        {message && <div className="mt-3 text-sm text-gray-700">{message}</div>}
      </form>
    </div>
  )
}
```

---

## FILE: src/components/ApprovalList.jsx
```jsx
import React, { useState, useEffect } from 'react'

// Starter mock approvals list. Replace with API integration.
const MOCK = [
  { id: 1, employee: 'Employee One', amount: 120.5, currency: 'USD', category: 'Meals', date: '2025-09-28', status: 'Pending' },
  { id: 2, employee: 'Employee One', amount: 560, currency: 'USD', category: 'Travel', date: '2025-09-25', status: 'Pending' },
]

export default function ApprovalList() {
  const [list, setList] = useState([])

  useEffect(() => {
    setList(MOCK)
  }, [])

  function act(id, action) {
    setList(prev => prev.map(x => x.id === id ? { ...x, status: action } : x))
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
      <div className="space-y-4">
        {list.map(item => (
          <div key={item.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{item.employee} — {item.category}</div>
              <div className="text-sm text-gray-600">{item.amount} {item.currency} — {item.date}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => act(item.id, 'Approved')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              <button onClick={() => act(item.id, 'Rejected')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## FILE: src/services/api.js
```js
import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

// Example wrapper methods (stubs)
export async function fetchCurrencies() {
  // call restcountries or other
  return []
}

export async function convertCurrency(base) {
  // call exchangerate API
  return {}
}

export default API
```

---

## FILE: src/utils/currency.js
```js
// small helper: convert to company currency using a rates map
export function convertAmount(amount, from, to, rates) {
  if (from === to) return amount
  if (!rates || !rates[from] || !rates[to]) return amount
  // assume rates are base USD-like, implement appropriately
  return (amount / rates[from]) * rates[to]
}
```

---

## FILE: README.md
```md
# Expense Management - Frontend Starter

## Quick start
1. Create a new project folder and paste files as shown.
2. `npm install`
3. `npm run dev`

This starter includes:
- React + Vite
- Tailwind CSS
- Simple AuthContext with mock users
- Pages: Login, Employee/Manager/Admin dashboards
- Components: ExpenseForm, ApprovalList
- Service stubs for API and currency conversion

Next steps (recommended):
- Replace mock auth and mock data with real backend API calls.
- Implement role-based routing and protected API endpoints.
- Integrate the RestCountries API and ExchangeRate API for real currencies.
- Add OCR integration: use an OCR service endpoint to accept uploads and return parsed fields.
- Implement Approval rule engine endpoints on server side and reflect in UI with status propagation.

```

---

End of starter scaffold. Copy the sections into files in your project workspace and run `npm install` followed by `npm run dev`.

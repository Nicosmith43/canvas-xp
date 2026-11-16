import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Store from './pages/Store';
import Profile from './pages/Profile';
import Games from './pages/Games';
import Inventory from './pages/Inventory';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-unc-gold/30">
            <Navbar />
            <main className="pt-24 pb-12">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/store"
                  element={
                    <RequireAuth>
                      <Store />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/games"
                  element={
                    <RequireAuth>
                      <Games />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <RequireAuth>
                      <Inventory />
                    </RequireAuth>
                  }
                />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

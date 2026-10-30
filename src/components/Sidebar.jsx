import React from 'react';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, X } from 'lucide-react';

export default function Sidebar({ activeMenu, setActiveMenu, isOpen, onClose, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo-area" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="logo-icon">N</div>
            <h2>NexusDash</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: isOpen ? 'block' : 'none' }}>
            <X size={20} />
          </button>
        </div>

        <nav className="nav-menu">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => { setActiveMenu(item.id); if (onClose) onClose(); }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {/* Logout button now triggers the function passed from App.jsx */}
          <button className="nav-item logout" onClick={onLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ChartWidget from './components/ChartWidget';
import Login from './components/Login';
import { initialRevenueData, initialTransactions, initialMessages, mockAddTransaction } from './data/mockData';
import { 
  Search, Bell, Moon, Sun, Menu, LogOut, User, Settings, 
  PlusCircle, Trash2, Shield, MessageSquare, MapPin, 
  Briefcase, Send, Palette, Edit2, Undo2, Camera, DollarSign, Users, ShoppingBag, Activity 
} from 'lucide-react';

function App() {
  // --- Auth States ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // --- Data States with Local Storage Persistence ---
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('nexus_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('nexus_customers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active" },
      { id: 3, name: "Robert Brown", email: "robert@example.com", status: "Inactive" }
    ];
  });

  const [messages, setMessages] = useState(initialMessages);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- UI States ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [hasNewNotif, setHasNewNotif] = useState(true);

  // --- CRUD Modal & Undo States ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItemType, setEditItemType] = useState(''); 
  const [editFormData, setEditFormData] = useState({});
  const [deletedItem, setDeletedItem] = useState(null);
  
  // FIX: Use useRef to store the timeout ID to prevent overlapping timers
  const undoTimeoutRef = useRef(null);

  // --- Form States (Create) ---
  const [newUser, setNewUser] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newStatus, setNewStatus] = useState('Success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');

  // --- Profile & Settings States ---
  const [profileImage, setProfileImage] = useState(''); 
  const [profileData, setProfileData] = useState({
    firstName: 'Alex', lastName: 'Carter', email: 'alex@example.com', phone: '+1 234 567 890',
    birthday: '1990-01-01', gender: 'Male', address: '123 Main St', city: 'New York', state: 'NY', zip: '10001',
    bio: 'Hi, I am Alex. I manage this dashboard.'
  });

  const [dashboardPrefs, setDashboardPrefs] = useState({
    emailAlerts: true, weeklyReport: false, twoFactorAuth: true
  });

  const themes = [
    { id: 'default', name: 'Purple Night', class: 'theme-purple' },
    { id: 'ocean', name: 'Ocean Blue', class: 'theme-ocean' },
    { id: 'forest', name: 'Forest Green', class: 'theme-forest' },
    { id: 'sunset', name: 'Sunset Orange', class: 'theme-sunset' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', class: 'theme-cyberpunk' },
    { id: 'rose', name: 'Rose Gold', class: 'theme-rose' }
  ];

  // --- Effects ---
  useEffect(() => {
    if (isDarkMode) document.body.classList.remove('light-mode');
    else document.body.classList.add('light-mode');
    if (currentTheme === 'default') document.body.removeAttribute('data-theme');
    else document.body.setAttribute('data-theme', currentTheme);
  }, [isDarkMode, currentTheme]);

  useEffect(() => {
    localStorage.setItem('nexus_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('nexus_customers', JSON.stringify(customers));
  }, [customers]);

  // --- Handlers ---
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setProfileData({ ...profileData, firstName: user.name.split(' ')[0], lastName: user.name.split(' ')[1] || '', email: user.email });
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveMenu('dashboard');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!newUser || !newAmount) return;
    setIsSubmitting(true);
    const newData = {
      user: newUser, email: `${newUser.toLowerCase().replace(/\s/g, '')}@example.com`,
      amount: `$${parseFloat(newAmount).toFixed(2)}`, status: newStatus,
      date: new Date().toISOString().split('T')[0]
    };
    try {
      const savedData = await mockAddTransaction(newData);
      setTransactions([savedData, ...transactions]);
      setNewUser(''); setNewAmount(''); setNewStatus('Success');
      setHasNewNotif(true); setShowNotif(true);
    } finally { setIsSubmitting(false); }
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustName || !newCustEmail) return;
    const newCust = { id: Date.now(), name: newCustName, email: newCustEmail, status: "Active" };
    setCustomers([...customers, newCust]);
    setNewCustName(''); setNewCustEmail('');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if(!newMessageText.trim()) return;
    const newMsg = {
      id: Date.now(), sender: "You (Admin)", text: newMessageText, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), isRead: true
    };
    setMessages([newMsg, ...messages]);
    setNewMessageText('');
    alert('Message Sent!');
  };

  const openEditModal = (type, item) => {
    setEditItemType(type);
    setEditFormData(item);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (editItemType === 'customer') {
      setCustomers(customers.map(c => c.id === editFormData.id ? editFormData : c));
    } else if (editItemType === 'transaction') {
      setTransactions(transactions.map(t => t.id === editFormData.id ? editFormData : t));
    }
    setIsEditModalOpen(false);
    setEditFormData({});
  };

  // FIX: Handle Delete with clearTimeout to prevent timer overlaps
  const handleDelete = (type, item) => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
    
    setDeletedItem({ type, item }); 
    if (type === 'customer') {
      setCustomers(customers.filter(c => c.id !== item.id));
    } else if (type === 'transaction') {
      setTransactions(transactions.filter(t => t.id !== item.id));
    }
    
    undoTimeoutRef.current = setTimeout(() => {
      setDeletedItem(null);
    }, 5000);
  };

  const handleUndoDelete = () => {
    if (!deletedItem) return;
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    const { type, item } = deletedItem;
    if (type === 'customer') {
      setCustomers(prev => [item, ...prev]);
    } else if (type === 'transaction') {
      setTransactions(prev => [item, ...prev]);
    }
    setDeletedItem(null); 
  };

  // Main Content Renderer
  const renderContent = () => {
    switch(activeMenu) {
      case 'dashboard':
        return (
          <>
            <div className="page-header">
              <div>
                <h1>Welcome back, {isLoggedIn ? profileData.firstName : 'Guest'} 👋</h1>
                <p>Here is your business summary for today.</p>
              </div>
              <button className="btn-primary" onClick={() => setActiveMenu('transactions')}>
                <PlusCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }}/> 
                Add Transaction
              </button>
            </div>

            <div className="stats-grid">
              <StatCard 
                title="Total Revenue" 
                value={`$${transactions.filter(t => t.status === 'Success').reduce((acc, curr) => acc + parseFloat(curr.amount.replace('$', '').replace(',', '')), 0).toLocaleString()}`} 
                change="12.5%" 
                isPositive={true} 
                icon={<DollarSign size={24} color="var(--primary)" />}
              />
              <StatCard 
                title="Active Users" 
                value="2,340" 
                change="3.2%" 
                isPositive={true} 
                icon={<Users size={24} color="#10b981" />}
              />
              <StatCard 
                title="New Orders" 
                value={transactions.length.toString()} 
                change="1.5%" 
                isPositive={false} 
                icon={<ShoppingBag size={24} color="#f59e0b" />}
              />
              <StatCard 
                title="Churn Rate" 
                value="1.2%" 
                change="0.4%" 
                isPositive={true} 
                icon={<Activity size={24} color="#ef4444" />}
              />
            </div>

            <div className="main-grid">
              <ChartWidget data={initialRevenueData} />
              
              <div className="table-widget">
                <div className="widget-header">
                  <h3>Recent Transactions</h3>
                  <button className="text-btn" onClick={() => setActiveMenu('transactions')}>View All</button>
                </div>
                <div className="table-responsive">
                  <table className="modern-table">
                    <thead>
                      <tr><th>User</th><th>Amount</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 4).map((t) => (
                        <tr key={t.id}>
                          <td>
                            <div className="user-cell">
                              <div className="avatar-sm" style={{ background: 'var(--primary)', color: 'white' }}>{t.user.charAt(0)}</div>
                              <div>
                                <p className="font-bold">{t.user}</p>
                                <p className="text-muted text-sm">{t.date}</p>
                              </div>
                            </div>
                          </td>
                          <td className="font-bold">{t.amount}</td>
                          <td><span className={`badge ${t.status.toLowerCase()}`}>{t.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        );

      case 'customers':
        return (
          <>
            <div className="page-header"><h1>Customers</h1><p>Manage your client database.</p></div>
            <div className="main-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-widget">
                <h3 style={{ marginBottom: '15px' }}><PlusCircle size={18} style={{ display: 'inline', marginRight: '8px' }}/> Add New Customer</h3>
                <form onSubmit={handleAddCustomer} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '200px', margin: 0 }}>
                    <label>Customer Name</label>
                    <input type="text" className="form-control" value={newCustName} onChange={(e) => setNewCustName(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '200px', margin: 0 }}>
                    <label>Email Address</label>
                    <input type="email" className="form-control" value={newCustEmail} onChange={(e) => setNewCustEmail(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn-primary">Add Customer</button>
                </form>
              </div>
              <div className="table-widget">
                <h3>Customer List</h3>
                <div className="table-responsive">
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {customers.map((c) => (
                        <tr key={c.id}>
                          <td className="font-bold">{c.name}</td>
                          <td className="text-muted">{c.email}</td>
                          <td><span className={`badge ${c.status === 'Active' ? 'success' : 'failed'}`}>{c.status}</span></td>
                          <td>
                            <button className="action-btn" onClick={() => openEditModal('customer', c)} title="Edit">
                              <Edit2 size={16} style={{ color: 'var(--accent)' }} />
                            </button>
                            <button className="action-btn delete" onClick={() => handleDelete('customer', c)} title="Delete">
                              <Trash2 size={16}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        );

      case 'transactions':
        return (
          <>
            <div className="page-header"><h1>Transactions</h1><p>Manage business data.</p></div>
            <div className="main-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-widget">
                <h3 style={{ marginBottom: '15px' }}><PlusCircle size={18} style={{ display: 'inline', marginRight: '8px' }}/> Add New Data</h3>
                <form onSubmit={handleAddTransaction} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
                    <label>Customer Name</label><input type="text" className="form-control" value={newUser} onChange={(e) => setNewUser(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
                    <label>Amount ($)</label><input type="number" className="form-control" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '150px', margin: 0 }}>
                    <label>Status</label>
                    <select className="form-control" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="Success">Success</option><option value="Pending">Pending</option><option value="Failed">Failed</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Add Data'}</button>
                </form>
              </div>
              <div className="table-widget">
                <h3>Data History</h3>
                <div className="table-responsive">
                  <table>
                    <thead><tr><th>User</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {transactions.filter(t => t.user.toLowerCase().includes(searchQuery.toLowerCase())).map((t) => (
                        <tr key={t.id}>
                          <td>{t.user}</td><td>{t.date}</td><td>{t.amount}</td>
                          <td><span className={`badge ${t.status.toLowerCase()}`}>{t.status}</span></td>
                          <td>
                            <button className="action-btn" onClick={() => openEditModal('transaction', t)} title="Edit">
                              <Edit2 size={16} style={{ color: 'var(--accent)' }} />
                            </button>
                            <button className="action-btn delete" onClick={() => handleDelete('transaction', t)} title="Delete">
                              <Trash2 size={16}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        );

      case 'messages':
        return (
          <>
            <div className="page-header"><h1>Messages</h1><p>Inbox and communication center.</p></div>
            <div className="main-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
              <div className="table-widget">
                <h3>Inbox ({messages.length})</h3>
                <div className="message-list">
                  {messages.map(m => (
                    <div className="message-item" key={m.id}>
                      <div className="message-avatar">{m.sender.charAt(0)}</div>
                      <div className="message-content">
                        <h4>{m.sender} {!m.isRead && <span style={{color: 'var(--primary)', fontSize:'10px'}}>● New</span>}</h4>
                        <p>{m.text}</p>
                        <span className="time">{m.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-widget">
                <h3>Send Message</h3>
                <form onSubmit={handleSendMessage} style={{ marginTop: '15px' }}>
                  <div className="form-group">
                    <label>To:</label>
                    <input type="text" className="form-control" placeholder="Select or type recipient" disabled value="Customer Support / User" />
                  </div>
                  <div className="form-group">
                    <label>Message:</label>
                    <textarea className="form-control" rows="5" placeholder="Type your reply here..." value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} required></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                    <Send size={16}/> Send Message
                  </button>
                </form>
              </div>
            </div>
          </>
        );

      case 'my-profile':
        return (
          <>
            <div className="page-header"><h1>My Profile</h1><p>Manage your personal information and preferences.</p></div>
            <div className="profile-layout">
              {/* Left Column */}
              <div>
                <div className="profile-card">
                  <div className="profile-avatar-container">
                    <div className="profile-avatar-lg">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="avatar-img" />
                      ) : (
                        profileData.firstName.charAt(0)
                      )}
                      
                      <label htmlFor="avatar-upload" className="avatar-upload-label" title="Change Photo">
                        <Camera size={20} />
                        <input 
                          id="avatar-upload" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          style={{ display: 'none' }} 
                        />
                      </label>
                    </div>
                  </div>

                  <h2>{profileData.firstName} {profileData.lastName}</h2>
                  <p className="role"><Briefcase size={14} style={{display:'inline', marginRight:'5px'}}/> Senior Software Engineer</p>
                  <p className="location"><MapPin size={14} style={{display:'inline', marginRight:'5px'}}/> {profileData.city}, {profileData.state}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '10px' }}>{profileData.bio}</p>
                </div>

                <div className="form-widget" style={{ marginTop: '20px' }}>
                  <h3>Dashboard Preferences</h3>
                  <div style={{ marginTop: '15px' }}>
                    <div className="toggle-row">
                      <div><p className="toggle-label">Email Alerts</p></div>
                      <label className="switch"><input type="checkbox" checked={dashboardPrefs.emailAlerts} onChange={() => setDashboardPrefs({...dashboardPrefs, emailAlerts: !dashboardPrefs.emailAlerts})} /><span className="slider"></span></label>
                    </div>
                    <div className="toggle-row">
                      <div><p className="toggle-label">Weekly Report</p></div>
                      <label className="switch"><input type="checkbox" checked={dashboardPrefs.weeklyReport} onChange={() => setDashboardPrefs({...dashboardPrefs, weeklyReport: !dashboardPrefs.weeklyReport})} /><span className="slider"></span></label>
                    </div>
                    <div className="toggle-row">
                      <div><p className="toggle-label">Two-Factor Auth</p></div>
                      <label className="switch"><input type="checkbox" checked={dashboardPrefs.twoFactorAuth} onChange={() => setDashboardPrefs({...dashboardPrefs, twoFactorAuth: !dashboardPrefs.twoFactorAuth})} /><span className="slider"></span></label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Column */}
              <div className="form-widget">
                <h3>General Information</h3>
                <br/>
                <div className="form-row-2-col">
                  <div className="form-group"><label>First Name</label><input type="text" className="form-control" value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} /></div>
                  <div className="form-group"><label>Last Name</label><input type="text" className="form-control" value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} /></div>
                  <div className="form-group"><label>Birthday</label><input type="date" className="form-control" value={profileData.birthday} onChange={e => setProfileData({...profileData, birthday: e.target.value})} /></div>
                  <div className="form-group"><label>Gender</label><select className="form-control" value={profileData.gender} onChange={e => setProfileData({...profileData, gender: e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div>
                  <div className="form-group"><label>Email</label><input type="email" className="form-control" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} /></div>
                  <div className="form-group"><label>Phone</label><input type="text" className="form-control" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} /></div>
                </div>

                <h3 style={{ marginTop: '20px' }}>Address</h3>
                <br/>
                <div className="form-group"><label>Address</label><input type="text" className="form-control" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} /></div>
                <div className="form-row-3-col">
                  <div className="form-group"><label>City</label><input type="text" className="form-control" value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})} /></div>
                  <div className="form-group"><label>State</label><input type="text" className="form-control" value={profileData.state} onChange={e => setProfileData({...profileData, state: e.target.value})} /></div>
                  <div className="form-group"><label>ZIP</label><input type="text" className="form-control" value={profileData.zip} onChange={e => setProfileData({...profileData, zip: e.target.value})} /></div>
                </div>
                
                <div className="form-group" style={{ marginTop: '15px' }}><label>Bio (About Me)</label><textarea className="form-control" rows="3" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})}></textarea></div>

                <button className="btn-primary" style={{ marginTop: '10px' }} onClick={() => alert('Profile successfully saved!')}>Save All Changes</button>
              </div>

              {/* Right Column */}
              <div className="form-widget">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Recent Chats</h3>
                  <button className="btn-primary" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => setActiveMenu('messages')}>See All</button>
                </div>
                <div className="message-list" style={{ marginTop: '20px' }}>
                  {messages.slice(0, 3).map(m => (
                    <div className="message-item" key={m.id} style={{ paddingBottom: '10px', marginBottom: '10px' }}>
                      <div className="message-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>{m.sender.charAt(0)}</div>
                      <div className="message-content">
                        <h4 style={{ fontSize: '13px' }}>{m.sender}</h4>
                        <p style={{ fontSize: '12px' }}>{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                   <input type="text" className="form-control" placeholder="Quick reply..." value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} required style={{ padding: '8px' }} />
                   <button type="submit" className="btn-primary" style={{ padding: '0 15px', display: 'flex', alignItems: 'center' }}><Send size={16}/></button>
                </form>
              </div>
            </div>
          </>
        );

      case 'account-settings':
        return (
          <>
            <div className="page-header"><h1>Account Settings</h1><p>Manage your account security.</p></div>
            <div className="form-widget" style={{ maxWidth: '600px' }}>
              <h3><Shield size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> Security & Authentication</h3>
              <br/>
              <div className="form-group"><label>Current Password</label><input type="password" className="form-control" placeholder="Enter current password" /></div>
              <div className="form-group"><label>New Password</label><div className="password-wrapper"><input type="password" className="form-control" placeholder="Enter new password" /></div></div>
              <div className="form-group"><label>Confirm New Password</label><input type="password" className="form-control" placeholder="Confirm new password" /></div>
              <button className="btn-primary" onClick={() => alert('Password Updated Successfully!')}>Update Password</button>
            </div>
          </>
        );

      case 'settings':
        return (
          <>
            <div className="page-header"><h1>App Settings</h1><p>Customize dashboard appearance.</p></div>
            <div className="form-widget" style={{ maxWidth: '800px' }}>
              <h3><Palette size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> Appearance</h3>
              <p className="text-muted text-sm" style={{ marginTop: '5px', marginBottom: '5px' }}>Select a color palette for the dashboard.</p>
              
              <div className="theme-grid">
                {themes.map((theme) => (
                  <div 
                    key={theme.id}
                    className={`theme-circle ${theme.class} ${currentTheme === theme.id ? 'active' : ''}`} 
                    onClick={() => setCurrentTheme(theme.id)} 
                    title={theme.name} 
                  />
                ))}
              </div>

              <h3>System Preferences</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <p className="font-bold">Email Notifications</p>
                  <p className="text-muted text-sm">Receive alerts when new data arrives.</p>
                </div>
                <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
              </div>
            </div>
          </>
        );

      default: 
        return <div className="page-header"><h1>Page not found</h1></div>;
    }
  }

  return (
    <div className="app-container" onClick={() => { setShowNotif(false); setShowProfile(false); }}>
      
      {showAuthModal && <Login onLogin={handleLogin} onClose={() => setShowAuthModal(false)} />}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />
      
      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <button className="menu-toggle" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }}><Menu size={24} /></button>
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div className="topbar-actions" onClick={e => e.stopPropagation()}>
            <button className="icon-btn" onClick={() => setIsDarkMode(!isDarkMode)} title="Toggle Dark/Light Mode">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div style={{ position: 'relative' }}>
              <button className="icon-btn" onClick={() => { setShowNotif(!showNotif); setHasNewNotif(false); }}>
                <Bell size={20} />
                {hasNewNotif && <span className="notif-dot"></span>}
              </button>
              {showNotif && (
                <div className="dropdown-menu">
                   <div style={{ padding: '5px 10px', fontWeight: 'bold', borderBottom: '1px solid var(--border)', marginBottom: '5px' }}>Notifications</div>
                   {hasNewNotif ? <div className="notif-item">🔔 You have new data coming in!</div> : <div className="notif-item text-muted">No new notifications</div>}
                </div>
              )}
            </div>
            {!isLoggedIn ? (
              <button className="login-btn-topbar" onClick={() => setShowAuthModal(true)}>Login / Register</button>
            ) : (
              <div style={{ position: 'relative' }}>
                <div className="profile-avatar" onClick={() => setShowProfile(!showProfile)}>
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="avatar-img" />
                  ) : (
                    profileData.firstName.charAt(0)
                  )}
                </div>
                {showProfile && (
                  <div className="dropdown-menu" style={{ right: 0 }}>
                    <div className="dropdown-item" onClick={() => { setActiveMenu('my-profile'); setShowProfile(false); }}><User size={16} /> My Profile</div>
                    <div className="dropdown-item" onClick={() => { setActiveMenu('messages'); setShowProfile(false); }}><MessageSquare size={16} /> Messages</div>
                    <div className="dropdown-item" onClick={() => { setActiveMenu('account-settings'); setShowProfile(false); }}><Shield size={16} /> Account Settings</div>
                    <hr style={{ borderColor: 'var(--border)', margin: '8px 0' }} />
                    <div className="dropdown-item" style={{ color: 'var(--danger)' }} onClick={handleLogout}><LogOut size={16} /> Logout</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="content-wrapper">
          {renderContent()}
        </div>

        {isEditModalOpen && (
          <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit {editItemType === 'customer' ? 'Customer' : 'Transaction'}</h3>
                <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>&times;</button>
              </div>
              <form onSubmit={handleUpdate}>
                {editItemType === 'customer' ? (
                  <>
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" className="form-control" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" className="form-control" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} required />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>User</label>
                      <input type="text" className="form-control" value={editFormData.user} onChange={e => setEditFormData({...editFormData, user: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Amount ($)</label>
                      <input type="text" className="form-control" value={editFormData.amount} onChange={e => setEditFormData({...editFormData, amount: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select className="form-control" value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})}>
                        <option value="Success">Success</option><option value="Pending">Pending</option><option value="Failed">Failed</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="modal-actions">
                  <button type="button" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border)' }} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deletedItem && (
          <div className="toast-container">
            <p className="toast-msg">Item deleted.</p>
            <button className="toast-btn" onClick={handleUndoDelete}><Undo2 size={14} style={{ marginRight: '5px' }} /> Undo</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
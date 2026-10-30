import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';

export default function Login({ onLogin, onClose }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      // Simulate successful login
      onLogin({ name: isLoginMode ? 'Alex Carter' : name, email });
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      {/* stopPropagation so clicking inside the box doesn't close the modal */}
      <div className="auth-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-auth" onClick={onClose}><X size={24} /></button>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div className="logo-icon" style={{ width: '48px', height: '48px', fontSize: '24px' }}>N</div>
        </div>
        <h2>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" className="form-control" style={{ paddingLeft: '35px' }} placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" className="form-control" style={{ paddingLeft: '35px' }} placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <Lock size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control" 
                style={{ paddingLeft: '35px', paddingRight: '40px' }} 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            {isLoginMode ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch">
          {isLoginMode ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? 'Register' : 'Login'}
          </span>
        </div>
      </div>
    </div>
  );
}
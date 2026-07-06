import { useState } from 'react';
import axios from 'axios';
import { Lock, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Settings() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match!' });
            return;
        }
        
        if (passwords.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo?.token;
            await axios.put('http://localhost:5001/api/auth/change-password', 
                {
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            setMessage({ type: 'success', text: 'Password updated successfully! Please login again.' });
            
            // Clear form
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            
            // Logout user after changing password for security
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 3000);
            
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to change password. Please check your current password.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
            <div className="form-card" style={{ maxWidth: '450px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)', marginBottom: '1rem' }}>
                        <SettingsIcon size={32} style={{ color: 'var(--primary)' }} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Account Settings</h1>
                    <p style={{ color: '#a1a1aa' }}>Change your password</p>
                </div>

                {message.text && (
                    <div style={{ 
                        padding: '12px', 
                        borderRadius: '8px', 
                        marginBottom: '1.5rem', 
                        textAlign: 'center',
                        background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: message.type === 'error' ? '#ef4444' : '#22c55e',
                        border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="input-group">
                        <label className="input-label">Current Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type="password"
                                className="form-input" 
                                placeholder="Enter current password" 
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">New Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type="password"
                                className="form-input" 
                                placeholder="Create new password" 
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Confirm New Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input 
                                type="password"
                                className="form-input" 
                                placeholder="Confirm new password" 
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={loading}
                        style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Settings;

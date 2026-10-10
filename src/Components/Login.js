import React, { useState } from 'react';
import { saveUser, loginUser, getUsers } from '../utils/authStorage';
import { useNavigate } from 'react-router-dom';

const MailIcon = () => <span className="text-xl mr-2">📧</span>;
const LockIcon = () => <span className="text-xl mr-2">🔒</span>;
const UserIcon = () => <span className="text-xl mr-2">👤</span>;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (!name) return alert('Please enter your name');
      if (!email) return alert('Please enter your email');
      if (password !== confirmPassword) return alert('Passwords do not match');
      const existing = getUsers();
      const exists = existing.find(u => u.email === email);
      if (exists) return alert('A user with this email already exists. Please login.');
      saveUser({ name, email, password });
      alert('Signup successful! Now login.');
      setIsLogin(true);
      setName('');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    const user = loginUser(email, password);
    if (user) {
      alert(`Welcome back, ${user.name || 'User'}!`);
      navigate('/');
    } else {
      alert('Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{isLogin ? 'Welcome Back!' : 'Join the Community'}</h1>
        <p className="text-gray-500 mb-6">{isLogin ? 'Sign in to access your saved recipes.' : 'Create your account to submit recipes.'}</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <UserIcon />
              <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} className="outline-none flex-1" />
            </div>
          )}

          <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <MailIcon />
            <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="outline-none flex-1" />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <LockIcon />
            <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="outline-none flex-1" />
          </div>

          {!isLogin && (
            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <LockIcon />
              <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="outline-none flex-1" />
            </div>
          )}

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg mt-2">
            {isLogin ? 'Login to Monsoon Hub' : 'Create Account'}
          </button>
        </form>

        <p className="text-gray-500 mt-4 text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleMode} className="text-orange-500 font-semibold hover:text-orange-600 underline ml-1">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

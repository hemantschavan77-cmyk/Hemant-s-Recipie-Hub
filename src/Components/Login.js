import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/authStorage';
import api from '../api/axios';

const MailIcon = () => <span className="text-xl mr-2">📧</span>;
const LockIcon = () => <span className="text-xl mr-2">🔒</span>;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isLogin) {
      const response = await api.post("/api/users/login", {
        email,
        password,
      });

      const token = response.data.token;

      if (!token) {
        return alert("Login failed. The server did not return a token.");
      }

      saveToken(token);

      alert("Login successful!");
      navigate("/");
    } else {
      await api.post("/api/users/register", {
        email,
        password,
      });

      alert(
        "Registration successful! Please verify your email before logging in."
      );

      setIsLogin(true);
      setPassword("");
      setEmail("");
    }
  } catch (error) {
    const responseData = error.response?.data;

    const message =
      typeof responseData === "string"
        ? responseData
        : responseData?.message ||
          responseData?.error ||
          "Something went wrong. Please try again.";

    alert(message);
  }
};

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{isLogin ? 'Welcome Back!' : 'Join the Community'}</h1>
        <p className="text-gray-500 mb-6">{isLogin ? 'Sign in to access your saved recipes.' : 'Create your account to submit recipes.'}</p>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <MailIcon />
            <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="outline-none flex-1" />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <LockIcon />
            <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="outline-none flex-1" />
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg mt-2">
            {isLogin ? 'Login to Recipe Hub' : 'Create Account'}
          </button>
        </form>

        <p className="text-gray-500 mt-4 text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" onClick={toggleMode} className="text-orange-500 font-semibold hover:text-orange-600 underline ml-1">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

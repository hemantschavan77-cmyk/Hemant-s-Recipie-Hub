import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../utils/authStorage';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MailIcon = () => <span className="text-xl mr-2">📧</span>;
const LockIcon = () => <span className="text-xl mr-2">🔒</span>;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setRegistrationMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRegistrationMessage("");

    try {
      if (isLogin) {
        const response = await api.post("/api/users/login", {
          email,
          password,
        });

        const token = response.data.token;

        if (!token) {
          toast.error("Login failed. The server did not return a token.");
          return;
        }

        saveToken(token);

        toast.success("Login successful!");
        navigate("/");
      } else {
        await api.post("/api/users/register", {
          email,
          password,
        });

        setRegistrationMessage(
          "Registration successful! A verification link has been sent to your email. Please check your inbox and spam folder before logging in."
        );

        setIsLogin(true);
        setPassword("");
      }
    } catch (error) {
      const responseData = error.response?.data;

      const message =
        typeof responseData === "string"
          ? responseData
          : responseData?.message ||
          responseData?.error ||
          "Something went wrong. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{isLogin ? 'Welcome Back!' : 'Join the Community'}</h1>
        <p className="text-gray-500 mb-6">{isLogin ? 'Sign in to access your saved recipes.' : 'Create your account to submit recipes.'}</p>
        {registrationMessage && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            <p className="font-semibold mb-1">
              Email Verification Required
            </p>

            <p>{registrationMessage}</p>
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>

          <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <MailIcon />
            <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="outline-none flex-1" />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg p-3">
            <LockIcon />
            <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="outline-none flex-1" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? isLogin
                ? "Logging In..."
                : "Creating Account..."
              : isLogin
                ? "Login to Recipe Hub"
                : "Create Account"}
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

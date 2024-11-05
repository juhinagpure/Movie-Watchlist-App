import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../features/userSlice';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const error = useSelector((state) => state.user.error);

  const handleSignUp = () => {
    dispatch(signupUser({ name, email }));
    
    if (!error) {
      navigate('/login');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border px-4 py-20 text-gray-700 shadow-lg sm:px-8">
      <p className="mb-5 text-2xl font-medium text-center">Sign Up If You Are New Here!</p>
      <div className="my-6">
        <div className="focus-within:border-b-blue-500 relative mb-3 flex overflow-hidden border-b-2 transition">
          <input 
            required
            type="text" 
            className="w-full flex-1 appearance-none border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="focus-within:border-b-blue-500 relative mb-3 flex overflow-hidden border-b-2 transition">
          <input 
            required
            type="email" 
            className="w-full flex-1 appearance-none border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <button 
        className="mb-6 rounded-md bg-blue-600 px-8 py-1 font-medium text-white hover:bg-blue-700 w-full"
        onClick={handleSignUp}
      >
        Get Started
      </button>
      <div className="flex justify-center">
        <span>Have an account? 
          <Link to='/login' className="ml-2 text-blue-600 hover:underline">Log in</Link>
        </span>
      </div>
    </div>
  );
};

export default SignUp;

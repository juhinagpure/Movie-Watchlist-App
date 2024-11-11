import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/userSlice';
import { FaBars, FaTimes } from 'react-icons/fa';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.users.find((u) => u.email === state.user.currentUser));
  const recentMovies = user?.recentlyViewedMovies || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results/${searchTerm}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="flex">
      {/* Sidebar for watchlists */}
      <div className={`fixed inset-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-1/6 bg-slate-100 p-4 min-h-screen`}>
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Your Watchlists</h2>
        <ul className='h-4/5 mt-10 overflow-auto'>
          {user?.watchlists && Object.keys(user.watchlists).map((list) => (
            <li
              key={list}
              className="cursor-pointer text-stone-600 text-lg font-medium my-2 text-center border-2 border-slate-400 rounded-lg"
              onClick={() => {
                setIsSidebarOpen(false);
                navigate(`/watchlist/${list}`);
              }}
            >
              {list}
            </li>
          ))}
        </ul>
        <div className='flex pt-4'>
          <div className='w-4/5 rounded-sm flex items-center'>
            <div className='rounded-full bg-stone-500 h-8 w-8 text-white font-semibold text-xl text-center'>{user?.name?.at(0)}</div>
            <span className='ms-2 text-lg'>{user?.name}</span>
          </div>
          <button
            className="text-red-500 font-bold hover:underline ms-5"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center px-10 pt-10 w-full lg:w-5/6 lg:ml-auto">
        <header className="w-full">
        <button className="text-blue-600 lg:hidden mb-10" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-center">Welcome to Your Movie Watchlist</h1>
          {/* Toggle Sidebar Icon for mobile */}
          
        </header>
        
        <p className="text-md md:text-xl lg:text-2xl text-center mt-4 lg:mt-6">Track and organize movies you want to watch!</p>

        <form onSubmit={handleSearch} className="mt-10 w-full max-w-2xl mx-auto flex items-center">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-l-lg"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-lg">Search</button>
        </form>

        {recentMovies.length > 0 && (
          <div className="mt-20 w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center">Recently Viewed Movies</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {recentMovies.map((movie) => (
                <div key={movie.imdbID} className="w-1/3 md:w-1/5 p-2 cursor-pointer" onClick={() => navigate(`/movie/${movie.imdbID}`)}>
                  <img src={movie.Poster} alt={movie.Title} className="rounded-lg shadow-lg aspect-[3/4]" />
                  <p className="text-md mt-2 text-center">{movie.Title} ({movie.Year})</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

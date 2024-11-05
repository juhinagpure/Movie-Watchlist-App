import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWatchlist, createWatchlist } from '../features/userSlice';

const SearchResults = () => {
  const { query } = useParams();
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedWatchlists, setSelectedWatchlists] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.users.find((u) => u.email === state.user.currentUser));

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?s=${query}&apikey=${import.meta.env.VITE_API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.Response === "True") setMovies(data.Search);
        else setMovies([]);
      });
  }, [query]);

  const openModal = (movie) => {
    setSelectedMovie({ ...movie, id: movie.imdbID }); // Set `id` for consistency
    setSelectedWatchlists([]); // Reset selected watchlists
    setShowModal(true);
  };

  const handleWatchlistChange = (watchlist) => {
    setSelectedWatchlists((prev) =>
      prev.includes(watchlist) ? prev.filter((w) => w !== watchlist) : [...prev, watchlist]
    );
  };

  const addMovieToSelectedWatchlists = () => {
    selectedWatchlists.forEach((watchlist) => {
      dispatch(addToWatchlist({ category: watchlist, movie: selectedMovie }));
    });
    setShowModal(false);
  };

  const createNewWatchlist = () => {
    if (newWatchlistName) {
      dispatch(createWatchlist({ name: newWatchlistName }));
      setSelectedWatchlists([...selectedWatchlists, newWatchlistName]);
      setNewWatchlistName('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Search Results for "{query}"</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            onClick={() => navigate(`/movie/${movie.imdbID}`)}
            className="relative cursor-pointer bg-gray-100 rounded p-2 shadow-md"
          >
            <img src={movie.Poster} alt={movie.Title} className="mb-2" />
            <p className="text-sm font-semibold text-center">{movie.Title}</p>
            <button
              className="absolute top-2 right-2 text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                openModal(movie);
              }}
            >
              + Watchlist
            </button>
          </div>
        ))}
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add to Watchlist</h3>
            
            <div className="space-y-2 mb-4">
              {user?.watchlists && Object.keys(user.watchlists).map((list) => (
                <label key={list} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedWatchlists.includes(list)}
                    onChange={() => handleWatchlistChange(list)}
                    className="form-checkbox"
                  />
                  <span>{list}</span>
                </label>
              ))}
            </div>
            
            <input
              type="text"
              placeholder="New Watchlist Name"
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              className="w-full px-2 py-1 border rounded mb-2"
            />
            <button
              onClick={createNewWatchlist}
              className="text-sm text-blue-500 mb-4"
            >
              Create and Add
            </button>

            <div className="flex justify-end space-x-2">
              <button onClick={addMovieToSelectedWatchlists} className="px-4 py-2 bg-blue-500 text-white rounded">
                Add
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

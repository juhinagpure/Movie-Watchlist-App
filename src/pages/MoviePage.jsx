import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addMovieToRecent,
  addToWatchlist,
  createWatchlist,
} from "../features/userSlice";

const MoviePage = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [selectedWatchlists, setSelectedWatchlists] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);
  const user = useSelector((state) =>
    state.user.users.find((u) => u.email === currentUser)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(
      `https://www.omdbapi.com/?i=${imdbID}&apikey=${
        import.meta.env.VITE_API_KEY
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setMovie(data);
        if (currentUser) {
          dispatch(
            addMovieToRecent({
              Poster: data.Poster,
              Title: data.Title,
              Year: data.Year,
              imdbID: data.imdbID,
            })
          );
        }
      });
  }, [imdbID, currentUser, dispatch]);

  const openModal = () => {
    setSelectedWatchlists([]);
    setShowModal(true);
  };

  const handleWatchlistChange = (watchlist) => {
    setSelectedWatchlists((prev) =>
      prev.includes(watchlist)
        ? prev.filter((w) => w !== watchlist)
        : [...prev, watchlist]
    );
  };

  const addMovieToSelectedWatchlists = () => {
    selectedWatchlists.forEach((watchlist) => {
      dispatch(addToWatchlist({ category: watchlist, movie }));
    });
    setShowModal(false);
  };

  const createNewWatchlist = () => {
    if (newWatchlistName) {
      dispatch(createWatchlist({ name: newWatchlistName }));
      setSelectedWatchlists([...selectedWatchlists, newWatchlistName]);
      setNewWatchlistName("");
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-full mx-auto flex flex-wrap items-center justify-center">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="md:w-72 w-full object-cover shadow-lg rounded"
          />
          <div className="lg:w-3/5 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h1 className="text-4xl font-bold">{movie.Title}</h1>
            <p className="text-gray-600 mt-1">
              {movie.Year} • {movie.Genre} • {movie.Language}
            </p>
            <p className="text-lg text-gray-700 my-6">{movie.Plot}</p>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Director:</span>{" "}
                {movie.Director}
              </p>
              <p>
                <span className="font-semibold">Actors:</span> {movie.Actors}
              </p>
              <p>
                <span className="font-semibold">IMDb Rating:</span>{" "}
                {movie.imdbRating} ({movie.imdbVotes} votes)
              </p>
            </div>

            <div className="flex items-center mt-10 space-x-4">
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                View on IMDb
              </a>
              <button
                onClick={openModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add to Watchlist</h3>

            <div className="space-y-2 mb-4">
              {user?.watchlists &&
                Object.keys(user.watchlists).map((list) => (
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
              <button
                onClick={addMovieToSelectedWatchlists}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MoviePage;

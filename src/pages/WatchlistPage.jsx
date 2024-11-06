import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const WatchlistPage = () => {
  const { listName } = useParams();
  const user = useSelector((state) =>
    state.user.users.find((u) => u.email === state.user.currentUser)
  );
  const watchlistMovies = user?.watchlists[listName] || [];
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Watchlist: {listName}</h2>
      {watchlistMovies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchlistMovies.map((movie) => (
            <div
              key={movie.imdbID}
              className="cursor-pointer bg-gray-100 rounded p-2 shadow-md flex flex-col items-center"
              onClick={() => navigate(`/movie/${movie.imdbID}`)}
            >
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="mb-2 aspect-[3/4]"
              />
              <p className="text-sm font-semibold text-center">{movie.Title}</p>
              <p className="text-xs text-gray-500">{movie.Year}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies in this watchlist yet.</p>
      )}
    </div>
  );
};

export default WatchlistPage;

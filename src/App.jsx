import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MoviePage from "./pages/MoviePage";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/SignUp";
import SearchResults from "./pages/SearchResultsPage";
import WatchlistPage from "./pages/WatchlistPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/watchlist/:listName" element={<WatchlistPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-results/:query"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:imdbID"
          element={
            <ProtectedRoute>
              <MoviePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = (key, defaultValue) => JSON.parse(localStorage.getItem(key)) || defaultValue;
const saveToLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const initialState = {
  users: loadFromLocalStorage('users', []),
  currentUser: loadFromLocalStorage('currentUser', null),
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signupUser: (state, action) => {
      const { email, name } = action.payload;
      const userExists = state.users.some((user) => user.email === email);
      if (!userExists) {
        const newUser = {
          email,
          name,
          signedIn: true,
          watchlists: { default: [] },
          recentlyViewedMovies: [],
        };
        state.users.push(newUser);
        state.currentUser = email;
        saveToLocalStorage('users', state.users);
        saveToLocalStorage('currentUser', email);
      } else {
        state.error = "User already exists. Please log in.";
      }
    },

    loginUser: (state, action) => {
      const { email } = action.payload;
      const user = state.users.find((user) => user.email === email);

      if (user) {
        user.signedIn = true;
        state.currentUser = email;
        state.error = null;
        saveToLocalStorage('currentUser', email);
        saveToLocalStorage('users', state.users);
      } else {
        state.error = "User not found. Please sign up first.";
      }
    },

    logoutUser: (state) => {
      const user = state.users.find((user) => user.email === state.currentUser);
      if (user) user.signedIn = false;
      state.currentUser = null;
      state.error = null;
      localStorage.removeItem('currentUser');
      saveToLocalStorage('users', state.users);
    },

    addToWatchlist: (state, action) => {
      const { category, movie } = action.payload;
      const user = state.users.find((user) => user.email === state.currentUser);
      if (user) {
        if (!user.watchlists[category]) user.watchlists[category] = [];
        // Check if movie with the same imdbID exists
        if (!user.watchlists[category].some((item) => item.imdbID === movie.imdbID)) {
          user.watchlists[category].push(movie);
          saveToLocalStorage('users', state.users);
        }
      }
    },
    
    createWatchlist: (state, action) => {
      const { name } = action.payload;
      const user = state.users.find((user) => user.email === state.currentUser);
      if (user && !user.watchlists[name]) {
        user.watchlists[name] = [];
        saveToLocalStorage('users', state.users);
      }
    },

    addMovieToRecent: (state, action) => {
      const movie = action.payload;
      const user = state.users.find((user) => user.email === state.currentUser);

      if (user) {
        user.recentlyViewedMovies = user.recentlyViewedMovies.filter((m) => m.imdbID !== movie.imdbID);
        user.recentlyViewedMovies.unshift(movie);
        if (user.recentlyViewedMovies.length > 4) {
          user.recentlyViewedMovies.pop();
        }
        saveToLocalStorage('users', state.users);
      }
    },
  },
});

export const { signupUser, loginUser, logoutUser, addToWatchlist, createWatchlist, addMovieToRecent } = userSlice.actions;
export default userSlice.reducer;

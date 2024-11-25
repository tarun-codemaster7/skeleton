import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home({ user }) {
  const [movies, setMovies] = useState([]);
  const [movieName, setMovieName] = useState('');
  const [movieTime, setMovieTime] = useState('');

  useEffect(() => {
    if (user) {
      fetchMovies();
    }
  }, [user]);

  // Fetch movies from Supabase
  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase.from('movies').select('*');
      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching movies:', error.message);
    }
  };

  // Add movie to Supabase
  const addMovie = async () => {
    const newMovie = {
      name: movieName,
      time: movieTime,
    };

    try {
      const { data, error } = await supabase.from('movies').insert([newMovie]).select();
      if (error) throw error;
      setMovies((prev) => [...prev, ...data]);
      setMovieName('');
      setMovieTime('');
    } catch (error) {
      console.error('Error adding movie:', error.message);
    }
  };

  if (!user) {
    return <p className="text-center mt-20">Redirecting to login...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="container mx-auto p-5">
        {/* Welcome Message */}
        <p className="text-center mb-5">Welcome!</p>

        {/* Movie Form */}
        <div className="mb-5">
          <input
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            placeholder="Movie Name"
            className="p-2 m-2 border"
          />
          <input
            type="datetime-local"
            value={movieTime}
            onChange={(e) => setMovieTime(e.target.value)}
            className="p-2 m-2 border"
          />
          <button
            onClick={addMovie}
            className="bg-blue-500 text-white p-2 m-2"
          >
            Add Movie
          </button>
        </div>

        {/* Movie List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {movies.map((movie) => (
            <div key={movie.id} className="p-4 rounded shadow-md">
              <h3 className="font-bold">{movie.name}</h3>
              <p>{new Date(movie.time).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
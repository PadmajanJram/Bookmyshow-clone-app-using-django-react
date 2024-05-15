import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const user = useSelector(store => store.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate


  useEffect(() => {
    if (user && user.token) {
      fetchMovies();
    } else {
      console.error('User is not logged in.');
    }
  }, [user]);

  const fetchMovies = () => {
    axios.get('http://127.0.0.1:8000/movie/listmovie',{
      headers: { 'Authorization': "token " + user.token }
  })
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  };

  const BookingDetails = (movieId) => {
    navigate(`/booking/${movieId}`);
  };
  
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/movie/search_movies/${searchQuery}/`, {
        headers: { 'Authorization': "token " + user.token }
      });
      setMovies(response.data); // Set movies directly using setMovies()
    } catch (error) {
      console.error('Error fetching movies data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const search = async () => {
      if (searchQuery) {
        const searchedMovies = await handleSearch();
        setMovies(searchedMovies);
      } else {
        fetchMovies();
      }
    };

    search();
  }, [searchQuery]);


  return (
    <div className='Movie'>
      <Navbar/>
      <div className="container mt-5">
        <h2 className='text-white'>BOOK MY SHOW</h2>
        <div>
          <input type="text" placeholder="Search movie name" className="form-control" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className="row mt-4">
          {movies.map(movie => (
            <div key={movie.id} className="col-sm-4 mb-4">
              <div className="card book">
                <img src={movie.image} className="card-img-top" alt={movie.name} />
                <div className="card-body">
                  <h5 className="card-title">{movie.name}</h5>
                  <button className="btn btn-success" onClick={() => BookingDetails(movie.id)} disabled={movie.disabled}>
                        {movie.disabled ? 'Movie Disabled' : 'Book Ticket'}
                      </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c';
const API_URL = 'https://api.openweathermap.org/data/2.5/onecall';

const Grp204WeatherApp = () => {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: null,
    error: false,
  });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const formatDate = (date) => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ ...weather, loading: true });

      try {
        const response = await axios.get(API_URL, {
          params: {
            q: input,
            units: 'metric',
            appid: API_KEY,
          },
        });

        setWeather({
          data: response.data,
          loading: false,
          error: false,
        });
      } catch (error) {
        setWeather({ ...weather, data: null, error: true, loading: false });
      }
    }
  };

  const toggleFavorite = (city) => {
    if (favorites.includes(city)) {
      const updatedFavorites = favorites.filter((favorite) => favorite !== city);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const isFavorite = (city) => favorites.includes(city);

  return (
    <div className="App">
      <h1 className="app-name">Application Météo grp204</h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          name="query"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
        {weather.data && (
          <button className="favorite-btn" onClick={() => toggleFavorite(weather.data.name)}>
            <FontAwesomeIcon icon={isFavorite(weather.data.name) ? faHeartSolid : faHeartRegular} />
          </button>
        )}
      </div>
      {weather.loading && <div className="loading-spinner">Chargement...</div>}
      {weather.error && (
        <div className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>Ville introuvable</span>
        </div>
      )}
      {weather.data && (
        <div className="weather-info">
          <h2>{weather.data.name}, {weather.data.sys.country}</h2>
          <span>{formatDate(new Date())}</span>
          <img src='{https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png}' alt={weather.data.weather[0].description} />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
        </div>
      )}
      {weather.data && weather.data.daily && (
        <div className="forecast">
          <h3>Prévisions sur 5 jours</h3>
          <div className="forecast-items">
            {weather.data.daily.slice(1, 6).map((forecast, index) => (
              <div key={index} className="forecast-item">
                <span>{new Date(forecast.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                <img src='{https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png}' alt={forecast.weather[0].description} />
                <span>{Math.round(forecast.temp.day)}°C</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {favorites.length > 0 && (
        <div className="favorites">
          <h3>Mes Villes Favorites</h3>
          <div className="favorite-items">
            {favorites.map((favorite, index) => (
              <div key={index} className="favorite-item" onClick={() => setInput(favorite)}>
                {favorite}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Grp204WeatherApp;
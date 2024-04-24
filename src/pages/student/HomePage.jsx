import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GeneralLayout from '../../components/general/GeneralLayout';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import  './HomePage.css';
function HomePage() {
  const [contributions, setContributions] = useState([]);
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('');
  const [locationName, setLocationName] = useState('Fetching location...');
  const handleArticleClick = (title) => {
    navigate(`/student/readingPage/${encodeURIComponent(title)}`); // Navigate to reading page with the title as a parameter
  };
  const handleFacultyCLick = (faculty) => {
    navigate(`/student/homefaculty/${encodeURIComponent(faculty)}`); // Navigate to reading page with the title as a parameter
  };
  useEffect(() => {
    const getAllSelectedContributions = async () => {
      try {
        const response = await axios.get('https://localhost:7002/api/Contributions/get-all-selected-contributions');
        if (response.status === 200) {
          setContributions(response.data.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate)));
        }
      } catch (error) {
        console.error('Error fetching contributions:', error);
      }
    };

    const fetchWeatherAndLocation = async (lat, lon) => {
      const apiKey = "326df5ae5c6fb29594f0702406ee3874";
      const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=be2a379adbac7ad3c082a9b660b01157`;

      try {
        const response = await axios.get(weatherUrl);
        const currentWeather = response.data.current;
        setWeather({
          temp: currentWeather.temp,
          description: currentWeather.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`
        });
        const cityName = response.data.timezone.split('/').pop().replace(/_/g, ' '); // Replace underscores with spaces
        setLocationName(cityName); // Set the formatted city name // Using timezone as location name for simplicity
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLocationName('Unable to fetch location');
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          fetchWeatherAndLocation(position.coords.latitude, position.coords.longitude);
        }, error => {
          console.error('Geolocation error:', error);
          setLocationName('Location access denied. Displaying default weather.');
          fetchWeatherAndLocation(40.7128, -74.0060); // New York as default
        });
      } else {
        setLocationName('Geolocation not supported');
      }
    };

    getLocation();
    getAllSelectedContributions();
  }, []);

  // Separating contributions for display in headline and side headlines
  const mainHeadline = contributions[0];
  const sideHeadlines = contributions.slice(1, 4);
  const displayedIds = new Set([mainHeadline?.contributionId, ...sideHeadlines.map(h => h.contributionId)]);

  // Function to group contributions by faculty
  const facultyContributions = contributions
    .filter(con => !displayedIds.has(con.contributionId))
    .reduce((acc, con) => {
      acc[con.facultyName] = [...(acc[con.facultyName] || []), con];
      return acc;
    }, {});
  const formatTimeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });
  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}..`;
    } else {
      return text;
    }
  };

  return (
    <GeneralLayout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <div className="weather-widget w-1/4">
            <p className='text-xl font-bold mb-4'>Newest articles</p>
            <div className="location-weather rounded-md mr-4">
            <p>{locationName}</p>
              {weather && (
                <div>
                  <div className='flex'></div>
                  <img src={weather.icon} alt="Weather Icon" style={{ width: 50, height: 50 }} />
                  <p>Temperature: {(weather.temp - 273.15).toFixed(1)}°C</p>
                  <p>Weather: {weather.description}</p>
                </div>
              )}
            </div>
          </div>
          <div className="main-headlines w-1/2 bg-white p-4 shadow-lg mr-4">
          {mainHeadline && (
              <div className="main-headline" onClick={() => handleArticleClick(mainHeadline.title)}>
                <img src={`https://localhost:7002/api/Contributions/DownloadImageFile?title=${mainHeadline.title}`} alt="Main headline" className="w-full object-cover" style={{ maxHeight: '200px' }} />
                <h1 className="text-2xl font-bold mt-4">{mainHeadline.title}</h1>
                <p>{mainHeadline.description}</p>
              </div>
            )}
          </div>
          <div className="side-headlines w-full lg:w-1/4 bg-white p-4 shadow-lg">
            <h2 className="text-lg font-bold border-b pb-2 mb-4">Side Headlines</h2>
            {sideHeadlines.map((headline, index) => (
              <div key={index} className="flex items-center space-x-3 mb-4" onClick={() => handleArticleClick(headline.title)}>
                <div className="flex-shrink-0">
                  <img src={`https://localhost:7002/api/Contributions/DownloadImageFile?title=${headline.title}`} alt="News title" className="object-contain h-20 w-20 rounded-lg" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-sm">{headline.title}</h3>
                  <p className="text-xs text-gray-500">   {truncateDescription(headline.description, 40)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {Object.entries(facultyContributions).map(([faculty, contributions], index) => (
          <div key={index} className="news-in-focus bg-white px-4 py-8 my-4 shadow-lg">
            <div className='flex justify-between'>
              <h2 className="text-2xl font-bold">{faculty} Faculty</h2>
              <Link to={`/student/homefaculty/${encodeURIComponent(faculty)}`} className=" hover:text-blue-800 mb-8 pb-6 font-bold">More to explore →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contributions.slice(0, 3).map((contribution, idx) => (
                <div key={idx} className="max-w-sm rounded overflow-hidden shadow-lg" onClick={() => handleArticleClick(contribution.title)}>
                  <img className="w-full object-contain h-48" src={`https://localhost:7002/api/Contributions/DownloadImageFile?title=${contribution.title}`} alt="Image for first news item" />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{contribution.title}</div>
                    <p className="text-gray-700 text-base">
                      {contribution.description}
                    </p>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{formatTimeAgo(contribution.submissionDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GeneralLayout>
  );
}

export default HomePage;

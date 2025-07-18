import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import AnimeCard from './components/AnimeCard'
import { useDebounce } from 'react-use'

const API_BASE_URL = 'https://graphql.anilist.co'

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const [animeList, setAnimeList] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm])

  const fetchAnimes = async (animeName = '') => {
    setIsLoading(true);
    setErrorMessage('');

    // gets 1 page 20 anime sorted by popularity. Includes is, title, coverImage
    const query = animeName ? 
    `
      query{
        Page(page:1, perPage: 10) {
          media(search: "${encodeURIComponent(animeName)}", type: ANIME) {
            id
            title {
              english
              romaji
            }
            averageScore
            coverImage {
              extraLarge
            }
            episodes
            startDate {
              day
              month
              year
            }
          }
        }
      }
    `
    :
    `
      query{
        Page(page: 1, perPage: 50) {
          media(sort: POPULARITY_DESC, type: ANIME) {
            id
            title {
              english
              romaji
            }
            averageScore
            coverImage {
              extraLarge
            }
            episodes
            startDate {
              day
              month
              year
            }
          }
        }
      }
    `;
    
    const API_OPTIONS = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query }),
    }

    try {
      const response = await fetch(API_BASE_URL, API_OPTIONS)
      
      if (!response.ok) {
        throw new Error('Failed to fetch Anime');
      }
      
      const data = await response.json();
      
      console.log(animeName)
      console.log(data);

      if (data.response === 'False') {
        setErrorMessage(data.Error || 'Failed to Fetch Anime')
        setAnimeList([]);
        return;
      }
      
      setAnimeList(data.data.Page.media || []);

    } catch (e) {
      console.error(`Error fetching Anime: ${e}`);
      setErrorMessage('Error fetching Anime, please try again later.')
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAnimes(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  return (
    <main>

      <div className="pattern"/>
      
      <div className='wrapper'>
        <header>
          <img src='./hero-img-anime.png' alt="Hero Banner"/>
          <h1>Find <span className="text-gradient">Anime</span> You'll Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Anime</h2>

          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {animeList.map((anime) => (
                <AnimeCard key={anime.id} animeTitle={anime.title.english} animeTitleRomaji={anime.title.romaji} bannerImg={anime.bannerImage} coverImg={anime.coverImage.extraLarge} releaseDate={anime.startDate} avgScore={anime.averageScore} episodes={anime.episodes}/>
              ))}
            </ul>
          )}
        </section>

        {/* <h1 className='text-white'>{searchTerm}</h1> */}

      </div>


    </main>
  )
}

export default App
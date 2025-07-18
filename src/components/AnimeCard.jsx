import React from 'react'

const AnimeCard = ({ id, animeTitle, animeTitleRomaji, coverImg, releaseDate, avgScore, episodes }) => {
  return (
    <div className='movie-card'>
        {/* {console.log(coverImg)} */}
        <img 
            key={id} 
            src={coverImg ? coverImg : '/No-Poster.png'}
            alt={animeTitle || animeTitleRomaji}
        />
        <div className='mt-4'>
            <h3>{animeTitle || animeTitleRomaji}</h3>
        </div>

        <div className='content'>

            <div className='rating'>
                <img src="star.svg" alt='Star Icon' />
                <p>{avgScore ? (avgScore/10).toFixed(1) : 'N/A'}</p>
            </div>

            <span>•</span>

            <p className='lang'>{episodes} EP</p>

            <span>•</span>

            <p className='year'>
                {releaseDate ? releaseDate.year : 'N/A'}
            </p>

        </div>
    </div>
  )
}

export default AnimeCard
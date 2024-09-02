import React from 'react';
import '../stylesheets/MainPages.css';

const Matches = ({ matches, loading, error }) => {
  const formatTime = (timestamp, timeZone) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone,
      hour12: false,
    }).format(date);
  };

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className='matches-container'>
      <h2 className='matches-tittle'>Next Matches:</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && matches.length > 0 && matches.map((match) => (
        <div key={match.id} className='match'>
          <div className='title-name'>
            <p>{match.tournament.uniqueTournament?.name || 'Unknown'}</p> <p>{match.date}</p>
          </div>
          <div className='match-data'>
            <div className='Tournament-logos'>
              {match.tournament?.image && <img src={match.tournament.image} alt={`${match.tournament.name} logo`} className='Tournament-logo-img' />}
              <p>{match.roundInfo?.name || 'League'}</p>
            </div>
            <div className='teams-data'>
              <div className='team'>
                <strong className='team-name'>{match.homeTeam?.name}</strong>
                {match.homeTeam?.image && <img src={match.homeTeam.image} alt={`${match.homeTeam.name} logo`} className='team-logo' />}
              </div>
              <div className='score'>
                <div className='Home-Score'>{match.homeScore?.current ?? 0}</div>
                -
                <div className='Home-Score'>{match.awayScore?.current ?? 0}</div>
              </div>
              <div className='team'>
                {match.awayTeam?.image && <img src={match.awayTeam.image} alt={`${match.awayTeam.name} logo`} className='team-logo' />}
                <strong className='team-name'>{match.awayTeam?.name}</strong>
              </div>
            </div>
          </div>
          <div className='hours-container'>
            <p className='hour'>{formatTime(match.timestamp, userTimeZone)}</p>
          </div>
        </div>
      ))}
      {!loading && !error && matches.length === 0 && <p>No matches found for the given dates</p>}
    </div>
  );
}

export default Matches;

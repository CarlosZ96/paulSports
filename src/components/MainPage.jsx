import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMatches } from '../redux/euro/euroSlice';
import { fetchMatchesA } from '../redux/euro/AmericaSlice';

function MainPage() {
  const dispatch = useDispatch();
  const { matches, loading, error } = useSelector((state) => state.euro);
  const { matchesa, loadinga, errora } = useSelector((state) => state.america);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    dispatch(fetchMatches());
    dispatch(fetchMatchesA());
  }, [dispatch]);

  if (loading || loadinga) {
    return <div>Loading...</div>;
  }

  if (error || errora) {
    return <div>Error: {error || errora}</div>;
  }

  const startDate = new Date('2024-07-09T00:00:00.000Z');
  const endDate = new Date('2024-07-15T23:59:59.999Z');

  const filteredMatches = matches.filter((match) => {
    const matchDate = new Date(match.date);
    return matchDate >= startDate && matchDate <= endDate;
  });

  const filteredMatchesAmerica = matchesa.filter((match) => {
    const matchDate = new Date(match.date);
    return matchDate >= startDate && matchDate <= endDate;
  });

  return (
    <div>
      <header>
        <h1>Paul's Sports</h1>
        <div></div>
      </header>
      <section>
        <h2>Next Euro matches:</h2>
        <ul>
          {filteredMatches.map((match) => (
            <li key={match._id}>
              {capitalizeFirstLetter(match.teamA.team.name)} {match.teamA.score} - {match.teamB.score} {capitalizeFirstLetter(match.teamB.team.name)}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Next America matches:</h2>
        <ul>
          {filteredMatchesAmerica.map((match) => (
            <li key={match._id}>
              {match.teamA?.team?.name ? capitalizeFirstLetter(match.teamA.team.name) : 'Unknown'} {match.teamA?.score ?? 'N/A'} - {match.teamB?.score ?? 'N/A'} {match.teamB?.team?.name ? capitalizeFirstLetter(match.teamB.team.name) : 'Unknown'}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default MainPage;

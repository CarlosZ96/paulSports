import React, { useEffect } from 'react';
import axios from 'axios';

function WCTeams() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://api.football-data.org/v4/competitions/WC/teams', {
          'mode': 'no-cors',  
        headers: {
            'X-Auth-Token': 'af64fe66266d44669441ef1252e4bed4'
          }
        });
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
     Hola
    </div>
  );
}

export default WCTeams;

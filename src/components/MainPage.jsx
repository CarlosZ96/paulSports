import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import apifirebase from 'firebase';
import {getAuth, onAuthStateChanged} from 'firebase/auth'
const auth = getAuth(apifirebase)

function MainPage() {

  return (
    <div>
      <header>
        <h1>Paul's Sports</h1>
        <div></div>
      </header>
      <section>
 
      </section>
    </div>
  );
}

export default MainPage;

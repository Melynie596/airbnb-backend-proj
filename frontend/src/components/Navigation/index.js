import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation(){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <header>
      <div className='logo'>
        <NavLink exact to="/" className='home-link'>
          <i class="fa-brands fa-airbnb"></i>
          airbnb
        </NavLink>
      </div>
      <nav>
        <ul className='user-links'>
          <li className='profile-button'>
            <ProfileButton user={sessionUser} />
          </li>
          {sessionUser ? (
             <li>
              <NavLink className='create-spot-link' to='/api/spots/new'>Create a New Spot</NavLink>
            </li>
          ) : ''}
        </ul>

      </nav>
    </header>
  );
}

export default Navigation;

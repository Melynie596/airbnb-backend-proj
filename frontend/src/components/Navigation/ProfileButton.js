import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import "./ProfileButton.css"
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className='dropdown' onClick={openMenu}>
        <i class="fa-solid fa-bars"></i>
        <i className="fas fa-user-circle" />
      </button>
      <div className="dropdown-menu">
        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              <li>{`Hello, ${user.firstName}`}</li>
              <li>{user.email}</li>
              <li className="manage-spots">
                <Link to='api/spots/manage'>
                  Manage Spots
                </Link>
              </li>
              <li>
                <button className="logout-button" onClick={logout}>Log Out</button>
              </li>
           </>
          ) : (
            <>
             <li>
                <OpenModalButton
                  buttonText="Log In"
                  onButtonClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </li>
              <li>
                <OpenModalButton
                  buttonText="Sign Up"
                  onButtonClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default ProfileButton;

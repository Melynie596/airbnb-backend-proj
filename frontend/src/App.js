import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom";
import SpotsLandingPage from "./components/SpotsLandingPage";
import SpotDetailPage from "./components/SpotDetailPage";
import CreateSpotForm from "./components/CreateSpotForm";
import ManageSpots from "./components/Navigation/ManageSpots";

function App() {
  const dispatch = useDispatch();
  // const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser());
  }, [dispatch]);

  return (
    <>
      <Navigation />
       <Switch>
        <Route exact path={'/'}>
          <SpotsLandingPage />
        </Route>
        <Route path={'/api/spots/new'}>
          <CreateSpotForm />
        </Route>
        <Route path={'/api/spots/manage'}>
          <ManageSpots />
        </Route>
        <Route path={'/api/spots/:spotId'}>
            <SpotDetailPage />
        </Route>
        </Switch>
    </>
  );
}

export default App;

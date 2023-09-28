import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as SpotsActions from '../../store/spots';
import "./SpotsLandingPage.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SpotsLandingPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spots = useSelector((state) => state?.spot?.spots?.Spots);
    // console.log(SpotsActions.getSpots);
    const [isLoaded, setIsLoaded] = useState(false);
    // const spots = useSelector((state) => state)


    useEffect(() => {
        dispatch(SpotsActions.getSpots())
        .then(() => setIsLoaded(true))
    }, [dispatch, isLoaded]);

    return (
       <div>
        {spots && spots.map(spot => {
            return (
                <div onClick={() => {history.push(`/api/spots/${spot.id}`)}}>
                    <img src={spot.previewImage} alt={`house in ${spot.city}`}/>
                    <h4>{`${spot.city}, ${spot.state}`}</h4>
                    <p>{`$${spot.price} night`}</p>
                    <p>{(spot.avgStarRating === 0) ? "New" : spot.avgStarRating}</p>
                </div>
            );
        })}
       </div>
    );
}

export default SpotsLandingPage;

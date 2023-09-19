import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as SpotsActions from '../../store/spots';
import "./SpotsLandingPage.css";

const SpotsLandingPage = () => {
    const dispatch = useDispatch();
    const [tileImage, setTileImage] = useState();
    const [starRating, setStarRating] = useState();
    const spots = Object.values(useSelector((state) => state.spot.spots));

    useEffect(() => {
        dispatch(SpotsActions.getSpots());
    }, [dispatch]);

    return (
       <div>
        {spots?.forEach(spot => {
            return <div>
                <img src={spot}></img>
            </div>
        })}
       </div>
    );
}

export default SpotsLandingPage;

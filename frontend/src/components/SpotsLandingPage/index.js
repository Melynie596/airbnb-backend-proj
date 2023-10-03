import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as SpotsActions from '../../store/spots';
import "./SpotsLandingPage.css";
import { useHistory } from "react-router-dom";

const SpotsLandingPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const spots = useSelector((state) => state?.spot?.spots?.Spots);

    useEffect(() => {
        dispatch(SpotsActions.getSpots())
    }, [dispatch]);

    return (
        <div className="container">
            <div className="card">
                {spots && spots.map(spot => {
                    return (
                        <div className="spot-card" key={spot.id} onClick={() => {history.push(`/api/spots/${spot.id}`)}}>

                                <img className="spot-preview-image"src={spot.previewImage} alt={`house in ${spot.city}`}/>

                            <div className="spot-info">
                                <h4 className="card-location">{`${spot.city}, ${spot.state}`}</h4>
                                <p className="card-rating">
                                <i class="fa-solid fa-star"></i>

                                    {(spot.avgStarRating === 0) ? "New" : spot.avgStarRating}</p>
                                <p className="card-price">{`$${spot.price} night`}</p>
                            </div>

                        </div>
                            );
                        })}
                </div>
        </div>
    );
}

export default SpotsLandingPage;

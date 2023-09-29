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
                            <div className="card-image">
                                <img className="spot-preview-image"src={spot.previewImage} alt={`house in ${spot.city}`}/>
                            </div>
                            <div className="spot-info">
                                <h4>{`${spot.city}, ${spot.state}`}</h4>
                                <p>{`$${spot.price} night`}</p>
                                <p>{(spot.avgStarRating === 0) ? "New" : spot.avgStarRating}</p>
                            </div>

                        </div>
                            );
                        })}
                </div>
        </div>
    );
}

export default SpotsLandingPage;

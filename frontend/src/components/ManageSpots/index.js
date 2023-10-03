import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link, useParams, NavLink } from "react-router-dom";
import * as spotActions from '../../store/spots'
import OpenModalButton from "../Modal";
import DeleteSpot from "../DeleteSpot";
import './ManageSpots.css';

function ManageSpots() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams;
    let spotsObj = useSelector((state) => state.spots);
    spotsObj = Object.entries(spotsObj).filter(([key]) => key !== 'detail');

    const reviews = useSelector((state) => state.reviews[id]);



    useEffect(() => {
        dispatch(spotActions.getUserSpots());
    }, [dispatch]);

    const totalReviews = reviews?.length;

    if(!spotsObj || spotsObj.length === 0) {
        return (
            <div>
                <h2>Manage Your Spots</h2>
                <Link to="/spots/new" className="spot-link">
                    Create a New Spot
                </Link>
                <p>No Spots found.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Manage Your Spots</h2>
            <Link to="/spots/new" className="spot-link">
                    Create a New Spot
            </Link>
            <div className="spot-list">
                {spotsObj?.map(([key, spot]) => (
                        <div key={key}>
                            <div className="spot-container">
                                <NavLink to={`/spots/${spot.id}`} title={spot.name}>
                                <img src={spot.previewImage} className="spot-image" alt="Spot Preview" />
                                </NavLink>
                                <div className="info-container">
                                    <h2 className="title">{spot.name} <span className="rating"><span className="star">&#9733;</span>{spot.avgRating ? spot?.avgRating : 'NEW'}</span></h2>
                                    <h3 className="info">{spot.city}</h3>
                                    <h3 className="info">{spot.state}</h3>
                                    <h3 className="info"><span className="price">${spot.price}</span> / night</h3>
                                </div>
                            </div>
                            <div className="details">
                                <h3>${spot?.price}/night <span className="rating"><span className="star">&#9733;</span>{spot?.avgRating ? spot?.avgRating : 'NEW'} <span className="dot">&#x2022;</span> {totalReviews} {totalReviews === 1 ? "review" : "reviews"} </span></h3>
                            </div>
                            <div>
                                <button onClick={() => history.push(`/spots/${spot.id}/update`)}>Update</button>
                                <OpenModalButton buttonName="Delete" modalComponent={<DeleteSpot spotId={spot.id} />} />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default ManageSpots;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import * as SpotActions from "../../store/spots";
import * as reviewActions from "../../store/reviews";
import ReserveButton from './ReserveButton';
import OpenModalButton from "../OpenModalButton";



const SpotDetailPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const spotDetails = useSelector((state) => state?.spot?.spot);
    const spotImage = useSelector((state) => state?.spot?.spot?.SpotImages);
    const reviews = useSelector((state) => state?.reviews?.reviews);


    useEffect(() => {
        dispatch(SpotActions.getSpotDetails(spotId));
        dispatch(reviewActions.getSpotReviews(spotId))
        .then(() => setIsLoaded(true));
    }, [dispatch, isLoaded]);

    return (
        <div>

        <div>
            <h1>{spotDetails?.name}</h1>
            <h3>{`${spotDetails?.city}, ${spotDetails?.state}, ${spotDetails?.country}`}</h3>
        </div>

        <div>
            <img src={spotImage?.[0].url} alt={`House in ${spotDetails?.city}`}/>
        </div>

        <div>
            <h3>{`Hosted by ${spotDetails?.Owner.firstName} ${spotDetails?.Owner.lastName}`}</h3>
            <p>
                {spotDetails?.description}
            </p>
        </div>

        <div>
            <div>
                <h4>{`$${spotDetails?.price} night`}</h4>
                <i class="fa-solid fa-star"></i>
                <p>{spotDetails?.avgRating}</p>
                <p>{spotDetails?.numReviews}</p>
                <button type='button'>
                    <OpenModalButton
                        buttonText="Reserve"
                        modalComponent={ReserveButton}
                    />
                </button>
            </div>
        </div>
        {reviews && reviews.map(review => {
            <div key={review.id}>

            </div>
        })}

        </div>
    );
}

export default SpotDetailPage;

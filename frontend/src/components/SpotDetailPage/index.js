import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import * as SpotActions from "../../store/spots";
import * as reviewActions from "../../store/reviews";

import "./SpotDetailPage.css";


const SpotDetailPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const spotDetails = useSelector((state) => state?.spot?.spot);
    const spotImage = useSelector((state) => state?.spot?.spot?.SpotImages);
    const reviews = useSelector((state) => state?.reviews?.reviews?.Reviews);

    useEffect(() => {
        dispatch(SpotActions.getSpotDetails(spotId));
        dispatch(reviewActions.getSpotReviews(spotId));

    }, [dispatch]);

    const handleReserveButton = (e) => {
        e.preventDefault();
        alert("Feature Coming Soon...")
    }

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
                <button type='button' onClick={handleReserveButton}>
                   Reserve
                </button>
            </div>
        </div>

        <div className="review-header">
            <div className="star-rating">
                <i class="fa-solid fa-star"></i>
                <p>{spotDetails?.avgRating}</p>
            </div>
            <div className="num-reviews">
                <p>{spotDetails?.numReviews} Reviews</p>
            </div>
        </div>

        {/* post review button here */}

        {reviews && reviews.map(review => {
            return (
                <div key={review.id} className="review-card">
                    <h3>{review.User.firstName}</h3>
                    <h4>{review.createdAt}</h4>
                    <p>{review.review}</p>
                </div>
            );
        })}

        </div>
    );
}

export default SpotDetailPage;

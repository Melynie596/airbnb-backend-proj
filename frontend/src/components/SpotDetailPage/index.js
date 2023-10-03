import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import * as SpotActions from "../../store/spots";
import * as reviewActions from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import CreateReview from "../CreateReviewModal";
import DeleteReview from "../DeleteReview";
import "./SpotDetailPage.css";


const SpotDetailPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session.user);
    const spotDetails = useSelector((state) => state?.spot?.spot);
    const spotImage = useSelector((state) => state?.spot?.spot?.SpotImages);
    const reviews = useSelector((state) => state?.reviews[spotId]);


    useEffect(() => {
        dispatch(SpotActions.getSpotDetails(spotId));
        dispatch(reviewActions.fetchReviews(spotId));

    }, [dispatch, spotId]);

    const totalReviews = reviews?.length;

    const handleReserveButton = (e) => {
        e.preventDefault();
        alert("Feature Coming Soon...")
    }

      const hasPostedReview = reviews?.find(review => review.userId === sessionUser?.id)

    return (
        <div className="details-container">

        <div className="details-header">
            <h1 className="details-title">{spotDetails?.name}</h1>
            <h3>{`${spotDetails?.city}, ${spotDetails?.state}, ${spotDetails?.country}`}</h3>
        </div>

        <div>
            <img src={spotImage?.[0].url} alt={`House in ${spotDetails?.city}`}/>
        </div>

      <div className="details-info">


        <div className="details-description">
            <h3>{`Hosted by ${spotDetails?.Owner.firstName} ${spotDetails?.Owner.lastName}`}</h3>
            <p>
                {spotDetails?.description}
            </p>
        </div>

        <div className="reserve-box">
            <h4>{`$${spotDetails?.price} night`}</h4>
            <div className="review-rating">
            <p className="review-stars">
              <i class="fa-solid fa-star"></i>
              {spotDetails?.avgRating}
              </p>

            {totalReviews === 1 ? (
                <span>{totalReviews} reviews</span>
            ):(
                <span>{reviews?.length} reviews</span>
            )}
            </div>
              <div className="reserve-button-container">
                <button className="reverse-button" type='button' onClick={handleReserveButton}>
                  Reserve
                </button>
              </div>

        </div>


      </div>

        <div className="reviews-grid">
            <h2>Reviews</h2>

            <div className="review-rating">
            <p className="review-stars">
              <i class="fa-solid fa-star"></i>
              {spotDetails?.avgRating}
              </p>

            {totalReviews === 1 ? (
                <span>{totalReviews} reviews</span>
            ):(
                <span>{reviews?.length} reviews</span>
            )}
            </div>

            {totalReviews === 0 && spotDetails?.Owner?.id !== sessionUser?.id && (
                <div>
                    <p>Be the first person to post a review!</p>
                    <OpenModalButton buttonName="Post Review" modalComponent={<CreateReview />} />
                </div>
            )}

            {sessionUser && spotDetails?.Owner?.id !== spotDetails?.id && !hasPostedReview && (
                <OpenModalButton buttonName="Post Review" modalComponent={<CreateReview />}/>
            )}

            {reviews?.map((review) => (
                <div key={review?.id} className="review">
                    <p className="review-user">{review?.User?.firstName ?? 'User'}</p>
                    <p className="review-date">
                        {review?.updatedAt ? new Date(review?.updatedAt).toLocaleDateString('en-US', {
                            month: "long",
                            year: "numeric",
                        }) : ''}
                    </p>
                    <p>{review?.review}</p>
                    {sessionUser?.id === review?.User?.id && (
                        <OpenModalButton buttonName="Delete" modalComponent={<DeleteReview reviewId={review.id}/>}/>
                    )}
                </div>
            ))}
        </div>

        </div>
    );
}

export default SpotDetailPage;

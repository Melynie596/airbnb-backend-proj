import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import * as SpotActions from "../../store/spots";
import * as reviewActions from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "../CreateReviewModal";
import DeleteModal from "../CreateReviewModal/DeleteModal";

import "./SpotDetailPage.css";


const SpotDetailPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session.user);
    const spotDetails = useSelector((state) => state?.spot?.spot);
    const spotImage = useSelector((state) => state?.spot?.spot?.SpotImages);
    const reviews = useSelector((state) => state?.reviews[spotId]);

    const totalReviews = reviews?.length;
    const averageRating = totalReviews > 0 ?
        reviews.reduce((sum, review) => sum + review.stars, 0) / totalReviews :
        0;

    const currentUser = useSelector((state) => state.session.user);

    const closeModal = useCallback(() => {
      setIsReviewModalOpen(false);
    }, []);


    useEffect(() => {
        dispatch(SpotActions.getSpotDetails(spotId));
        dispatch(reviewActions.fetchReviews(spotId));

    }, [dispatch, spotId]);

    const handleReserveButton = (e) => {
        e.preventDefault();
        alert("Feature Coming Soon...")
    }

      const hasPostedReview = reviews?.find(review => review.userId === sessionUser?.id)

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
                {totalReviews === 1 ? (
                    <span>{totalReviews} reviews</span>
                ):(
                    <span>{reviews?.length} reviews</span>
                )}
                <button type='button' onClick={handleReserveButton}>
                   Reserve
                </button>
            </div>
        </div>

        <div>
            <h2>Reviews</h2>
            {totalReviews === 0 && spotDetails?.Owner?.id !== currentUser?.id && (
                <div>
                    <p>Be the first person to post a review!</p>
                    <OpenModalButton buttonName="Post Review" modalComponent={<CreateReviewModal />} />
                </div>
            )}

            {sessionUser && spotDetails?.Owner?.id !== currentUser?.id && !hasPostedReview && (
                <OpenModalButton buttonName="Post Review" modalComponent={<CreateReviewModal />}/>
            )}
            {reviews?.map((review) => (
                <div key={review?.id} className="review">
                    <p>
                        {review?.User?.firstName ?? 'User'}, {review?.updatedAt ? new Date(review?.updatedAt).toLocaleDateString('en-US', {
                            month: "long",
                            year: "numeric",
                        }) : ''}
                    </p>
                    <p>{review?.review}</p>
                    {currentUser?.id === review?.User?.id && (
                        <OpenModalButton buttonName="Delete" modalComponent={<DeleteModal reviewId={review.id}/>}/>
                    )}
                </div>
            ))}
        </div>

        {/* <div className="review-header">
            <div className="star-rating">
                <i class="fa-solid fa-star"></i>
                <p>{spotDetails?.avgRating}</p>
            </div>
            <div className="num-reviews">
                <p>{spotDetails?.numReviews} Reviews</p>
            </div>
        </div>

        {totalReviews === 0 ? (
              <div>
                <div className="spot-callout-rating">
                  <i className="fa-solid fa-star"></i> NEW
                </div>
                {spotDetails?.Owner?.id !== currentUser?.id && (
                  <p>Be the first to post a review!</p>
                )}
              </div>
            ) : (
              <div>
                <div className="spot-callout-rating">
                  <i className="fa-solid fa-star"></i> Rating:{" "}
                  {averageRating.toFixed(2)}
                </div>
                <div className="spot-callout-reviews">
                  Reviews: {totalReviews}
                </div>
              </div>
            )}

        {reviews && reviews.map(review => {
            return (
                <div key={review.id} className="review-card">
                    <h3>{review.User.firstName}</h3>
                    <h4>{review.createdAt}</h4>
                    <p>{review.review}</p>
                </div>
            );
        })}

    <div className="reviews-container">
          {totalReviews === 0 ? (
            <div>
              <i className="fa-solid fa-star"></i> NEW
            </div>
          ) : (
            <div>
              <i className="fa-solid fa-star"></i> {averageRating.toFixed(2)} ·{" "}
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </div>
          )}

          <div className="post-review-button">
            {!currentUser ||
            hasPostedReview ||
            spotDetails?.Owner?.id === currentUser?.id ? null : (
              <button onClick={handlePostReview}>Post Your Review</button>
            )}
          </div>

          {reviews.length === 0 && spotDetails?.Owner?.id !== currentUser?.id ? (
            <p>Be the first to post a review!</p>
          ) : (
            reviews
              .map((review) => (
                <div key={review?.id} className="review">
                  <p>
                    {review?.User?.firstName ?? "User"},{" "}
                    {review.updatedAt
                      ? new Date(review.updatedAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  <p>{review?.review}</p>
                  {review?.User?.id === currentUser?.id && (
                    <button
                      className="delete-review-button"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete Review
                    </button>
                  )}
                </div>
              ))
              .reverse() // Reverse the order of reviews to show the most recent review first
          )}
        </div>


      {isReviewModalOpen && (
        <CreateReviewModal
          closeModal={() => setIsReviewModalOpen(false)}
          spotId={spotId}
          onSubmit={handleReviewSubmit}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          title="Confirm Delete"
          message="Are you sure you want to delete this review?"
          onAction={handleDeleteConfirmation}
        />
      )} */}

        </div>
    );
}

export default SpotDetailPage;

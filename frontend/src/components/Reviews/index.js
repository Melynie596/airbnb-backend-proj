import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../store/reviews";

function Reviews () {
    const dispatch = useDispatch();
    let reviewsObj = useSelector((state) => state.reviews);
    reviewsObj = Object.entries(reviewsObj).filter(([key]) => key !== 'detail');

    useEffect(() => {
        dispatch(fetchReviews());
    }, [dispatch]);

    return (
        <div>
            <h1>Current Reviews</h1>
            <div>
                {reviewsObj?.map(([key, review]) => (
                    <div key={key}>
                        <h2>{review?.user_id?.firstName}</h2>
                        <h2>{review?.review}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Reviews;

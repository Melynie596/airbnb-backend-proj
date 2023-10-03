import React, {useContext, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { createReview } from "../../store/reviews";
import { context } from '../Modal/index';
import StarRating from "./starRating";
import { ReviewContext } from "./reviewContext";
import "./newReview.css"


function CreateReview () {
    const { spotId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const [stars, setStars] = useState(null);
    const [review, setReview] = useState("");
    const [errors, setErrors] = useState({});
    const { setModal } = useContext(context);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        const payload = {
            review,
            stars
        };

        let createdReview = await dispatch(createReview(spotId, payload)).catch(
            async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                } else if (data) {
                    setErrors(data)
                }
            }
        );
        if(createdReview) {
            setModal(false)
            window.location.reload()
        }
    };

    let button;

    if(review.length < 10) {
        button = <button type="submit" disabled>Submit Your Review</button>
    } else  {
        button = <button type="submit">Submit Your Review</button>;
    }

    let errMsg;

    if (errors.review) {
        errMsg = `*${errors.description}`
    } else if (errors.stars) {
        errMsg = `*${errors.rating}`
    } else if (errors.message) {
        errMsg = `*${errors.message}`
    }

    return (
        <div>
            <div>
             <h2>How was your stay?</h2>
             <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Review
                        <textarea type="text" placeholder="Leave your review here..." value={review} onChange={(e) => setReview(e.target.value)}
                        required
                        />
                    </label>
                    <div>
                        {errMsg}
                    </div>
                </div>
                    <ReviewContext.Provider value={{stars, setStars}}>
                        <StarRating  />
                    </ReviewContext.Provider>
                    {button}
             </form>

            </div>
        </div>
    )
};

export default CreateReview;

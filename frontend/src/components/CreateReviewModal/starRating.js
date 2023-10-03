import React, { useContext } from "react";
import { ReviewContext } from "./reviewContext";

const StarRating = () => {
    const {stars, setStars} = useContext(ReviewContext);

    return (
        <div>
            {[...Array(5)].map((star, i) => {
                const ratingVal = i + 1;
                let color;
                if(ratingVal <= stars) {
                    color = {color: "#ffc107"}
                } else if (ratingVal > stars) {
                    color = {color: "#e4e5e9"}
                }
               return (
                <label>
                    <input type="radio" name="rating" value={ratingVal} onClick={() => setStars(ratingVal)}/>
                    <i className="fas fa-star" style={color}></i>
                </label>
               )
            })}
        </div>
    )
};

export default StarRating;

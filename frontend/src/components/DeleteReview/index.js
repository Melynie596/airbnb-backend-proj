import { useDispatch } from "react-redux";
import { context } from "../Modal";
import { useContext } from "react";
import { removeReview } from "../../store/reviews";

function DeleteReview ({reviewId}) {
    const dispatch = useDispatch();
    const { setModal } = useContext(context);

    const deletion = function () {
        const deleted = dispatch(removeReview(reviewId));
        if(deleted) {
            setModal(false)
            window.location.reload()
        }
    };

    return (
        <div className="confirmation">
            <h2 className="message">Confirm Delete</h2>
            <p className="message">Are you sure you want to delete this review?</p>
            <div>
                <button className="yes" onClick={() => deletion()}>Yes (Delete Review)</button>
                <button className="no" onClick={() => { setModal(false)}}>No (Keep Review)</button>
            </div>
        </div>
    )
}

export default DeleteReview;

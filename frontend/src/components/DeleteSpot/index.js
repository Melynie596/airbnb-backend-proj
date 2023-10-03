import { useDispatch, useSelector } from "react-redux";
import { context } from '../Modal/index';
import { useEffect, useContext } from "react";
import * as spotActions from "../../store/spots";

function DeleteSpot ({ spotId }) {
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots[spotId]);
    const { setModal } = useContext(context);

    useEffect(() => {
        dispatch(spotActions.getSpotDetails(spotId));
    }, [dispatch, spotId]);

    const deletion = function () {
        if(spot) {
            const deleted = dispatch(spotActions.removeSpot(spotId));
            if(deleted) {
                setModal(false)
            }
        }
    };

    return (
        <div className="confirmation">
            <h2 className="message">Are you sure you want to remove this spot?</h2>
            <div>
                <button className="yes" onClick={() => deletion()}>Yes (Delete Spot)</button>
                <button className="no" onClick={() => { setModal(false)}}>No (Keep Spot)</button>
            </div>
        </div>
    )
}

export default DeleteSpot;

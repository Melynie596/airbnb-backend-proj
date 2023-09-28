import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import * as spotActions from "../../store/spots"


const ManageSpots = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [selectedSpot, setSelectedSpot] = useState(null);

    let spots = useSelector((state) => state?.spot);
    if (spots) spots = Object.values(spots);
    console.log(spots);

    useEffect(() => {
        dispatch(spotActions.getUserSpots());
    }, [dispatch]);

    const updateSpot = (spotId) => {
        history.push(`/api/spots/${spotId}/update`);
    };

    const deleteSpot = (spotId) => {
        setSelectedSpot(spotId);
    }

    const handleConfirm = (confirmed) => {
        if (confirmed && selectedSpot) {
            dispatch(spotActions.removeSpot(selectedSpot))
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.error("Spot deletion failed:", error);
            })
        }
        setSelectedSpot(null);
    }

    if (!spots || spots.length === 0) {
        return (
            <div>
                <h1>Manage Your Spots</h1>
                <Link to='/spots/new'>
                    Create a New Spot
                </Link>
                <p>No spots found</p>
            </div>
        )
    }

    return (
        <div>
            <h1>Manage Your Spots</h1>
            <Link to='/spots/new'>
                Create a New Spot
            </Link>
            <div>
            {spots && spots.map(spot => {
            return (
                <div key={spot.id} onClick={() => {history.push(`/api/spots/${spot.id}`)}}>
                    <img src={spot.previewImage} alt={`house in ${spot.city}`}/>
                    <h4>{`${spot.city}, ${spot.state}`}</h4>
                    <p>{`$${spot.price} night`}</p>
                    <p>{(spot.avgStarRating === 0) ? "New" : spot.avgStarRating}</p>
                    <button onClick={() => updateSpot(spot?.id)}>Update</button>
                    <button onClick={() => deleteSpot(spot?.id)}>Delete</button>

                </div>
            );
        })}
            </div>

            {selectedSpot && (
                <ConfirmationModal
                    title="Confirm Delete"
                    message="Are you sure you want to delete this spot?"
                    onAction={handleConfirm}
                />
            )}
        </div>
    );
};

export default ManageSpots;

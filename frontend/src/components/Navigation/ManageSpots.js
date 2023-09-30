import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import * as spotActions from "../../store/spots"
import { useParams } from "react-router-dom";


const ManageSpots = () => {
    const { id } = useParams
    const dispatch = useDispatch();
    const history = useHistory();
    const [selectedSpot, setSelectedSpot] = useState(null);

    let spots = useSelector((state) => state?.spot?.spots?.Spots);
    if (spots) spots = Object.values(spots);

    const reviews = useSelector((state) =>
    Object.values(state.reviews).filter(
      (review) => review.spotId === parseInt(id)
    )
  );
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.stars, 0) / totalReviews
      : 0;

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
                        <div className="spot-card" key={spot.id} onClick={() => {history.push(`/api/spots/${spot.id}`)}}>
                            <div className="card-image">
                                <img className="spot-preview-image"src={spot.previewImage} alt={`house in ${spot.city}`}/>
                            </div>
                            <div className="spot-info">
                                <h4>{`${spot.city}, ${spot.state}`}</h4>
                                <p>{`$${spot.price} night`}</p>
                                <p>{(spot.avgStarRating === 0) ? "New" : spot.avgStarRating}</p>
                            </div>
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

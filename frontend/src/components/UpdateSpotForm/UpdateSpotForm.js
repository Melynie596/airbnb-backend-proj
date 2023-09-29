import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import { getSpotDetails, updateSpot } from "../../store/spots";

const UpdateSpotform = () => {
    const { id } = useParams;
    const dispatch = useDispatch();
    const history = useHistory();

    const spot = useSelector((state) => state?.spot?.spots?.Spot[id]);
    console.log(spot);
    const [formData, setFormData] = useState({
        country: "",
        address: "",
        city: "",
        state: "",
        description: "",
        name: "",
        price: "",
        previewImage: "",
    });

    useEffect(() => {
        if (spot) {
            setFormData({
                country: spot.country,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                description: spot.description,
                name: spot.name,
                price: spot.price,
                previewImage: spot.previewImage,
            });
        } else {
            dispatch(getSpotDetails(id))
            .then((data) => {
                setFormData({
                    country: data.country,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    description: data.description,
                    name: data.name,
                    price: data.price,
                    previewImage: data.previewImage,
                });
            })
            .catch((err) => console.error(err));
        }
    }, [dispatch, id, spot])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateSpot(id, formData))
        .then(() => {
            history.push(`/spots/${id}`);
        })
        .catch((err) => console.error(err));
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="form">
            <h1>Update Your Spot</h1>
            <form onSubmit={handleSubmit}>
                <section>
                    <h2>Where's your place located?</h2>
                    <p>
                        Guests' will only get your exact address once they book a reservation.
                    </p>
                    <div className="form-input">
                        <label>Country</label>
                        <input
                            type='text'
                            id='country'
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Country"
                        />
                    </div>
                    <div className="form-input">
                        <label>Street Address</label>
                        <input
                            type='text'
                            id='streetAddress'
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street Address"
                        />
                    </div>
                    <div className="form-input">
                        <label>City</label>
                        <input
                            type='text'
                            id='city'
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                        />
                    </div>
                    <div className="form-input">
                        <label>State</label>
                        <input
                            type='text'
                            id='state'
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State"
                        />
                    </div>
                </section>
                <section>
                    <h2>Describe your place to guests</h2>
                    <p>
                        Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
                    </p>
                    <div className="form-input">
                        <textarea
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Please write at least 30 characters"
                        ></textarea>
                    </div>
                </section>
                <section>
                    <h2>Create a title for your spot</h2>
                    <p>
                        Catch your guests' attention with a spot title that highlights what makes your place special.
                    </p>
                    <div className="form-input">
                        <input
                            type='text'
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name of your spot"
                        />
                    </div>
                </section>
                <section>
                    <h2>Set a base price for your spot</h2>
                    <p>
                        Competitive pricing can help your listing stand out and rank higher in search filters.
                    </p>
                    <div className="form-input">
                        <input
                            type='number'
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Price per night (USD)"
                        />
                    </div>
                </section>
                <section>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <div className="form-input">
                        <label>Country</label>
                        <input
                            type='text'
                            value={formData.previewImage}
                            onChange={handleChange}
                            placeholder="Preview Image URL"
                        />
                    </div>
                </section>
                <button type="submit">Update Your Spot</button>
            </form>
        </div>
    );
}

export default UpdateSpotform;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as spotActions from '../../store/spots'
import './UpdateSpot.css';


function UpdateSpotFormPage () {
    const dispatch = useDispatch();
    const history = useHistory();
    const {spotId} = useParams();
    const spot = useSelector((state) => state.spots[spotId]);
    const [country, setCountry] = useState(spot?.country);
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city);
    const [state, setState] = useState(spot?.state);
    const [lat, setLat] = useState(spot?.lat);
    const [lng, setLng] = useState(spot?.lng);
    const [description, setDescription] = useState(spot?.description);
    const [name, setName] = useState(spot?.name);
    const [price, setPrice] = useState(spot?.price);
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        dispatch(spotActions.getSpotDetails());
    }, [dispatch, spotId]);

    useEffect(() => {
        const errors = {};

        if(!country) {
            errors.county = "Country is required";
        };
        if(!address) {
            errors.address = "Street Address is required";
        };
        if(!city) {
            errors.city = "City is required";
        };
        if(!state) {
            errors.state = "State is required";
        };
        if(!lat) {
            errors.lat = "Latitude is required";
        };
        if(!lng) {
            errors.lng = "Longitude is required";
        };
        if(!description) {
            errors.description = "Description is required";
        };
        if(!name) {
            errors.name = "Title is reequired";
        };
        if(!price) {
            errors.price = "Price per night is required";
        };

        setErrors(errors);
    }, [country, address, city, state, lat, lng, description, name, price]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setHasSubmitted(true);

        if(Object.values(errors).length)
            return alert(`Errors been found`);

        const spotData = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        };

        let updateSpot = await dispatch(spotActions.updateSpot(spotId, spotData));

        if(updateSpot) {
            history.push(`spots/${spotId}`);
        }
        setErrors({});
        setHasSubmitted(false);
    };

    return (
           <div className="container">
            <h1>Create a New Spot</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <section className="details">
                            <h2 className="title">Where's your place located?</h2>
                            <div>Guests will only get your exact address once they booked a reservation</div>
                            <label>
                                <div>Country</div>
                                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)}
                                required
                                />
                            </label>
                            {errors.country && (<p className="error">*{errors.country}</p>)}
                            <label>
                                <div>Street Address</div>
                                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                                required
                                />
                            </label>
                            {errors.address && (<p className="error">*{errors.address}</p>)}
                            <label>
                                <div>City</div>
                                <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                                required
                                />
                            </label>
                            {errors.city && <p className="error">*{errors.city}</p>}
                            <label>
                                <div>State</div>
                                <input type="text" value={state} onChange={(e) => setState(e.target.value)}
                                required
                                />
                                {errors.state && <p className="error">*{errors.state}</p>}
                            </label>
                            <label>
                                <div>Latitude</div>
                                <input type="number" min="-90" max="90" value={lat} onChange={(e) => setLat(e.target.value)}
                                />
                            </label>
                            {errors.lat && <p className="error">*{errors.lat}</p>}
                            <label>
                                <div>Longitude</div>
                                <input type="number" min="-180" max="180" value={lng} onChange={(e) => setLng(e.target.value)}
                                />
                            </label>
                            {errors.lng && <p className="error">*{errors.lng}</p>}
                        </section>
                        <section>
                            <h2 className="title">Descripe your place to guests</h2>
                            <div>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</div>
                            <label className="description">
                                <div>Description</div>
                                <textarea type="text" minLength="30" placeholder="Please write at least 30 characters" value={description} onChange={(e) => setDescription(e.target.value)}
                                required
                                />
                            </label>
                            {errors.description && <p className="error">*{errors.description}</p>}
                        </section>
                        <section>
                            <h2 className="title">Create a title for your spot</h2>
                            <div>Catch guests' attention with a spot title that highlights what makes your place special</div>
                            <label>
                                <div>Title</div>
                                <input type="text" placeholder="Name your spot" value={name} onChange={(e) => setName(e.target.value)}
                                required
                                />
                            </label>
                            {errors.name && <p className="error">*{errors.name}</p>}
                        </section>
                        <section>
                            <h2 className="title">Set a base price for your spot</h2>
                            <div>Competitive pricing can help your listing stand out and rank higher in serach results</div>
                            <label>
                                <div>Price</div>
                                <input type="number" placeholder="Price per night (USD)" value={price} onChange={(e) => setPrice(e.target.value)}
                                required
                                />
                            </label>
                            {errors.price && <p className="error">*{errors.price}</p>}
                        </section>
                    </div>
                    <button type="submit">Update Spot</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateSpotFormPage;

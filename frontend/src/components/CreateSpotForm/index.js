import "./CreateSpot.css";
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as spotActions from '../../store/spots';


const CreateSpotForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState(['', '', '', '']);
    const [previewImage, setPreviewImage] = useState('');
    const [submit, setSubmit] = useState(false);
    const [errors, setErrors] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {}
        if (!country) errors.country = "Country is required";
        if (!address) errors.address = "Address is required";
        if (!city) errors.city = "City is required";
        if (!state) errors.state = "State is required";
        if (!name) errors.name = "Name is required";
        if (!description || description.length < 30) errors.description = "Description needs 30 or more characters";
        if (!price) errors.price = "Price is required";
        if (!previewImage) errors.previewImage = "Preview Image URL is required";
        if (!images) {
            errors.images = "Image URL must end in .png, .jpg, or .jpeg";
        }
        setErrors(errors);

        if (Object.keys(errors).length === 0){
            setSubmit(true);

            const formData = {
                country,
                address: address,
                city,
                state,
                name: name,
                description,
                price: Number(price),
            }

            try{
               const spot = await dispatch(spotActions.createASpot(formData))
                await dispatch(spotActions.addSpotImage(spot.id, {
                    url: previewImage,
                    preview: true,
                }));

                images.forEach(async (image) => {
                    if (image) {
                        await dispatch(spotActions.addSpotImage(spot.id, {
                            url: image,
                            preview: false
                        }))
                    }
                })

                history.push(`/spots/${spot.id}`);

            } catch (error) {

                console.log("Couldn't create spot", error)
                setSubmit(false);

            }

        }

    };

    return (
        <div className="form">
            <h1>Create a New Spot</h1>
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
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country"
                        />
                        {errors.country && <p className="error-message">{errors.country}</p>}
                    </div>
                    <div className="form-input">
                        <label>Street Address</label>
                        <input
                            type='text'
                            id='streetAddress'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Street Address"
                        />
                        {errors.address && <p className="error-message">{errors.address}</p>}
                    </div>
                    <div className="form-input">
                        <label>City</label>
                        <input
                            type='text'
                            id='city'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                        />
                        {errors.city && <p className="error-message">{errors.city}</p>}
                    </div>
                    <div className="form-input">
                        <label>State</label>
                        <input
                            type='text'
                            id='state'
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State"
                        />
                        {errors.state && <p className="error-message">{errors.state}</p>}
                    </div>
                </section>
                <section>
                    <h2>Describe your place to guests</h2>
                    <p>
                        Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
                    </p>
                    <div className="form-input">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please write at least 30 characters"
                        ></textarea>
                        {errors.description && <p className="error-message">{errors.description}</p>}
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name of your spot"
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}
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
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price per night (USD)"
                        />
                        {errors.price && <p className="error-message">{errors.price}</p>}
                    </div>
                </section>
                <section>
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <div className="form-input">
                        <label>Country</label>
                        <input
                            type='text'
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                            placeholder="Preview Image URL"
                        />
                        {errors.previewImage && <p className="error-message">{errors.previewImage}</p>}
                    </div>
                    {images && images.map((url, index) => {
                        <div className="form-input" key={index}>
                        <input
                            type='text'
                            value={url}
                            onChange={(e) => {
                                const newImage = [...images];
                                newImage[index] = e.target.value;
                                setImages(newImage);
                            }}
                            placeholder="Image URL"
                        />
                        {errors.images && <p className="error-message">{errors.images}</p>}
                    </div>
                    })}
                </section>
                <button type="submit" disabled={submit}>Create Spot</button>
            </form>
        </div>
    );

}

export default CreateSpotForm;

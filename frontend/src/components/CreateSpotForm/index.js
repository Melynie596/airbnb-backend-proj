import "./CreateSpot.css";
import { useEffect, useState } from 'react';
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
    const [lat, setLat] = useState(80);
    const [lng, setLng] = useState(180);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [url, setUrl] = useState('')
    const [url2, setUrl2] = useState('')
    const [url3, setUrl3] = useState('')
    const [url4, setUrl4] = useState('')
    const [previewImage, setPreviewImage] = useState('');
    const [preview, setPreview] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [errors, setErrors] = useState({});


    useEffect(() => {

        const error = {}
        if (!country) error.country = "Country is required";
        if (!address) error.address = "Address is required";
        if (!city) error.city = "City is required";
        if (!state) error.state = "State is required";
        if (!name) error.name = "Name is required";
        if (!description || description.length < 30) error.description = "Description needs 30 or more characters";
        if (!price) error.price = "Price is required";
        if (!previewImage) {
            error.previewImage = "Preview Image URL is required";
        } else {
            if (!(previewImage.endsWith('.jpg') || previewImage.endsWith('.png') || previewImage.endsWith('.jpeg'))) {
                error.previewImage = "Image URL must end in .jpg, .png, or .jpeg"
            }

            if(url.length) {
                if (!(url.endsWith('.jpg') || url.endsWith('.png') ||url.endsWith('.jpeg'))) {
                    error.url = "Image URL must end in .jpg, .png, or .jpeg"
                }
            };

            if(url2.length) {
                if (!(url2.endsWith('.jpg') || url2.endsWith('.png') ||url2.endsWith('.jpeg'))) {
                    error.url2 = "Image URL must end in .jpg, .png, or .jpeg"
                }
            };

            if(url3.length) {
                if (!(url3.endsWith('.jpg') || url3.endsWith('.png') ||url3.endsWith('.jpeg'))) {
                    error.url3 = "Image URL must end in .jpg, .png, or .jpeg"
                }
            };

            if(url4.length) {
                if (!(url4.endsWith('.jpg') || url4.endsWith('.png') ||url4.endsWith('.jpeg'))) {
                    error.url4 = "Image URL must end in .jpg, .png, or .jpeg"
                }
            };
        }

        setErrors(error);
    }, [address, city, state, country, lat, lng, description, name, price, previewImage, url, url2, url3, url4])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmit(true);


        if (Object.keys(errors).length ){
            return alert('Errors have been found');
        }

            const formData = {
                country,
                address: address,
                city,
                state,
                lng,
                lat,
                name: name,
                description,
                price: Number(price),
            }

            let spot = await dispatch(spotActions.createASpot(formData));
            console.log(spot);

            const imgData = {
                previewImage,
                preview
            }

            const imgData2 = {
                url,
                preview
            }

            const imgData3 = {
                url2,
                preview
            }

            const imgData4 = {
                url3,
                preview
            }

            const imgData5 = {
                url4,
                preview
            }

            let spotImage;

            if (spot) {
                spotImage = await dispatch(spotActions.addSpotImage(`${spot?.spot?.id}`, imgData))
                if (url) {
                    let image2 = await dispatch(spotActions.addSpotImage(`${spot?.spot?.id}`, imgData2))
                }
                if (url2) {
                    let image3 = await dispatch(spotActions.addSpotImage(`${spot?.spot?.id}`, imgData3))
                }
                if (url3) {
                    let image4 = await dispatch(spotActions.addSpotImage(`${spot?.spot?.id}`, imgData4))
                }
                if (url4) {
                    let image5 = await dispatch(spotActions.addSpotImage(`${spot?.spot?.id}`, imgData5))
                }
            }

            history.push(`/spots/${spot?.spot?.id}`);
            setErrors({});
            setSubmit(false);



    };

    return (
        <div className="form">
            <h1 className="create-header">Create a New Spot</h1>
            <form onSubmit={handleSubmit}>
                <section>
                    <h2>Where's your place located?</h2>
                    <p className="section-description">
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
                            required
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
                            required
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
                            required
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
                            required
                        />
                        {errors.state && <p className="error-message">{errors.state}</p>}
                    </div>
                    <div className="form-input">
                        <label>Latitude</label>
                        <input
                            type='text'
                            id='lat'
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            placeholder="Latitude"
                        />
                    </div>
                    <div className="form-input">
                        <label>Longitude</label>
                        <input
                            type='text'
                            id='lng'
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            placeholder="Longitude"
                        />
                    </div>
                </section>
                <section>
                    <h2>Describe your place to guests</h2>
                    <p className="section-description">
                        Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.
                    </p>
                    <div className="form-input">
                        <textarea
                            value={description}
                            minLength={30}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please write at least 30 characters"
                            required
                        ></textarea>
                        {errors.description && <p className="error-message">{errors.description}</p>}
                    </div>
                </section>
                <section>
                    <h2>Create a title for your spot</h2>
                    <p className="section-description">
                        Catch your guests' attention with a spot title that highlights what makes your place special.
                    </p>
                    <div className="form-input">
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name of your spot"
                            required
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}
                    </div>
                </section>
                <section>
                    <h2>Set a base price for your spot</h2>
                    <p>
                        Competitive pricing can help your listing stand out and rank higher in search filters.
                    </p>
                    <div className="form-input price-input">
                        <label className="dollar-sign">
                            $
                        <input
                            type='number'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price per night (USD)"
                            required
                        />
                        </label>
                        {errors.price && <p className="error-message">{errors.price}</p>}
                    </div>
                </section>
                <section>
                    <h2>Liven up your spot with photos</h2>
                    <p className="section-description">Submit a link to at least one photo to publish your spot.</p>
                    <div className="form-input">
                        <input
                            type='string'
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                            placeholder="Preview Image URL"
                            required
                        />
                        {errors.previewImage && <p className="error-message">{errors.previewImage}</p>}
                    </div>
                    <div>
                        <input
                            type="string"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Image URL"
                        />
                    </div>
                    <div>
                        <input
                            type="string"
                            value={url2}
                            onChange={(e) => setUrl2(e.target.value)}
                            placeholder="Image URL"
                        />
                    </div>
                    <div>
                        <input
                            type="string"
                            value={url3}
                            onChange={(e) => setUrl3(e.target.value)}
                            placeholder="Image URL"
                        />
                    </div>
                    <div>
                        <input
                            type="string"
                            value={url4}
                            onChange={(e) => setUrl4(e.target.value)}
                            placeholder="Image URL"
                        />
                    </div>
                </section>
                <div className="create-button-container">
                    <button className="create-button" type="submit" disabled={submit}>Create Spot</button>
                </div>
            </form>
        </div>
    );

}

export default CreateSpotForm;

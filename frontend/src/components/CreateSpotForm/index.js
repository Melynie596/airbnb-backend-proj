import "./CreateSpot.css";
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as spotActions from '../../store/spots';
import FormInput from "./FormInput";

const spotInputs = [
    {
        id: 1,
        name: "country",
        type: "text",
        placeholder: "Country",
        errorMessage: "Country is required",
        label: "Country"
    },
    {
        id: 2,
        name: "address",
        type: "text",
        placeholder: "Address",
        errorMessage: "Address is required",
        label: "Address"
    },
    {
        id: 3,
        name: "city",
        type: "text",
        placeholder: "City",
        errorMessage: "City is required",
        label: "City"
    },
    {
        id: 4,
        name: "state",
        type: "text",
        placeholder: "STATE",
        errorMessage: "State is required",
        label: "State"
    },
    {
        id: 5,
        name: "name",
        type: "text",
        placeholder: "Name of your spot",
        errorMessage: "Name is required",
        label: "Catch guests' attention witha spot title that highlights what makes your place special."
    },
    {
        id: 6,
        name: "description",
        type: "text",
        placeholder: "Description",
        errorMessage: "Description needs a minimum of 30 characters",
        label: "Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood"
    },
    {
        id: 7,
        name: "price",
        type: "text",
        placeholder: "Price per night (USD)",
        errorMessage: "Price is required",
        label: "Competitive pricing can help your listing stand out and rank higher in search results."
    },
    {
        id: 8,
        name: "lat",
        type: "text",
        placeholder: "Latitude",
        errorMessage: "Latitude is required",
        label: "Latitude"
    },
    {
        id: 9,
        name: "lng",
        type: "text",
        placeholder: "Longitude",
        errorMessage: "Longitude is required",
        label: "Longitude"
    },

]

const CreateSpotForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [values, setValues] = useState({
        country: "",
        address: "",
        city: "",
        state: "",
        name: "",
        description: "",
        price: "",
        lat: "85",
        lng: "100"
    });
    const [images, setImages] = useState('');
    const preview = true;

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(spotActions.createASpot(values))
        .then(
            async (spot) => {
                const addImage = await dispatch(spotActions.addSpotImage(spot.id, {
                images,
                preview
            }));


            if (addImage) {
                history.push(`/api/spots/${spot.id}`)
            }

            });


    };


    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    }

    return (
        <div className='form'>
            <form onSubmit={handleSubmit}>
            <h1>Create a Spot</h1>
                <h3>Where's your place located?</h3>
                <p>Guests will only get your exact address once they booked a reservation</p>
                {spotInputs.map(spot => {
                   return <FormInput
                   key={spot.id}
                   {...spot}
                   value={values[spot.name]}
                   onChange={handleChange}
                   />
                })}

                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot</p>
                <FormInput
                type="text"
                value={images}
                onChange={(e) => setImages(e.target.value)}
                errorMessage="Preview image is required"
                placeholder="Preview Image URL"/>

                <button type="submit">Create a spot</button>
            </form>
        </div>
    );

}

export default CreateSpotForm;

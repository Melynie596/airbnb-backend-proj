import { useState } from "react";
import { useDispatch } from "react-redux";

import * as spotActions from '../../store/spots';

const CreateSpotForm = () => {
    const dispatch = useDispatch();
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('')
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(spotActions.createASpot({ country, address, city, state, name, description, price}))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors);
            }
        });
    }

    return (
        <div>
            <h1>Create a New Spot</h1>
            <h3>Where's your place located?</h3>
            <p>Guests will only get your exact address once they booked a reservation</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Country
                    <input
                        type='text'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </label>
                {errors.country && <p>{errors.country}</p>}
                <label>
                    Street Address
                    <input
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    />
                </label>
                {errors.address && <p>{errors.address}</p>}
                <label>
                    City
                    <input
                    type='text'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    />
                </label>
                {errors.city && <p>{errors.city}</p>}
                <label>
                    State
                    <input
                    type='text'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    />
                </label>
                {errors.state && <p>{errors.state}</p>}
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like
                fast wifi or parking, and what you love about the neighborhood.</p>
                <label>
                    <input
                    type='text'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    />
                </label>
                {errors.description && <p>{errors.description}</p>}
                <h3>Create a title for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes you place special</p>
                <label>
                    <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </label>
                {errors.name && <p>{errors.name}</p>}
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
                <label>
                    $
                    <input
                    type='text'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    />
                </label>
                {errors.price && <p>{errors.price}</p>}
            </form>

        </div>
    );
}

export default CreateSpotForm;

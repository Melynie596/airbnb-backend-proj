import { useState } from "react";
import "./FormInput.css"

const FormInput = (props) => {
    const [focus, setFocus] = useState(false);
    const { label,onChange, value, errorMessage, id, ...inputProps} = props;

    const handleFocus = (e) => {
        setFocus(true);
    }

    return (
        <div className='formInput'>
            <label>{label}</label>
            <input {...inputProps} value={value} onChange={onChange} onBlur={handleFocus} focus={focus.toString()}/>
            <span>{errorMessage}</span>
        </div>
    );
}

export default FormInput;

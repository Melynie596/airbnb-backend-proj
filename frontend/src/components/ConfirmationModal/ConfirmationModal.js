import React from "react";

const ConfirmationModal = ({ title, message, onAction}) => {
    const handleConfirm = () => {
        onAction(true);
    }

    const handleCancel = () => {
        onAction(false);
    }

    return (
        <div>
            <h3>{title}</h3>
            <p>{message}</p>
            <div>
                <button onClick={handleConfirm}>
                    Yes (Delete Spot)
                </button>
                <button onClick={handleCancel}>
                    No (Keep Spot)
                </button>
            </div>
        </div>
    )
};

export default ConfirmationModal;

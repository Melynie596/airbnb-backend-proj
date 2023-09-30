import React from 'react';
import SpotDetail from '../SpotDetail';

const CloseReviewModal = ({ closeModal }) => {

  const handleModalClose = () => {
    closeModal();
  };

  return (
    <div>
      <SpotDetail onClose={handleModalClose} />
    </div>
  );
};

export default CloseReviewModal;

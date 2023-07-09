import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import css from './Modal.module.css';

const Modal = props => {
  // const { onCloseModal } = props;

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        props.onCloseModal();
      }
    };

    const scrollPosition = window.scrollY;
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.height = 'auto';
      document.body.style.overflow = 'auto';
      window.scrollTo(0, scrollPosition);
    };
  }, [props]);

  const handleOverlayClick = event => {
    if (event.currentTarget === event.target) {
      props.onCloseModal();
    }
  };

  return (
    <div className={css.Modal} onClick={handleOverlayClick}>
      <img
        className={css.LargeImage}
        src={props.selectedImage.largeImageURL}
        alt={props.selectedImage.tags}
      />
      <button onClick={props.onCloseModal} className={css.CloseBtn}>
        &times;
      </button>
    </div>
  );
};

Modal.propTypes = {
  selectedImage: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onCloseModal: PropTypes.func.isRequired,
};

export default Modal;

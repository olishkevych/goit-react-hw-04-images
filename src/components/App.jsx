import React, { useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';

import { SearchBar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';

import { fetchImages } from '../services/api/fetch';

import css from './App.module.css';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal/Modal';
import { toastConfig } from 'services/toastify/toastConfig';
import { Loader } from './Loader/Loader';

export const App = () => {
  const [images, setImages] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [totalHits, setTotalHits] = useState(0);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState({ isOpen: false, selectedImage: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchText) return;

    async function handleFetchRequest() {
      try {
        setIsLoading(true);
        const { totalHits, hits } = await fetchImages(searchText, page);
        if (!totalHits) {
          toast.warning(`No images found`, toastConfig);
          return;
        }

        if (page === 1) {
          toast.success(`We've found ${totalHits} images`, toastConfig);
        }

        setImages(images => [...images, ...hits]);
        setTotalHits(totalHits);
      } catch (err) {
        setError(error => err.message);
        toast.warning(`Something went wrong. ${error}`, toastConfig);
      } finally {
        setIsLoading(false);
      }
    }
    handleFetchRequest();
  }, [searchText, page, error]);

  const onSubmit = query => {
    if (searchText === query) {
      toast.warning('Search results are already displayed');
      return;
    }
    setSearchText(query);
    setPage(1);
    setImages([]);
  };

  const handleBtnClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const onOpenModal = selectedImage => {
    setModal({ isOpen: true, selectedImage });
  };

  const onCloseModal = () => {
    setModal({ isOpen: false, selectedImage: null });
  };

  return (
    <div className={css.App}>
      <ToastContainer />
      <SearchBar onSubmit={onSubmit} />

      {totalHits > 0 && (
        <ImageGallery images={images} onOpenModal={onOpenModal} />
      )}

      {!isLoading && images.length !== totalHits && (
        <Button handleBtnClick={handleBtnClick} />
      )}

      {isLoading && <Loader />}

      {modal.isOpen && (
        <Modal
          onCloseModal={onCloseModal}
          selectedImage={modal.selectedImage}
        />
      )}
    </div>
  );
};

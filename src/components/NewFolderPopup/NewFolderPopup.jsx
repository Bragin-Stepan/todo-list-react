import React from 'react';
import './NewFolderPopup.scss';

import { Col, Button } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';

export default function NewFolderPopup({
  closePopup,
  openPopup,
  inputValue,
  onValueInput,
  setInputValue,
  popupRef,
  addList,
  isLoading,
}) {
  return (
    <>
      {openPopup && (
        <div className="popup__overlay d-flex align-items-center justify-content-center">
          <div
            className="popup__wrapper d-flex align-items-center"
            ref={popupRef}
          >
            <div className="popup__content m-4">
              <IoClose className="popup__button-close" onClick={closePopup} />
              <Col>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    addList(inputValue);
                    closePopup();
                    console.log('Добавил через Enter');
                  }}
                >
                  <div className="popup__input">
                    <input
                      type="text"
                      placeholder="Введите название"
                      onChange={onValueInput}
                      value={inputValue}
                    />
                    <IoClose
                      className="input__button-clear"
                      onClick={setInputValue}
                    />
                  </div>
                </form>
              </Col>
              <Button className={'mt-3'} onClick={addList} disabled={isLoading}>
                {isLoading ? (
                  <div>
                    <span className="spinner-border spinner-border-sm mx-2 text-warning"></span>
                    Добавление..
                  </div>
                ) : (
                  'Добавить'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

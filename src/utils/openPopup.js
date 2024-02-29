import React from 'react';

//========================= Закрывает Popup =========================

export default function openPopup() {
  const [closePopup, setClosePopup] = React.useState(false);
  const togglePopup = () => {
    setClosePopup(!closePopup);
  };
  // Закрытие при клике вне окна
  const popupRef = React.useRef();
  React.useEffect(() => {
    // Функция обработчика события для закрытия окна при клике вне его области
    const handleClickOutside = event => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        togglePopup();
      }
    };
    // Добавляет и удаляет обработчик события
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [togglePopup]);

  return { togglePopup, closePopup, popupRef };
}

import './Sidebar.scss';
import React from 'react';
import axios from 'axios';

import { Container, Row } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa6';
import { IoIosClose } from 'react-icons/io';

import openPopup from '../../utils/openPopup';
import NewFolderPopup from '../NewFolderPopup/NewFolderPopup';

export default function Sidebar({
  items,
  onAddList,
  onRemove,
  onClickItem,
  onClickAll,
  isLoading,
  setIsLoading,
  activeList,
}) {
  //============= Закрывает Popup =============
  const { closePopup, togglePopup, popupRef } = openPopup();

  //============= Принимает значение =============
  const [inputValue, setInputValue] = React.useState('');
  const onValueInput = e => {
    const newValue = e.target.value;
    // Проверяет текст на пробелы без текста
    if (newValue.match(/^\s+$/)) {
      setInputValue(inputValue);
    } else {
      setInputValue(newValue);
    }
  };

  //============= Добавляет папки =============
  const addList = () => {
    if (!inputValue) {
      togglePopup();
    } else {
      setIsLoading(true);
      axios
        .post('http://localhost:3000/lists/', {
          name: inputValue,
        })
        .then(({ data }) => {
          const listObj = { ...data, tasks: [] };
          onAddList(listObj);
          setInputValue('');
          togglePopup();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  //============= Удаление всей папки =============
  const removeList = item => {
    if (confirm('Вы действительно хотите удалить список?')) {
      setIsLoading(true);
      // console.log(activeList.tasks.map(task => task.id));

      //============= Удаляет список
      const taskIds = activeList.tasks.map(task => task.id);
      const deleteTask = async taskId => {
        try {
          await axios.delete(`http://localhost:3000/tasks/${taskId}`);
        } catch (error) {
          console.error(`Ошибка при удалении задачи с id ${taskId}:`, error);
        }
      };
      // Функция для удаления нескольких задач
      const deleteTasks = async taskIds => {
        if (taskIds.length > 0) {
          try {
            for (const taskId of taskIds) {
              await deleteTask(taskId);
            }
          } catch (error) {
            console.error('Ошибка при удалении задач:', error);
          }
        }
      };
      deleteTasks(taskIds);
      //============= Удаляет папку
      axios
        .delete('http://localhost:3000/lists/' + item.id)
        .then(() => {
          onRemove(item.id);
          onClickAll();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <div className="todo__sidebar p-3 mx-1">
        <Container>
          <Row>
            <h3 className="sidebar__title" onClick={() => onClickAll()}>
              Заметки
            </h3>
          </Row>
        </Container>

        <ul className="sidebar__folders-list mt-2">
          {/* ======================= Список папок ======================= */}
          {items.map(item => (
            <li
              onClick={onClickItem ? () => onClickItem(item) : null}
              key={item.id}
              className={`folders-list__item px-3 py-3 mb-3 align-items-center text-start d-flex justify-content-between ${
                activeList && activeList.id === item.id ? 'active' : ''
              }`}
            >
              {item.name}
              <IoIosClose
                className="sidebar__button-delete"
                onClick={() => removeList(item)}
              />
            </li>
          ))}

          <li
            className="sidebar__new-folder py-3"
            onClick={() => togglePopup()}
          >
            {isLoading ? (
              <div>
                <span className="spinner-border spinner-border-sm text-warning"></span>
              </div>
            ) : (
              <FaPlus />
            )}
          </li>
        </ul>
        {/* ======================= Всплывающее окно для новой папки (NewFolderPopup) ======================= */}
        <NewFolderPopup
          inputValue={inputValue}
          onValueInput={onValueInput}
          setInputValue={() => setInputValue('')}
          openPopup={closePopup}
          closePopup={() => (togglePopup(), setInputValue(''))}
          popupRef={popupRef}
          addList={() => addList()}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}

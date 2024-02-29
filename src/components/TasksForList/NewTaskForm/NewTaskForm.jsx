import './NewTaskForm.scss';
import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa6';

export default function NewTasksForm({
  isLoading,
  addTask,
  openForm,
  toggleForm,
  onValueInput,
  inputValue,
}) {
  return (
    <div className="new-task__form">
      {openForm ? (
        <div className="new-task__add" onClick={toggleForm}>
          <FaPlus className="new-task__icon-plus " />
          <span className="">Новая задача</span>
        </div>
      ) : (
        <div className="form__container ">
          <form
            onSubmit={e => {
              e.preventDefault();
              addTask(inputValue);
              toggleForm();
              console.log('Добавил через Enter');
            }}
          >
            <div className="form__input">
              <input
                type="text"
                placeholder="Введите текст"
                onChange={onValueInput}
                value={inputValue}
                onInvalid={e => e.target.setCustomValidity('asdasdasd')}
                onInput={e => e.target.setCustomValidity('')}
              />
            </div>
          </form>
          <div className="mt-3">
            <Button
              className={`btn-light ${isLoading ? '' : ''}`}
              onClick={addTask}
            >
              {isLoading ? <div>Добавление...</div> : 'Добавить'}
            </Button>
            <Button
              className="btn-outline-secondary mx-3"
              disabled={isLoading}
              onClick={toggleForm}
            >
              Отмена
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

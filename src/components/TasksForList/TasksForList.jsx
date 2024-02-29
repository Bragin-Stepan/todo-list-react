import React from 'react';
import axios from 'axios';

import Task from './Task/Task';
import NewTaskForm from './NewTaskForm/NewTaskForm';

export default function TaskForList({
  activeList,
  itemsList,
  onAddTask,
  isLoading,
  onRemoveTask,
  setIsLoading,
  onCompleteTask,
}) {
  //============= Принимает значение новой задачи =============
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

  const [openForm, setOpenForm] = React.useState(true);
  const toggleForm = () => {
    setOpenForm(!openForm);
    setInputValue('');
  };
  //============= добавляет задачу =============
  const addTask = () => {
    if (!inputValue) {
      toggleForm();
    } else {
      const obj = {
        listId: activeList.id,
        text: inputValue,
        completed: false,
      };
      setIsLoading(true);
      axios
        .post('http://localhost:3000/tasks', obj)
        .then(({ data }) => {
          onAddTask(activeList.id, data);
          toggleForm();
        })
        .catch(() => {
          alert('Ошибка при добавлении задачи!');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <div className="todo__content">
      {/* ======================= Задачи (Task) ======================= */}
      <ul className="text-start mt-4">
        {activeList &&
          itemsList &&
          activeList.tasks.map(task => (
            <Task
              activeList={activeList}
              inputValue={inputValue}
              onComplete={onCompleteTask}
              key={task.id}
              id={task.id}
              text={task.text}
              removeItem={onRemoveTask}
              completed={task.completed}
            />
          ))}
        {/* ======================= Новая задача (NewTaskForm) ======================= */}
        <li onClick={onAddTask}>
          <NewTaskForm
            onAddTask={onAddTask}
            addTask={addTask}
            setIsLoading={setIsLoading}
            openForm={openForm}
            onValueInput={onValueInput}
            inputValue={inputValue}
            isLoading={isLoading}
            toggleForm={toggleForm}
          />
        </li>
      </ul>
    </div>
  );
}

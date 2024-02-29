import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import axios from 'axios';

import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { MdModeEditOutline } from 'react-icons/md';

import Sidebar from './components/Sidebar/Sidebar';
import TasksForList from './components/TasksForList/TasksForList';

export default function App() {
  //============= activeItem =============
  const [activeItem, setActiveItem] = React.useState(null);

  //============= Получаем таблицы с fake-json сервера =============
  React.useEffect(() => {
    axios
      .get('http://localhost:3000/lists?_embed=tasks')
      .then(res => {
        setItemsList(res.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
      });
  }, []);

  //============= Загрузка =============
  const [isLoading, setIsLoading] = React.useState(false);

  //============= Список папок =============
  const [itemsList, setItemsList] = React.useState([]);
  const onAddList = obj => {
    setItemsList([...itemsList, obj]);
  };

  //============= Добавляет задачу =============
  const onAddTask = (listId, taskObj) => {
    const newList = itemsList.map(item => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    setItemsList(newList);
  };

  //============= Задача выполнена  =============
  const onCompleteTask = (listId, taskId, completed) => {
    const newList = itemsList.map(list => {
      if (list.id === listId) {
        list.tasks = list.tasks.map(task => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    setItemsList(newList);
    axios
      .patch('http://localhost:3000/tasks/' + taskId, {
        completed,
      })
      .catch(() => {
        alert('Не удалось обновить задачу');
      });
  };

  //============= Удаление задачи =============
  const onRemoveTask = (listId, taskId) => {
    if (window.confirm('Вы действительно хотите удалить?')) {
      const newList = itemsList.map(item => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter(task => task.id !== taskId);
        }
        return item;
      });
      setItemsList(newList);
      axios.delete('http://localhost:3000/tasks/' + taskId).catch(() => {
        alert('Не удалось удалить задачу');
      });
    }
  };

  //============= Изменить название папки =============
  const onEditListTitle = (id, title) => {
    const newList = itemsList.map(item => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setItemsList(newList);
  };
  const editTitle = () => {
    const newTitle = window.prompt(
      'Введите новое название папки',
      activeItem.name
    );
    if (newTitle) {
      onEditListTitle(activeItem.id, newTitle);
      axios
        .patch('http://localhost:3000/lists/' + activeItem.id, {
          name: newTitle,
        })
        .catch(() => {
          alert('Не удалось обновить название списка');
        });
    }
  };

  //============= Хуки для react-router =============
  let navigate = useNavigate();
  let location = useLocation();
  React.useEffect(() => {
    const listId = location.pathname.split('lists/')[1];
    if (itemsList) {
      const list = itemsList.find(list => list.id === listId);
      setActiveItem(list);
    }
  }, [location.pathname]);

  return (
    <>
      <Container className="todo px-4 py-3">
        <Row>
          <Col className="p-0">
            {/* ======================= Папки (Sidebar) ======================= */}
            <Sidebar
              items={itemsList}
              onRemove={id => {
                const newLists = itemsList.filter(item => item.id !== id);
                setItemsList(newLists);
              }}
              setIsLoading={setIsLoading}
              onAddList={onAddList}
              onClickItem={list => {
                navigate(`/lists/${list.id}`);
              }}
              onClickAll={() => {
                navigate('/');
              }}
              itemsList={itemsList}
              setItemsList={setItemsList}
              activeList={activeItem}
              isLoading={isLoading}
            />
          </Col>
          <Col md={12} lg={8} className="d-flex">
            <Container className="todo__main">
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    itemsList &&
                    itemsList.map(list => (
                      <div className="todo__all-tasks" key={list.id}>
                        <div>
                          <b className="todo__main-title">
                            {list && list.name}
                          </b>
                          <MdModeEditOutline
                            className="todo__button-edit"
                            onClick={editTitle}
                          />
                        </div>

                        <TasksForList
                          key={list.id}
                          onRemoveTask={onRemoveTask}
                          onAddTask={onAddTask}
                          onCompleteTask={onCompleteTask}
                          activeList={list}
                          itemsList={itemsList}
                          setIsLoading={setIsLoading}
                          isLoading={isLoading}
                        />
                      </div>
                    ))
                  }
                />
                <Route
                  path="/lists/:id"
                  element={
                    activeItem ? (
                      <div>
                        {/* ======================= Main title ======================= */}
                        {isLoading ? (
                          <div className="spinner-border text-dark mt-3"></div>
                        ) : (
                          <div>
                            <b className="todo__main-title">
                              {activeItem && activeItem.name}
                            </b>
                            <MdModeEditOutline
                              className="todo__button-edit"
                              onClick={editTitle}
                            />
                          </div>
                        )}
                        {/* ======================= Задачи (TasksForList) ======================= */}

                        <TasksForList
                          onRemoveTask={onRemoveTask}
                          onAddTask={onAddTask}
                          onCompleteTask={onCompleteTask}
                          activeList={activeItem}
                          itemsList={itemsList}
                          setIsLoading={setIsLoading}
                          isLoading={isLoading}
                        />
                      </div>
                    ) : (
                      <div className="todo__lack-of-tasks d-flex align-items-center">
                        <span className="text-white">
                          Выбирете или создайте новую папку
                        </span>
                      </div>
                    )
                  }
                />
              </Routes>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}

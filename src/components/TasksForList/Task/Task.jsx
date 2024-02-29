import './Task.scss';
import React from 'react';

import { IoIosClose } from 'react-icons/io';

export default function Task({
  id,
  text,
  removeItem,
  inputValue,
  activeList,
  onComplete,
  completed,
}) {
  const onTaskDone = e => {
    onComplete(activeList.id, id, e.target.checked);
  };
  return (
    <>
      <li className="mb-3 todo__task">
        <div className="form-check align-items-center d-flex justify-content-between d-flex justify-content-between">
          <div className="align-items-center d-flex">
            <input
              className="form-check-input mr-auto p-2"
              type="checkbox"
              id={id}
              // onChange={() => (toggleTaskDone(), onComplete())}
              onChange={onTaskDone}
              value={inputValue}
              defaultChecked={completed}
            />
            <label
              className={`${completed ? 'text-decoration-line-through' : ''}`}
              htmlFor={id}
            >
              {text}
            </label>
          </div>
          <div className="task__dashed"></div>
          <div>
            <IoIosClose
              className="task__icon-remove"
              onClick={() => removeItem(activeList.id, id)}
            />
          </div>
        </div>
      </li>
    </>
  );
}

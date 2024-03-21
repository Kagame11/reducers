import { useState, useReducer } from 'react';

// Action Types
const ADD_TASK = 'ADD_TASK';
const CHANGE_TASK = 'CHANGE_TASK';
const DELETE_TASK = 'DELETE_TASK';
const EDIT_TASK = 'EDIT_TASK';

// Reducer function
function taskReducer(state, action) {
  switch (action.type) {
    case ADD_TASK:
      return [
        ...state,
        {
          id: action.payload.id,
          text: action.payload.text,
          done: false,
        },
      ];
    case CHANGE_TASK:
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, done: !task.done } : task
      );
    case DELETE_TASK:
      return state.filter((task) => task.id !== action.payload.id);
    case EDIT_TASK:
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, text: action.payload.text } : task
      );
    default:
      return state;
  }
}

export default function TaskApp() {
  const initialTasks = [
    { id: 0, text: 'Visit kafka museum', done: true },
    { id: 1, text: 'watch a puppet show', done: false },
    { id: 2, text: 'Lennon wall pic', done: false },
  ];

  const [state, dispatch] = useReducer(taskReducer, initialTasks);
  let nextId = 3;

  // Define AddTask component
  function AddTask({ dispatch }) {
    const [text, setText] = useState('');

    function handleSubmit(e) {
      e.preventDefault();
      dispatch({ type: ADD_TASK, payload: { id: nextId++, text: text } });
      setText('');
    }

    function handleChange(e) {
      setText(e.target.value);
    }

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Enter task"
        />
        <button type="submit">Add Task</button>
      </form>
    );
  }

  // Define Task component
  function Task({ task, dispatch }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(task.text);

    function handleEdit() {
      setIsEditing(true);
    }

    function handleSave() {
      dispatch({ type: EDIT_TASK, payload: { id: task.id, text: editedText } });
      setIsEditing(false);
    }

    return (
      <li>
        {!isEditing ? (
          <>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => dispatch({ type: CHANGE_TASK, payload: { id: task.id } })}
            />
            <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
              {task.text}
            </span>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={() => dispatch({ type: DELETE_TASK, payload: { id: task.id } })}>
              Delete
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
          </>
        )}
      </li>
    );
  }

  // Define TaskList component
  function TaskList({ tasks, dispatch }) {
    return (
      <ul>
        {tasks.map((task) => (
          <Task key={task.id} task={task} dispatch={dispatch} />
        ))}
      </ul>
    );
  }

  return (
    <>
      <h1>Pague itinerary</h1>
      <AddTask dispatch={dispatch} />
      <TaskList tasks={state} dispatch={dispatch} />
    </>
  );
}


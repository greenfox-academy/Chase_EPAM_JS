import React from 'react';
import ReactDom from 'react-dom';
import { createStore, combineReducers } from 'redux';
import TodoList from './TodoList.js';

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };
    case 'TOGGLE_TODO':
      if (action.id === state.id) {
        return Object.assign({}, state, {completed: !state.completed});
      }
      return state;
    default: 
      return state;
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todoApp =combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter,
});

const store = createStore(todoApp);

let nextTodoId = 0;
class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.toggleTodo = this.toggleTodo.bind(this);
  }

  toggleTodo(id) {
    store.dispatch({
      type: 'TOGGLE_TODO',
      id,  
    });
  }

  render() {
      console.log(this.props === store.getState);
    return (
      <div>
        <input ref={node => {this.input = node}} />
        <button onClick={() => {store.dispatch({
              type: 'ADD_TODO',
              text: this.input.value,
              id: nextTodoId++,
            });
            this.input.value = '';
          }
        }>
          Add Todo
        </button> 
        <TodoList todos={this.props.todos}
          toggleTodo={this.toggleTodo} />
        {/* <Filter /> */}
      </div>
    )
  }
}

const render = () => {
    ReactDom.render(
      <TodoApp {...store.getState()}/>, 
      document.getElementById('root')
    );
};

store.subscribe(render);
render();
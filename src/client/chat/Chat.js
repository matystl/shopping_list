import React from 'react';
import {Link} from 'react-router';
import {syncStartTodo, syncStopTodo, onEditItemText, onTodoInputKeyDown, onFocus} from './actions';
import {getNewTodo, getItems, getFocus, getOrderedItems, getPendingActions} from './store_get';



class TodoItem extends React.Component {

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.focus !== this.props.focus && this.props.focus) {
      React.findDOMNode(this.refs.textInput).focus();
    }
  };

  componentDidMount() {
    if (this.props.focus) {
      React.findDOMNode(this.refs.textInput).focus();
    }
  }

  render() {
    const todo = this.props.todo;
    return (
      <li>
        <span>{(todo.get('checked'))? 'X' : 'O'}</span>
        <span>{(this.props.focus)? 'F' : 'f'}</span>
        <input
          ref="textInput"
          className="new-todo"
          name="text"
          onKeyDown={(_) => onTodoInputKeyDown(_, todo.get("id"))}
          onFocus={(_) => onFocus(todo.get("id"))}
          onChange={(_) => onEditItemText(_, todo.get("id"))}
          value={todo.get('text')}
        />
        <span>{todo.get('id')}</span>
      </li>
    );
  }
}

class TodoList extends React.Component {
 render() {
   console.log(`render called on TodoList`);
   //console.log(`This is my props for TodoList ${this.props.todos}`);
   const focusId = getFocus();
   return (
     <ol>
       {this.props.todos.map((todo) => {
         const id = todo.get('id');
         return <TodoItem todo={todo} key={id} focus={focusId === id} />;
       })}
     </ol>
   );
 }
}



export default class Chat extends React.Component {


  componentWillMount() {
    this.chatId = this.context.router.getCurrentParams().id;
    console.log("Main subpage Chat will mount "+ this.chatId);
  }

  componentWillUnmount () {
    console.log("Main subpage Chat will unmount "+ this.chatId);
  }

  componentWillUpdate(nextProps, nextState) {
    this.chatId = this.context.router.getCurrentParams().id;
  }

  render() {
    return (
      <div>
        <p>
          This is todo list with id {this.chatId}
          <br/>
          Todos: Pending actions {getPendingActions()}
          <TodoList todos={getOrderedItems()} />
          <br/>
          <Link to="home">home</Link>.
        </p>
      </div>
    );
  }

}

Chat.willTransitionTo = (transition, params) => {
  console.log(`Will transition to ${params.id}`);
  syncStartTodo(params.id);
}

Chat.willTransitionFrom = (transition, component) => {
  console.log(`Will transition from ${component.chatId}`);
  syncStopTodo(component.chatId);
}

//static property on class not sure if i can define it in class
Chat.contextTypes = {
  router: React.PropTypes.func
}

import { FC } from 'react'

import { TodoItem } from './TodoItem'
import { ITodo } from '../store/todosSlice'

interface TodoListProps {
  todos: ITodo[]
}

export const TodoList: FC<TodoListProps> = ({ todos }) => {
  return (
    <div className="main__todoList todoList">
      {todos.map((todo) => {
        return <TodoItem todo={todo} key={todo.id} />
      })}
    </div>
  )
}

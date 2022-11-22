import { TodoItem } from './TodoItem'

export function TodoList({ todos }) {
  return (
    <div className="main__todoList todoList">
      {todos.map((todo) => {
        return <TodoItem todo={todo} key={todo.id} />
      })}
    </div>
  )
}

import { TodoItem } from './TodoItem'
/**
 * @typedef {import ("./TodoItem").Todo[]} Todos
 */

/**
 * Компонент, отображающий список задач.
 * @param {{todos: Todos}} todos список задач
 */
export function TodoList({ todos }) {
  return (
    <div className="main__todoList todoList">
      {todos.map((todo) => {
        return <TodoItem todo={todo} key={todo.id} />
      })}
    </div>
  )
}

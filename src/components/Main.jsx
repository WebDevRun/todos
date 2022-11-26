import { useEffect, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { AddTodoButton } from './AddTodoButton'
import { AddTodoForm } from './AddTodoFrom'
import { TodoList } from './TodoList'
import { database } from '../firebase'

/** Компонент, отображающий основную информацию на сайте. */
export function Main() {
  const [todos, setTodos] = useState(null)
  const [openForm, setOpenForm] = useState(false)

  useEffect(() => {
    const starCountRef = ref(database, 'todos/')
    onValue(starCountRef, (snapshot) => {
      /** @type {{[key: string]: import ("./TodoItem").Todo} | null} */
      const data = snapshot.val()
      if (!data) {
        return setTodos(null)
      }
      const dataValues = Object.values(data)
      setTodos(dataValues)
    })
  }, [])

  return (
    <main className="main">
      {todos && <TodoList todos={todos} />}
      <AddTodoButton setOpenForm={setOpenForm} />
      {openForm && (
        <AddTodoForm openForm={openForm} setOpenForm={setOpenForm} />
      )}
    </main>
  )
}

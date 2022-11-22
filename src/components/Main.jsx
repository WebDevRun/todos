import { useEffect, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { AddTodoButton } from './AddTodoButton'
import { AddTodoForm } from './AddTodoFrom'
import { TodoList } from './TodoList'
import { database } from '../firebase'

export function Main() {
  const [todos, setTodo] = useState([])
  const [openForm, setOpenForm] = useState(false)

  useEffect(() => {
    const starCountRef = ref(database, 'todos/')
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val()
      const dataValues = Object.values(data)
      setTodo(dataValues)
    })
  }, [])

  return (
    <main className="main">
      <TodoList todos={todos} />
      <AddTodoButton setOpenForm={setOpenForm} />
      {openForm && (
        <AddTodoForm openForm={openForm} setOpenForm={setOpenForm} />
      )}
    </main>
  )
}

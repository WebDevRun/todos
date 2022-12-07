import { FC, useEffect, useState } from 'react'

import { TodoList } from './TodoList'
import { AddTodoButton } from './AddTodoButton'
import { AddTodoForm } from './AddTodoForm'
import { Loader } from './Loader'

import { getTodos } from '../store/todosSlice'
import { useAppDispatch, useAppSelector } from '../hooks/store'

export const Main: FC = () => {
  const [openForm, setOpenForm] = useState(false)
  const { todos, loading, error } = useAppSelector((state) => state.todos)

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (loading === 'idle') void dispatch(getTodos())
  }, [loading, dispatch])

  return (
    <main className="main">
      {loading === 'loading' && <Loader />}
      {error !== undefined && <p>{error}</p>}
      {todos !== null && <TodoList todos={todos} />}
      <AddTodoButton setOpenForm={setOpenForm} />
      {openForm && (
        <AddTodoForm openForm={openForm} setOpenForm={setOpenForm} />
      )}
    </main>
  )
}

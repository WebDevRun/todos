import { FC, ChangeEventHandler, useEffect, useRef, useState } from 'react'

import { DeleteTodoForm } from './DeleteTodoForm'
import { UpdateTodoForm } from './UpdateTodoForm'
import { Error } from './Error'

import { ITodo, setComplite } from '../store/todosSlice'
import { useAppDispatch, useAppSelector } from '../hooks/store'

interface TodoItemProps {
  todo: ITodo
}

export const TodoItem: FC<TodoItemProps> = ({ todo }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const articleRef = useRef<HTMLElement>(null)
  const dispatch = useAppDispatch()
  const { error } = useAppSelector((state) => state.todos)

  const checkboxOnChangeHandler: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    void dispatch(setComplite({ ...todo, complite: event.target.checked }))
  }
  const updateButtonClickHandler = (): void =>
    setOpenUpdateModal((prev) => !prev)
  const deleteButtonClickHandler = (): void =>
    setOpenDeleteModal((prev) => !prev)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const nowDate = Date.now()
    const endDate = Number(new Date(todo.endDate))

    if (endDate <= nowDate) articleRef.current?.classList.add('item_expired')
    if (endDate > nowDate && !todo.complite) {
      articleRef.current?.classList.remove('item_expired')
      timer = setTimeout(() => {
        articleRef.current?.classList.add('item_expired')
      }, endDate - nowDate)
    }
    if (todo.complite) {
      clearTimeout(timer)
      articleRef.current?.classList.remove('item_expired')
    }

    return () => clearTimeout(timer)
  }, [todo.endDate, todo.complite])

  useEffect(() => {
    if (todo.complite) articleRef.current?.classList.add('item_ready')
    else articleRef.current?.classList.remove('item_ready')
  }, [todo.complite])

  const endDateTime = (): string => {
    return new Date(todo.endDate).toLocaleString()
  }

  return (
    <>
      <article ref={articleRef} className={`todoList__item`}>
        <h2 className="todoList__title">{todo.title}</h2>
        <p className="todoList__endDate">{`Дата завершения: ${endDateTime()}`}</p>
        <p className="todoList__description">{todo.description}</p>
        {todo.uploadFilesData !== undefined && (
          <div className="todoList__files">
            <p>Файлы: </p>
            {todo.uploadFilesData.map((file) => (
              <a key={file.url} href={file.url}>
                {`${file.name} (${file.size} байт)`}
              </a>
            ))}
          </div>
        )}
        <div className="todoList__complite">
          <label>
            <input
              type="checkbox"
              name="todo"
              id="todo"
              checked={todo.complite}
              onChange={checkboxOnChangeHandler}
            />
            <p>Статус: {todo.complite ? 'завершен' : 'не завершен'}</p>
          </label>
        </div>
        <div className="todoList__controls">
          <input
            className="todoList__update"
            type="button"
            value="Изменить"
            onClick={updateButtonClickHandler}
          />
          <input
            className="todoList__delete"
            type="button"
            value="Удалить"
            onClick={deleteButtonClickHandler}
          />
        </div>
        {error !== undefined && <Error errorMessage={error} />}
      </article>
      {openUpdateModal && (
        <UpdateTodoForm
          openModal={openUpdateModal}
          setOpenModal={setOpenUpdateModal}
          todo={todo}
        />
      )}
      {openDeleteModal && (
        <DeleteTodoForm
          openModal={openDeleteModal}
          setOpenModal={setOpenDeleteModal}
          todoId={todo.id}
        />
      )}
    </>
  )
}

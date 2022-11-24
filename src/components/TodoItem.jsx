import { useState } from 'react'
import { DeleteTodoForm } from './DeleteTodoForm'
import { UpdateTodoForm } from './UpdateTodoForm'
import { ref as refDB, update } from 'firebase/database'
import { database } from '../firebase'

export function TodoItem({ todo }) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const checkboxOnChangeHandler = () => {
    update(refDB(database, `todos/${todo.id}`), {
      ...todo,
      complite: !todo.complite,
    })
  }
  const updateButtonClickHandler = () => setOpenUpdateModal((prev) => !prev)
  const deleteButtonClickHandler = () => setOpenDeleteModal((prev) => !prev)

  return (
    <>
      <article className="todoList__item">
        <h2 className="todoList__title">{todo.title}</h2>
        <p className="todoList__endDate">{todo.endDate}</p>
        <p className="todoList__description">{todo.description}</p>
        {todo.uploadFilesData?.length && (
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
            Статус: {todo.complite ? 'завершен' : 'не завершен'}
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
          deleteTodo={{ id: todo.id, uploadFilesData: todo.uploadFilesData }}
        />
      )}
    </>
  )
}

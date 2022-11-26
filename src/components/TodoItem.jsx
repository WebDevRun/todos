import { useEffect, useMemo, useRef, useState } from 'react'
import { DeleteTodoForm } from './DeleteTodoForm'
import { UpdateTodoForm } from './UpdateTodoForm'
import { Error } from './Error'
import { ref as refDB, update } from 'firebase/database'
import { database } from '../firebase'
/**
 * @typedef FileInfo загружаемый файл
 * @property {string} name название файла
 * @property {string} url ссылка на файл
 * @property {number} size размер файла
 */

/**
 * @typedef Todo задача
 * @property {string} id уникальный идентификатор
 * @property {string} title заголовок
 * @property {string} [description] описание
 * @property {string} endDate дата завершения
 * @property {boolean} complite статус выполнения
 * @property {FileInfo[]} [uploadFilesData] список загружаемых файлов
 */

/**
 * Компонент, отображающий задачу.
 * @param {{todo: Todo}} todo
 */
export function TodoItem({ todo }) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [error, setError] = useState(null)
  const articleRef = useRef()
  /** Функция, обновляющая статус на сервере. */
  const checkboxOnChangeHandler = () => {
    try {
      update(refDB(database, `todos/${todo.id}`), {
        ...todo,
        complite: !todo.complite,
      })
    } catch (error) {
      setError(error.message)
    }
  }
  /** Функция, инвертирующая состояние openUpdateModal. */
  const updateButtonClickHandler = () => setOpenUpdateModal((prev) => !prev)
  /** Функция, инвертирующая состояние openDeleteModal. */
  const deleteButtonClickHandler = () => setOpenDeleteModal((prev) => !prev)

  useEffect(() => {
    let timer
    const nowDate = Date.now()
    const endDate = Number(new Date(todo.endDate))

    if (endDate <= nowDate) articleRef.current.classList.add('item_expired')
    if (endDate > nowDate && !todo.complite) {
      articleRef.current.classList.remove('item_expired')
      timer = setTimeout(() => {
        articleRef.current.classList.add('item_expired')
      }, endDate - nowDate)
    }
    if (todo.complite) {
      clearTimeout(timer)
      articleRef.current.classList.remove('item_expired')
    }

    return () => clearTimeout(timer)
  }, [todo.endDate, todo.complite])

  useEffect(() => {
    if (todo.complite) articleRef.current.classList.add('item_ready')
    else articleRef.current.classList.remove('item_ready')
  }, [todo.complite])

  const endDateTime = useMemo(() => {
    return new Date(todo.endDate).toLocaleString()
  }, [todo.endDate])

  return (
    <>
      <article ref={articleRef} className={`todoList__item`}>
        <h2 className="todoList__title">{todo.title}</h2>
        <p className="todoList__endDate">Дата завершения: {endDateTime}</p>
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
        {error && <Error errorMessage={error} />}
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

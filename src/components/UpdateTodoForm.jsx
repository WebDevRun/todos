import { useState } from 'react'
import { Modal } from './Modal'
import { ref, update } from 'firebase/database'
import { database } from '../firebase'

export function UpdateTodoForm({ openModal, setOpenModal, todo }) {
  const [tempTodo, setTempTodo] = useState(todo)
  const formCkickHandler = (event) => event.stopPropagation()
  const titleInputChangeHandler = (event) =>
    setTempTodo({
      ...tempTodo,
      title: event.target.value,
    })
  const descriptionInputChangeHandler = (event) =>
    setTempTodo({
      ...tempTodo,
      description: event.target.value,
    })
  const endDateInputChangeHandler = (event) =>
    setTempTodo({
      ...tempTodo,
      endDate: event.target.value,
    })
  const formSubmitHandler = (event) => {
    event.preventDefault()
    update(ref(database, `todos/${todo.id}`), tempTodo)
    setOpenModal((prev) => !prev)
  }

  return (
    <Modal openForm={openModal} setOpenForm={setOpenModal}>
      <form
        onClick={formCkickHandler}
        onSubmit={formSubmitHandler}
        className="todoForm__form"
      >
        <label htmlFor="title">Заголовок</label>
        <input
          type="text"
          name="title"
          id="title"
          value={tempTodo.title}
          onChange={titleInputChangeHandler}
          required
        />
        <label htmlFor="description">Описание</label>
        <textarea
          name="description"
          id="description"
          value={tempTodo.description}
          onChange={descriptionInputChangeHandler}
        />
        <label htmlFor="endDate">Дата завершения</label>
        <input
          type="datetime-local"
          name="endDate"
          id="endDate"
          value={tempTodo.endDate}
          onChange={endDateInputChangeHandler}
          required
        />
        <label htmlFor="uploadFiles">Прикрепить файлы</label>
        <input type="file" name="uploadFiles" id="uploadFiles" multiple />
        <button type="submit">Изменить</button>
      </form>
    </Modal>
  )
}

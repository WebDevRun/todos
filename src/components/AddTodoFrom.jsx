import { ref, set } from 'firebase/database'
import { database } from '../firebase'
import { Modal } from './Modal'

export function AddTodoForm({ openForm, setOpenForm }) {
  const formCkickHandler = (event) => event.stopPropagation()
  const formSubmitHandler = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const id = Date.now()
    const setData = {
      complite: false,
      id,
    }

    for (const [key, value] of formData) {
      setData[key] = value
    }

    set(ref(database, `todos/${id}`), setData)
    setOpenForm((prev) => !prev)
  }

  return (
    <Modal openForm={openForm} setOpenForm={setOpenForm}>
      <form
        onClick={formCkickHandler}
        onSubmit={formSubmitHandler}
        className="todoForm__form"
      >
        <label htmlFor="title">Заголовок</label>
        <input type="text" name="title" id="title" required />
        <label htmlFor="description">Описание</label>
        <textarea name="description" id="description" />
        <label htmlFor="endDate">Дата завершения</label>
        <input type="datetime-local" name="endDate" id="endDate" required />
        <label htmlFor="uploadFiles">Прикрепить файлы</label>
        <input type="file" name="uploadFiles" id="uploadFiles" multiple />
        <button type="submit">Добавить</button>
      </form>
    </Modal>
  )
}

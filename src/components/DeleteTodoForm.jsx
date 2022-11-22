import { Modal } from './Modal'
import { ref, remove } from 'firebase/database'
import { database } from '../firebase'

export function DeleteTodoForm({ openModal, setOpenModal, todoId }) {
  const divClickHandler = (event) => event.stopPropagation()
  const yesButtonClickHandler = () => {
    remove(ref(database, `todos/${todoId}`))
    setOpenModal((prev) => !prev)
  }
  const noButtonClickHandler = () => setOpenModal((prev) => !prev)

  return (
    <Modal openForm={openModal} setOpenForm={setOpenModal}>
      <div onClick={divClickHandler} className="deleteTodoForm__form">
        <p className="deleteTodoForm__query">
          Вы действительно хотите удалить запись?
        </p>
        <div className="deleteTodoForm__controls">
          <input
            type="button"
            value="Да"
            onClick={yesButtonClickHandler}
            className="deleteTodoForm__yesButton"
          />
          <input
            type="button"
            value="Нет"
            onClick={noButtonClickHandler}
            className="deleteTodoForm__noButton"
          />
        </div>
      </div>
    </Modal>
  )
}

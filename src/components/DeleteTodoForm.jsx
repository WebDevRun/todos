import { Modal } from './Modal'
import { Error } from './Error'
import { ref as refDB, remove } from 'firebase/database'
import { ref as refStorage, deleteObject } from 'firebase/storage'
import { database, storage } from '../firebase'
import { useState } from 'react'

export function DeleteTodoForm({ openModal, setOpenModal, deleteTodo }) {
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState(null)
  const divClickHandler = (event) => event.stopPropagation()
  const yesButtonClickHandler = async () => {
    try {
      setDisabled(true)
      if (deleteTodo.uploadFilesData) {
        for (const uploadFile of deleteTodo.uploadFilesData) {
          await deleteObject(
            refStorage(storage, `todos/${deleteTodo.id}/${uploadFile.name}`)
          )
        }
      }
      await remove(refDB(database, `todos/${deleteTodo.id}`))
      setOpenModal((prev) => !prev)
    } catch (error) {
      setError(error.message)
      setDisabled(false)
    }
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
            disabled={disabled}
            className="deleteTodoForm__yesButton"
          />
          <input
            type="button"
            value="Нет"
            onClick={noButtonClickHandler}
            disabled={disabled}
            className="deleteTodoForm__noButton"
          />
        </div>
        {error && <Error errorMessage={error} />}
      </div>
    </Modal>
  )
}

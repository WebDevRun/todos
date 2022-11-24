import { useState } from 'react'
import { Error } from './Error'
import { Modal } from './Modal'
import { ref as refDB, update } from 'firebase/database'
import {
  ref as refStorage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { database, storage } from '../firebase'

export function UpdateTodoForm({ openModal, setOpenModal, todo }) {
  const [tempTodo, setTempTodo] = useState(todo)
  const [files, setFiles] = useState({
    uploads: [],
    deletes: [],
  })
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState(null)
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
  const deleteButtonClickHandler = (fileName) => {
    const uploadFilesData = tempTodo.uploadFilesData?.filter(
      (uploadFileData) => uploadFileData.name !== fileName
    )

    setFiles({ ...files, deletes: [...files.deletes, fileName] })
    setTempTodo({
      ...tempTodo,
      uploadFilesData,
    })
  }
  const uploadFilesButtonChangeHandler = (event) => {
    setFiles({ ...files, uploads: [...event.target.files] })

    if (!tempTodo.uploadFilesData)
      setTempTodo({
        ...tempTodo,
        uploadFilesData: [],
      })
  }
  const formSubmitHandler = async (event) => {
    try {
      event.preventDefault()
      setDisabled(true)

      if (files.uploads.length) {
        const snapshots = await Promise.all(
          files.uploads.map((file) =>
            uploadBytes(
              refStorage(storage, `todos/${tempTodo.id}/${file.name}`)
            )
          )
        )

        for await (const snapshot of snapshots) {
          const { name, fullPath, size } = snapshot.metadata
          const url = await getDownloadURL(refStorage(storage, fullPath))
          tempTodo.uploadFilesData.push({
            name,
            url,
            size,
          })
        }
      }

      if (files.deletes.length) {
        await Promise.all(
          files.deletes.map((fileName) => {
            deleteObject(
              refStorage(storage, `todos/${tempTodo.id}/${fileName}`)
            )
          })
        )
      }

      await update(refDB(database, `todos/${todo.id}`), tempTodo)
      setOpenModal((prev) => !prev)
    } catch (error) {
      setError(error.message)
      setDisabled(false)
    }
  }

  return (
    <Modal openForm={openModal} setOpenForm={setOpenModal}>
      <div className="todoForm__container">
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
            disabled={disabled}
            required
          />
          <label htmlFor="description">Описание</label>
          <textarea
            name="description"
            id="description"
            value={tempTodo.description}
            onChange={descriptionInputChangeHandler}
            disabled={disabled}
          />
          <label htmlFor="endDate">Дата завершения</label>
          <input
            type="datetime-local"
            name="endDate"
            id="endDate"
            value={tempTodo.endDate}
            onChange={endDateInputChangeHandler}
            disabled={disabled}
            required
          />
          {tempTodo.uploadFilesData?.length && (
            <div>
              <p>Файлы: </p>
              {tempTodo.uploadFilesData.map((file) => (
                <label key={file.url} className="todoForm__deleteFile">
                  <a href={file.url}>{`${file.name} (${file.size} байт)`}</a>
                  <input
                    type="button"
                    value="X"
                    onClick={() => deleteButtonClickHandler(file.name)}
                    disabled={disabled}
                  />
                </label>
              ))}
            </div>
          )}
          <label htmlFor="uploadFiles">Прикрепить файлы</label>
          <input
            type="file"
            name="uploadFiles"
            id="uploadFiles"
            onChange={uploadFilesButtonChangeHandler}
            disabled={disabled}
            multiple
          />
          <button type="submit" disabled={disabled}>
            Изменить
          </button>
        </form>
        {error && <Error errorMessage={error} />}
      </div>
    </Modal>
  )
}

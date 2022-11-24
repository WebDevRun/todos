import { useState } from 'react'
import { ref as refDB, set } from 'firebase/database'
import {
  ref as refStorage,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import { database, storage } from '../firebase'
import { Modal } from './Modal'
import { Error } from './Error'

export function AddTodoForm({ openForm, setOpenForm }) {
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState(null)
  const formCkickHandler = (event) => event.stopPropagation()
  const formSubmitHandler = async (event) => {
    try {
      event.preventDefault()
      setDisabled(true)
      const formData = new FormData(event.target)
      const id = Date.now()
      const uploadFiles = []
      const setData = {
        complite: false,
        id,
        uploadFilesData: [],
      }

      for (const [key, value] of formData) {
        if (key === 'uploadFiles' && !value.name && !value.size) continue

        if (key === 'uploadFiles') {
          uploadFiles.push(value)
          continue
        }

        setData[key] = value
      }

      if (uploadFiles.length) {
        const snapshots = await Promise.all(
          uploadFiles.map((file) =>
            uploadBytes(refStorage(storage, `todos/${id}/${file.name}`))
          )
        )

        for await (const snapshot of snapshots) {
          const { name, fullPath, size } = snapshot.metadata
          const url = await getDownloadURL(refStorage(storage, fullPath))
          setData.uploadFilesData.push({
            name,
            url,
            size,
          })
        }
      }

      await set(refDB(database, `todos/${id}`), setData)
      setOpenForm((prev) => !prev)
    } catch (error) {
      setError(error.message)
      setDisabled(false)
    }
  }

  return (
    <Modal openForm={openForm} setOpenForm={setOpenForm}>
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
            disabled={disabled}
            required
          />
          <label htmlFor="description">Описание</label>
          <textarea name="description" id="description" disabled={disabled} />
          <label htmlFor="endDate">Дата завершения</label>
          <input
            type="datetime-local"
            name="endDate"
            id="endDate"
            disabled={disabled}
            required
          />
          <label htmlFor="uploadFiles">Прикрепить файлы</label>
          <input
            type="file"
            name="uploadFiles"
            id="uploadFiles"
            disabled={disabled}
            multiple
          />
          <button type="submit" disabled={disabled}>
            Добавить
          </button>
        </form>
        {error && <Error errorMessage={error} />}
      </div>
    </Modal>
  )
}

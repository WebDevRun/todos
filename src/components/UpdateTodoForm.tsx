import {
  FC,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
  ChangeEventHandler,
  FormEventHandler,
  useState,
} from 'react'

import { Error } from './Error'
import { Modal } from './Modal'

import { ITodo, IUploadFilesData, updateTodo } from '../store/todosSlice'
import { useAppDispatch, useAppSelector } from '../hooks/store'

interface UpdateTodoFormProps {
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  todo: ITodo
}

export const UpdateTodoForm: FC<UpdateTodoFormProps> = ({
  openModal,
  setOpenModal,
  todo,
}) => {
  const [tempTodo, setTempTodo] = useState(todo)
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null)
  const [deleteFiles, setDeleteFiles] = useState<IUploadFilesData[]>([])
  const [disabled, setDisabled] = useState(false)
  const dispatch = useAppDispatch()
  const { error } = useAppSelector((state) => state.todos)

  const formCkickHandler: MouseEventHandler<HTMLFormElement> = (event) => {
    event.stopPropagation()
  }

  const titleInputChangeHandler: ChangeEventHandler<HTMLInputElement> = (
    event
  ) =>
    setTempTodo({
      ...tempTodo,
      title: event.target.value,
    })

  const descriptionInputChangeHandler: ChangeEventHandler<
    HTMLTextAreaElement
  > = (event) =>
    setTempTodo({
      ...tempTodo,
      description: event.target.value,
    })

  const endDateInputChangeHandler: ChangeEventHandler<HTMLInputElement> = (
    event
  ) =>
    setTempTodo({
      ...tempTodo,
      endDate: event.target.value,
    })

  const deleteButtonClickHandler = (file: IUploadFilesData): void => {
    const uploadFilesData = tempTodo.uploadFilesData?.filter(
      (uploadFileData) => uploadFileData.name !== file.name
    )

    setDeleteFiles([...deleteFiles, file])
    setTempTodo({
      ...tempTodo,
      uploadFilesData,
    })
  }

  const uploadFilesButtonChangeHandler: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setUploadFiles(event.target.files)

    if (tempTodo.uploadFilesData !== undefined)
      setTempTodo({
        ...tempTodo,
        uploadFilesData: [],
      })
  }

  const formSubmitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    setDisabled(true)
    void dispatch(updateTodo(tempTodo))

    if (error !== undefined) {
      setDisabled(false)
      return
    }

    setOpenModal(false)
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
          {tempTodo.uploadFilesData !== undefined && (
            <div>
              <p>Файлы: </p>
              {tempTodo.uploadFilesData.map((file) => (
                <label key={file.url} className="todoForm__deleteFile">
                  <a href={file.url}>{`${file.name} (${file.size} байт)`}</a>
                  <input
                    type="button"
                    value="X"
                    onClick={() => deleteButtonClickHandler(file)}
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
        {error !== undefined && <Error errorMessage={error} />}
      </div>
    </Modal>
  )
}

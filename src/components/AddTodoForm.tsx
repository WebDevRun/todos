import {
  FC,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
  FormEventHandler,
  ChangeEventHandler,
  useState,
} from 'react'

import { Modal } from './Modal'
import { Error } from './Error'

import { useAppDispatch, useAppSelector } from '../hooks/store'
import { addTodo, ITodo } from '../store/todosSlice'

interface AddTodoFormProps {
  openForm: boolean
  setOpenForm: Dispatch<SetStateAction<boolean>>
}

export const AddTodoForm: FC<AddTodoFormProps> = ({
  openForm,
  setOpenForm,
}) => {
  const [tempTodo, setTempTodo] = useState<ITodo>({
    id: String(Date.now()),
    title: '',
    complite: false,
    endDate: '',
  })
  const dispatch = useAppDispatch()
  const { error } = useAppSelector((state) => state.todos)
  const [disabled, setDisabled] = useState(false)

  const formCkickHandler: MouseEventHandler<HTMLFormElement> = (event) =>
    event.stopPropagation()

  const formSubmitHandler: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    setDisabled(true)
    void dispatch(addTodo(tempTodo))

    if (error !== undefined) {
      setDisabled(false)
      return
    }

    setOpenForm(false)
  }

  const titleInputHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTempTodo({
      ...tempTodo,
      title: event.target.value,
    })
  }

  const descriptionTextareaHandler: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setTempTodo({
      ...tempTodo,
      description: event.target.value,
    })
  }

  const endDateInputHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTempTodo({
      ...tempTodo,
      endDate: event.target.value,
    })
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
            autoFocus
            type="text"
            name="title"
            id="title"
            required
            disabled={disabled}
            onChange={titleInputHandler}
          />
          <label htmlFor="description">Описание</label>
          <textarea
            name="description"
            id="description"
            disabled={disabled}
            onChange={descriptionTextareaHandler}
          />
          <label htmlFor="endDate">Дата завершения</label>
          <input
            type="datetime-local"
            name="endDate"
            id="endDate"
            disabled={disabled}
            required
            onChange={endDateInputHandler}
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
        {error !== undefined && <Error errorMessage={error} />}
      </div>
    </Modal>
  )
}

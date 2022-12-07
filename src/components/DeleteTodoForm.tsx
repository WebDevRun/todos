import {
  FC,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
  useState,
} from 'react'

import { Modal } from './Modal'
import { Error } from './Error'

import { useAppDispatch, useAppSelector } from '../hooks/store'
import { deleteTodo, ITodo } from '../store/todosSlice'

interface DeleteTodoFormProps {
  openModal: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  todoId: ITodo['id']
}

export const DeleteTodoForm: FC<DeleteTodoFormProps> = ({
  openModal,
  setOpenModal,
  todoId,
}) => {
  const dispatch = useAppDispatch()
  const { error } = useAppSelector((state) => state.todos)
  const [disabled, setDisabled] = useState(false)
  const divClickHandler: MouseEventHandler<HTMLDivElement> = (event) =>
    event.stopPropagation()

  const yesButtonClickHandler: MouseEventHandler<HTMLInputElement> = () => {
    setDisabled(true)
    void dispatch(deleteTodo(todoId))

    if (error !== undefined) {
      setDisabled(false)
      return
    }

    setOpenModal(false)
  }

  const noButtonClickHandler: MouseEventHandler<HTMLInputElement> = () =>
    setOpenModal(false)

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
        {error !== undefined && <Error errorMessage={error} />}
      </div>
    </Modal>
  )
}

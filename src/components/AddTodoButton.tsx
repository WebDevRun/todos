import { FC, Dispatch, SetStateAction, MouseEventHandler } from 'react'

interface AddTodoButtonProps {
  setOpenForm: Dispatch<SetStateAction<boolean>>
}

export const AddTodoButton: FC<AddTodoButtonProps> = ({ setOpenForm }) => {
  const buttonClickHandler: MouseEventHandler<HTMLInputElement> = () =>
    setOpenForm(true)

  return (
    <div className="main__addTodoButton">
      <input
        type="button"
        value="Добавить запись"
        onClick={buttonClickHandler}
      ></input>
    </div>
  )
}

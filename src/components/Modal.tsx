import {
  FC,
  ReactNode,
  Dispatch,
  SetStateAction,
  MouseEventHandler,
} from 'react'

interface ModalProps {
  children: ReactNode
  openForm: boolean
  setOpenForm: Dispatch<SetStateAction<boolean>>
}

export const Modal: FC<ModalProps> = ({ children, openForm, setOpenForm }) => {
  const dialogClickHandler: MouseEventHandler<HTMLDialogElement> = () =>
    setOpenForm(false)

  return (
    <dialog
      onClick={dialogClickHandler}
      open={openForm}
      className="main__todoForm todoForm"
    >
      {children}
    </dialog>
  )
}

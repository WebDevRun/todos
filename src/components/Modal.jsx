/**
 * Компонент, отображающий модальное окно-обертку.
 * @param {{children: import("react").ReactNode, openForm: boolean, setOpenForm: function}} children
 */
export function Modal({ children, openForm, setOpenForm }) {
  const dialogClickHandler = () => setOpenForm((prev) => !prev)

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

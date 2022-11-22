export function AddTodoButton({ setOpenForm }) {
  const buttonClickHandler = () => setOpenForm((prev) => !prev)

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

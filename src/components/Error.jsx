/** Компонент, отображающий ошибку.
 * @param {{errorMessage: string}} errorMessage текст ошибки
 */
export function Error({ errorMessage }) {
  return <p>Ошибка: {errorMessage}</p>
}

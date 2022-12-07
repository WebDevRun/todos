import { FC } from 'react'

interface ErrorProps {
  errorMessage: string
}

export const Error: FC<ErrorProps> = ({ errorMessage }) => {
  return <p>Ошибка: {errorMessage}</p>
}

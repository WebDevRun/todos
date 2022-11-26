# Список задач

## Описание

Проект, реализующий сохранение, изменение, удаление задач.

## Установка

Для работы приложения необходимо иметь аккаунт в google, т.к. данное приложение работает с firebase.google.com.
Данное приложение использует Realtime Database как базу данных и Storage как облочное хранилище файлов.

1. Вам необходимо создать файл **.env** в корневом файле проекта.

В этом файле необходимо создать следующие параметры:

- VITE_API_KEY - apiKey
- VITE_AUTH_DOMAIN - authDomain
- VITE_PROJECT_ID - projectId
- VITE_STORAGE_BUCKET - storageBucket
- VITE_MESSAGING_SENDER_ID - messagingSenderId
- VITE_APP_ID - appId
- VITE_DB_URL - databaseURL

Эти параметры вы можете получить при создании проекта.

Подробнее можете узнать, перейдя по [https://firebase.google.com/docs/web/learn-more](https://firebase.google.com/docs/web/learn-more)

2. Далее необходимо приинициализировать проект, выполнив команду:

```
npm ci
```

3. Для запуска пректа вы можете воспользоваться следующими командами:

- Для разработки

```
npm run dev
```

- Для сборки:

```
npm run build
```

Проект соберется в папке **dist**.

4. Вы также можете сгенерировать документацию, используя команду:

```
npm run docs
```

Документация соберется в папке **docs**.

# FlagRadar

## Зависимости

Проект использует следующие технологии и библиотеки:

- **React** — библиотека для создания интерфейсов.
- **React Router** — для маршрутизации в приложении.
- **Ant Design** — набор UI-компонентов.
- **React Query** — управление состоянием данных и запросами к API.
- **Axios** — выполнение HTTP-запросов.
- **Styled Components** — стилизация компонентов.
- **Zustand** — управление глобальным состоянием.
- **FontAwesome** — иконки.

Полный список зависимостей указан в файле `package.json`.

## Запуск проекта

### Режим разработки

```bash
npm run dev
```

Приложение доступно по адресу: `http://localhost:5174`.

### Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в директории `dist`.

## Структура проекта

- `/src/components` — UI-компоненты (Layout, Header, Footer, Sidebar, Modal, Table).
- `/src/pages` — страницы приложения (CTFPage, TeamPage, AdminPage, UserPage, RatingPage, AIPage).
- `/src/hooks` — кастомные хуки для работы с API (useQueries).
- `/src/services` — сервисы для взаимодействия с API (Api).
- `/src/store` — управление состоянием с помощью Zustand (userStore).
- `/src/types` — TypeScript-типы для данных.
- `/src/shared/ui` — переиспользуемые UI-компоненты (Button, Input, Modal и др.).
- `/src/lib` — утилиты (date, name).

## Компоненты

### Layout

- **Layout.tsx** — основной макет, включающий Sidebar и Content. Отображает `AcceptUserModal` для непринятых пользователей.

### Header

- **Header.tsx** — заголовок с названием страницы и опциональной кнопкой.

### Footer

- **Footer.tsx** — подвал с ссылкой на политику обработки данных и модальным окном `PolicyModal`.

### Sidebar

- **Sidebar.tsx** — боковая панель с динамической навигацией в зависимости от роли пользователя.

### Модальные окна

- **AcceptUserModal.tsx** — принятие правил платформы и ввод никнейма.
- **CreateCTFModal.tsx** — создание нового CTF-события.
- **CreateTeamModal.tsx** — создание новой команды.
- **CTFModal.tsx** — информация о CTF-событии.
- **DeleteCTFModal.tsx** — удаление CTF-события.
- **DeleteResultsModal.tsx** — удаление результатов CTF.
- **EditCTFModal.tsx** — редактирование CTF-события.
- **EditRulesModal.tsx** — изменение правил платформы.
- **EditTeamModal.tsx** — изменение названия команды.
- **EditUserModal.tsx** — редактирование профиля пользователя.
- **JoinCTFModal.tsx** — присоединение к CTF по токену.
- **JoinTeamModal.tsx** — присоединение к команде по токену.
- **LeaveCTFModal.tsx** — выход из CTF-события.
- **LeaveTeamModal.tsx** — выход из команды.
- **PolicyModal.tsx** — правила платформы.
- **ResultsModal.tsx** — отображение результатов CTF.
- **TeamModal.tsx** — информация о команде.

### Таблицы

- **CTFTable.tsx** — список CTF-событий с фильтрацией и сортировкой.
- **TeamsTable.tsx** — список команд.
- **UsersTable.tsx** — список пользователей.
- **RatingTable.tsx** — рейтинг команд и пользователей.

### Хуки

- **useQueries.ts** — набор хуков для взаимодействия с API:
  - `useCurrentUser` — Получение данных текущего пользователя.
  - `useTeamByCurrentUser` — Получение данных команды пользователя.
  - `useCtfQuery` — Получение списка CTF-событий.
  - `useTeamsQuery` — Получение списка команд.
  - `useUsersQuery` — Получение списка пользователей.
  - `useCreateCTF` — Создание нового CTF-события.
  - `useEditCTF` — Редактирование CTF-события.
  - `useDeleteCTF` — Удаление CTF-события.
  - `useJoinCTF` — Присоединение к CTF-событию.
  - `useLeaveCTF` — Выход из CTF-события.
  - `useCreateTeam` — Создание команды.
  - `useJoinTeam` — Присоединение к команде.
  - `useLeaveTeam` — Выход из команды.
  - `useFetchRules` — Получение актуальных правил.
  - `useAcceptUser` — Получение информации о принятии правил пользователем.
  - `useUploadResults` — Загрузка результатов CTF.
  - `useFetchResults` — Получение результатов CTF.
  - `useDeleteResults` — Удаление результатов CTF.
  - `useTeamsRating` — Получение рейтинга команд.
  - `useFetchAI` — Запрос к AI-помощнику.

### Сервисы

- **Api.ts** — класс для взаимодействия с API, использующий Axios с перехватчиками для авторизации и обработки ошибок.

### Утилиты

- **date.ts** — форматирование дат.
- **name.ts** — преобразование названий форматов CTF.

## API

### Эндпоинты

- `/api/v2/me` — данные текущего пользователя.
- `/api/v2/events` — управление CTF-событиями.
- `/api/v2/teams` — управление командами.
- `/api/v2/users` — управление пользователями.
- `/api/v2/rules` — получение и редактирование правил платформы.
- `/api/v2/rating` — данные рейтинга.
- `/api/v2/question` — запросы к AI-помощнику.

## Состояние

### Управление состоянием

- **userStore.ts** — хранит данные текущего пользователя, ID команды и правила платформы.

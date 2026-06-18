# Yandex Maps Parser

Веб-приложение для парсинга информации об организациях и отзывов из **Яндекс Карт**.

Проект состоит из трёх основных частей:

* **Backend** — Laravel API
* **Frontend** — Vue 3 + TypeScript SPA
* **Parser** — отдельный сервис на Playwright + TypeScript для автоматизированного сбора данных

## 🌐 Демо

Приложение доступно по адресу:

**https://belstanok.botsaray.ru/**

### Тестовый аккаунт

- **Email:** `admin@example.com`
- **Password:** `password`

---

# Возможности

* Авторизация администратора через Laravel Sanctum
* Добавление организации по ссылке на Яндекс Карты
* Асинхронный запуск парсинга через Laravel Queue
* Получение информации об организации:

    * название;
    * рейтинг;
    * количество оценок;
    * количество отзывов.
* Парсинг пользовательских отзывов
* Сохранение результатов в MySQL
* Просмотр организаций через веб-интерфейс
* Просмотр отзывов с поиском и пагинацией

---

# Используемые технологии

## Backend

* Laravel
* PHP 8.4
* MySQL 8.4
* Laravel Sanctum
* Queue Jobs

## Frontend

* Vue 3
* TypeScript
* Pinia
* Vue Router
* Axios
* Vite

## Parser

* Playwright
* Chromium
* TypeScript
* Express

---

# Структура проекта

```text
.
├── backend/               # Laravel API
├── frontend/              # Vue 3 SPA
├── parser/                # Playwright Parser
├── docker/
│   ├── nginx/
│   ├── frontend-nginx/
│   ├── php/
│   └── playwright/
└── docker-compose.yml
```

---

# Архитектура

```text
                +----------------------+
                |     Vue Frontend     |
                +----------+-----------+
                           |
                           |
                           v
                +----------------------+
                |      Laravel API     |
                |    (php + nginx)     |
                +----------+-----------+
                           |
                Queue Job   |   HTTP API
                           |
          +----------------+----------------+
          |                                 |
          v                                 v
+----------------------+        +----------------------+
|   queue (Laravel)    |        | Playwright Parser    |
|    queue:work         |        |  (Express + TS)      |
+----------------------+        +----------+-----------+
                                           |
                                           v
                                  Yandex Maps Website

                           |
                           v

                    +------------------+
                    |      MySQL       |
                    +------------------+
```

---

# Принцип работы

1. Пользователь авторизуется в системе.
2. Добавляет ссылку на организацию Яндекс Карт.
3. Laravel создает запись в базе данных.
4. В очередь помещается задача `ParseCompanyJob`.
5. Очередь вызывает сервис парсинга.
6. Playwright открывает страницу организации.
7. Извлекаются:

    * название;
    * рейтинг;
    * количество оценок;
    * количество отзывов;
    * отзывы пользователей.
8. Backend сохраняет данные в MySQL.
9. Frontend отображает результаты пользователю.

---

# Запуск проекта

## Сборка и запуск

```bash
docker compose up -d --build
```

## Остановка

```bash
docker compose down
```

## Полная очистка

```bash
docker compose down -v
```

---

# Сервисы Docker

| Сервис       | Назначение                                    |
| ------------ | --------------------------------------------- |
| `php`        | Laravel (PHP-FPM)                             |
| `nginx`      | Веб-сервер для Laravel API                    |
| `queue`      | Обработка очередей (`php artisan queue:work`) |
| `mysql`      | База данных MySQL 8.4                         |
| `playwright` | Сервис парсинга Яндекс Карт                   |
| `node`       | Раздача собранного Vue-приложения             |

---

# Полезные команды

Просмотр логов всех сервисов:

```bash
docker compose logs -f
```

Просмотр логов отдельных контейнеров:

```bash
docker compose logs -f php
docker compose logs -f queue
docker compose logs -f nginx
docker compose logs -f mysql
docker compose logs -f playwright
docker compose logs -f node
```

Пересборка проекта:

```bash
docker compose up -d --build
```

---

# Основные сущности

## Company

* id
* name
* yandex_url
* rating
* reviews_count
* status
* created_at
* updated_at

## Review

* id
* company_id
* author
* text
* rating
* published_at

---

# Требования

* Docker
* Docker Compose

Локальная установка PHP, Node.js или Playwright не требуется — все зависимости запускаются внутри Docker-контейнеров.

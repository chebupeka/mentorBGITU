# Деплой MentorBGITU на VPS (Timeweb, Ubuntu) — домен bgitumentor.ru

Весь сайт (фронт + API + Postgres + HTTPS) поднимается одной командой через Docker.
Веб-сервер — Caddy: он сам получает и продлевает SSL-сертификат Let's Encrypt.

## 1. DNS (в панели, где куплен домен)

Создай A-записи на IP твоего VPS:

| Тип | Имя  | Значение         |
|-----|------|------------------|
| A   | @    | <IP_сервера>     |
| A   | www  | <IP_сервера>     |

IP виден в панели Timeweb после создания сервера. Подожди 10–30 мин, пока DNS обновится
(проверка: `ping bgitumentor.ru` должен показывать IP сервера).

## 2. Создать сервер в Timeweb

- Облачный сервер (VPS), образ **Ubuntu 24.04**, минимум 2 ГБ RAM.
- Зайти по SSH: `ssh root@<IP_сервера>` (пароль/ключ — из панели).

## 3. Установить Docker (на сервере)

```bash
apt update && apt install -y docker.io docker-compose-plugin git
systemctl enable --now docker
```

## 4. Забрать код

```bash
cd /opt
git clone <URL_твоего_репозитория> mentorBGITU
cd mentorBGITU
```

## 5. Настроить прод-окружение

```bash
cp backend/.env.prod.example backend/.env.prod
nano backend/.env.prod
```
Обязательно поменяй:
- `SECRET_KEY` — сгенерируй: `openssl rand -hex 32`
- `POSTGRES_PASSWORD` — задай свой сильный пароль

(Домен в `BACKEND_CORS_ORIGINS` уже прописан — bgitumentor.ru.)

## 6. Открыть порты (если включён firewall)

```bash
ufw allow 22 && ufw allow 80 && ufw allow 443
```

## 7. Запустить

```bash
docker compose -f docker-compose.prod.yml up -d --build
```
Первый запуск: соберёт фронт, поднимет Postgres, применит миграции, Caddy получит
HTTPS-сертификат (нужно, чтобы DNS уже указывал на сервер и порты 80/443 были открыты).

## 8. Засеять данные (один раз)

```bash
docker compose -f docker-compose.prod.yml exec api python -m app.seed
```
Создаст менторов, ресурсы и тестовые аккаунты:
- студент `demo@bgitu.ru / demo123`
- ментор `sergey@bgitu.ru / mentor123`

## Готово

Открывай **https://bgitumentor.ru** — сайт работает, сертификат валиден.

---

## Полезные команды

```bash
docker compose -f docker-compose.prod.yml logs -f          # логи
docker compose -f docker-compose.prod.yml ps               # статус
docker compose -f docker-compose.prod.yml restart api      # перезапуск API
docker compose -f docker-compose.prod.yml down             # остановить
```

## Обновление сайта после изменений в коде

```bash
cd /opt/mentorBGITU
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## Бэкап базы

```bash
docker compose -f docker-compose.prod.yml exec db \
  pg_dump -U mentor mentorbgitu > backup_$(date +%F).sql
```

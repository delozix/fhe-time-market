# Содержимое архива time-marketplace-fhe.zip

## Основные файлы проекта

### Конфигурационные файлы
- `.gitignore` - Правила игнорирования для Git
- `env.example` - Пример переменных окружения
- `vercel.json` - Конфигурация для Vercel
- `README.md` - Документация проекта
- `DEPLOYMENT.md` - Инструкции по деплою
- `QUICK_DEPLOY.md` - Быстрый гайд по деплою
- `FILES_TO_UPLOAD.md` - Список файлов для загрузки
- `package.json` - Зависимости Node.js
- `package-lock.json` - Файл блокировки зависимостей
- `next.config.js` - Конфигурация Next.js
- `tailwind.config.js` - Конфигурация Tailwind CSS
- `postcss.config.js` - Конфигурация PostCSS
- `tsconfig.json` - Конфигурация TypeScript

### Frontend (папка app/)
- `app/layout.tsx` - Корневой layout
- `app/page.tsx` - Главная страница
- `app/globals.css` - Глобальные стили
- `app/next-env.d.ts` - TypeScript определения Next.js
- `app/contract-info.json` - ABI и адрес контракта
- `app/components/` - React компоненты
  - `CreateOfferModal.tsx` - Модальное окно создания оффера
  - `NetworkInstructions.tsx` - Инструкции по настройке сети
  - `OfferCard.tsx` - Карточка оффера
  - `RPCSelector.tsx` - Селектор RPC
- `app/context/` - React контекст
  - `AppContext.tsx` - Основной контекст приложения
- `app/hooks/` - Пользовательские хуки
  - `useBlockchainProvider.ts` - Хук для работы с блокчейн провайдером
  - `useContract.ts` - Хук для работы с контрактом
  - `useRPC.ts` - Хук для работы с RPC
  - `useWallet.ts` - Хук для работы с кошельком
- `app/lib/` - Утилитарные библиотеки
  - `fheRelayer.ts` - Клиент FHE релейера
  - `polyfills.ts` - Полифиллы
  - `zamaRelayer.ts` - Zama релейер клиент

### Смарт-контракты (папка contracts/)
- `contracts/package.json` - Зависимости контрактов
- `contracts/package-lock.json` - Файл блокировки зависимостей контрактов
- `contracts/hardhat.config.js` - Конфигурация Hardhat
- `contracts/env.example` - Пример переменных окружения для контрактов
- `contracts/contracts/` - Solidity контракты
  - `TimeMarketplaceFHE.sol` - Основной FHE контракт
- `contracts/scripts/` - Скрипты деплоя
  - `deploy-fhe.js` - Скрипт деплоя FHE контракта
  - `deploy-hybrid.js` - Скрипт деплоя гибридного контракта
  - `deploy-mock-fhe.js` - Скрипт деплоя mock FHE контракта
  - `deploy.js` - Основной скрипт деплоя
  - `check-fhevm-sepolia.js` - Скрипт проверки FHEVM Sepolia

### GitHub Actions (папка .github/)
- `.github/workflows/ci.yml` - CI/CD пайплайн

## Размер архива: 174 KB

## Инструкции по использованию:

1. **Распакуйте архив** в новую папку
2. **Следуйте инструкциям** в `QUICK_DEPLOY.md`
3. **Загрузите на GitHub** используя `FILES_TO_UPLOAD.md`
4. **Деплойте на Vercel** используя `DEPLOYMENT.md`

## Что НЕ включено в архив:

- `node_modules/` - Зависимости (устанавливаются через npm install)
- `.next/` - Собранные файлы (создаются при сборке)
- `contracts/artifacts/` - Скомпилированные контракты (создаются при компиляции)
- `contracts/cache/` - Кэш Hardhat (создается автоматически)
- `.env` - Локальные переменные окружения (создается из env.example)
- `.vercel` - Конфигурация Vercel (создается автоматически)

## Готово к использованию! 🚀

Архив содержит все необходимые файлы для:
- ✅ Загрузки на GitHub
- ✅ Деплоя на Vercel
- ✅ Локальной разработки
- ✅ Продакшн использования

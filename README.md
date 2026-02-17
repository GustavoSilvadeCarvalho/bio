# Bio — Apresentação do projeto

Bio é uma aplicação de exemplo construída com Next.js que permite criar páginas de perfil (bio) personalizadas com player de música e integração com Supabase para persistência e autenticação.

Principais recursos

- Páginas de perfil dinâmicas por `username`.
- Player incorporado (YouTube) com controles básicos.
- Edição inline do perfil: nome, música, links sociais e cores (card e página).
- Autenticação via Supabase (magic link / OAuth).
- API simples (`GET`/`PUT`) para perfis usando Supabase como backend.

Stack técnico

- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS.
- Backend: Supabase (Postgres + Auth + Storage).

# EcoRopaGT 🌿👗

Plataforma de clósets virtuales y moda circular (segunda mano) en Guatemala. Construida con **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** y preparada para **Supabase** + **Vercel**.

## 🚀 Características principales

- **Catálogo interactivo**: Filtros por categoría, búsqueda en tiempo real, vista rápida y favoritos (Wishlist).
- **Clósets Virtuales verificados**: Perfiles dedicados por vendedor (`/closet/[username]`).
- **Estudio de Vendedor**: Publicación y gestión de prendas (`/vendedor/mi-closet`).
- **Panel de Administración**: Configuración global del sitio, moderación de inventario y vendedores destacados (`/admin`).
- **Persistencia Híbrida**: Sincronización automática con **Supabase** en producción y respaldo local (`data/cloud-store.json` + `localStorage`) en desarrollo.

## 🛠️ Instalación y desarrollo local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. (Opcional) Configurar variables de entorno copiando `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 🗄️ Configuración de Supabase

Ejecuta el script ubicado en [`supabase/schema.sql`](./supabase/schema.sql) dentro del **SQL Editor** de tu proyecto en Supabase y agrega las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en tu entorno (local y en Vercel).

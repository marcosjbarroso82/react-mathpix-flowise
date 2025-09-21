# 🚀 Deploy a GitHub Pages - React Router v7

Esta guía explica cómo configurar el despliegue manual a GitHub Pages para un proyecto React Router v7.

## 📋 Configuración Requerida

### 1. **Configurar React Router para SPA mode**

```typescript
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false, // CRÍTICO: Debe ser false para GitHub Pages
  basename: process.env.NODE_ENV === 'production' ? '/nombre-del-repo' : '/',
} satisfies Config;
```

### 2. **Configurar Vite con base path correcto**

```typescript
// vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  base: process.env.NODE_ENV === 'production' ? '/nombre-del-repo/' : '/',
  define: {
    __REACT_ROUTER_BASENAME__: JSON.stringify(process.env.NODE_ENV === 'production' ? '/nombre-del-repo' : '/'),
  },
});
```

### 3. **Instalar gh-pages y configurar scripts**

```bash
npm install --save-dev gh-pages
```

```json
// package.json scripts
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "npx gh-pages -d build/client"
  }
}
```

### 4. **Crear archivo .nojekyll**

Crear archivo vacío en `public/.nojekyll` para evitar conflictos con Jekyll.

## ⚙️ Configuración en GitHub

### 1. **Configurar GitHub Pages en Settings**

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (pestaña superior)
3. Desplázate hacia abajo hasta la sección **Pages** (en el menú lateral izquierdo)
4. En **Source**, selecciona **"Deploy from a branch"**
5. En **Branch**, selecciona **`gh-pages`**
6. En **Folder**, selecciona **`/ (root)`**
7. Haz clic en **Save**

### 2. **Verificar la configuración**

- ✅ **Source**: Deploy from a branch
- ✅ **Branch**: gh-pages
- ✅ **Folder**: / (root)

## 🚀 Proceso de Deploy

### 1. **Comando de deploy**

```bash
npm run deploy
```

Este comando:
1. Ejecuta `predeploy` → `npm run build` (construye la aplicación)
2. Ejecuta `deploy` → `npx gh-pages -d build/client` (sube al branch gh-pages)

### 2. **¿Quién crea el branch gh-pages?**

**El paquete `gh-pages` crea automáticamente el branch `gh-pages`** cuando ejecutas el comando por primera vez. Este proceso:

1. **Crea el branch `gh-pages`** si no existe
2. **Sube los archivos** del directorio `build/client` al branch
3. **Hace push** al repositorio remoto

### 3. **URL resultante**

Una vez configurado, tu aplicación estará disponible en:
```
https://tu-usuario.github.io/nombre-del-repo/
```

## ⚠️ Puntos Críticos a Recordar

- ✅ **SIEMPRE** configurar `ssr: false` en React Router
- ✅ **SIEMPRE** configurar `basename` correcto para GitHub Pages
- ✅ **SIEMPRE** usar `build/client` como directorio de deploy (no `build`)
- ✅ **SIEMPRE** crear archivo `.nojekyll` en `public/`
- ✅ **SIEMPRE** verificar que el `base` path en Vite coincida con el nombre del repo
- ✅ **SIEMPRE** hacer build antes de verificar el `index.html` generado
- ✅ **SIEMPRE** usar `npx gh-pages` en lugar de `gh-pages` directamente

## 🔧 Solución de Problemas

### Problema: `'gh-pages' is not recognized as an internal or external command`

**Solución**: Usar `npx gh-pages` en lugar de `gh-pages` directamente en el script de deploy.

### Problema: El branch gh-pages no se crea

**Solución**: 
1. Verificar que el build se complete correctamente
2. Verificar que existe el directorio `build/client`
3. Ejecutar `npx gh-pages -d build/client --no-push` para debug

### Problema: La aplicación no carga correctamente

**Solución**:
1. Verificar que `ssr: false` esté configurado
2. Verificar que el `basename` coincida con el nombre del repo
3. Verificar que el `base` path en Vite sea correcto

## 📝 Checklist de Deploy

- [ ] Configurar `ssr: false` en `react-router.config.ts`
- [ ] Configurar `basename` correcto en `react-router.config.ts`
- [ ] Configurar `base` path en `vite.config.ts`
- [ ] Instalar `gh-pages` como dependencia de desarrollo
- [ ] Agregar scripts `predeploy` y `deploy` en `package.json`
- [ ] Crear archivo `.nojekyll` en `public/`
- [ ] Configurar GitHub Pages en Settings del repositorio
- [ ] Ejecutar `npm run deploy`
- [ ] Verificar que la aplicación esté disponible en la URL

## 🎯 Resultado Final

Una vez completado todo el proceso, tendrás:
- ✅ Una aplicación React Router v7 funcionando en GitHub Pages
- ✅ URL: `https://tu-usuario.github.io/nombre-del-repo/`
- ✅ Deploy automático cada vez que ejecutes `npm run deploy`
- ✅ Configuración optimizada para SPA (Single Page Application)

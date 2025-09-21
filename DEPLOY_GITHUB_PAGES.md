# Deploy a GitHub Pages - React Router v7

Esta guía te explica cómo configurar el despliegue manual a GitHub Pages para un proyecto React Router v7, incluyendo la solución para evitar errores 404 en rutas de SPA.

## 📋 Prerrequisitos

- Proyecto React Router v7 configurado
- Repositorio en GitHub
- Node.js y npm instalados
- Git configurado

## 🔧 Configuración del Proyecto

### 1. Configurar React Router para SPA Mode

**Archivo: `react-router.config.ts`**

```typescript
import type { Config } from "@react-router/dev/config";

export default {
  // CRÍTICO: Debe ser false para GitHub Pages
  ssr: false,
  // Configurar basename para GitHub Pages
  basename: process.env.NODE_ENV === 'production' ? '/nombre-del-repo' : '/',
} satisfies Config;
```

**⚠️ Importante:** Reemplaza `nombre-del-repo` con el nombre real de tu repositorio.

### 2. Configurar Vite con Base Path

**Archivo: `vite.config.ts`**

```typescript
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  // Base path para GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/nombre-del-repo/' : '/',
  define: {
    __REACT_ROUTER_BASENAME__: JSON.stringify(
      process.env.NODE_ENV === 'production' ? '/nombre-del-repo' : '/'
    ),
  },
});
```

### 3. Instalar gh-pages

```bash
npm install --save-dev gh-pages
```

### 4. Configurar Scripts de Deploy

**Archivo: `package.json`**

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "npx gh-pages -d build/client"
  }
}
```

### 5. Crear Archivo .nojekyll

**Archivo: `public/.nojekyll`**

Crear un archivo vacío en `public/.nojekyll` para evitar conflictos con Jekyll.

### 6. Solución para Errores 404 (SPA Routes)

**Archivo: `public/404.html`**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    // Almacena la URL actual en sessionStorage
    sessionStorage.redirect = location.href;
  </script>
  <meta http-equiv="refresh" content="0;URL='/nombre-del-repo/'">
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>
```

**⚠️ Importante:** Reemplaza `/nombre-del-repo/` con la ruta correcta de tu repositorio.

## ⚙️ Configuración de GitHub Pages

### 1. Acceder a la Configuración del Repositorio

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (pestaña superior)
3. En el menú lateral izquierdo, busca **Pages**

### 2. Configurar GitHub Pages

En la sección **Pages**:

- **Source**: Selecciona "Deploy from a branch"
- **Branch**: Selecciona `gh-pages`
- **Folder**: Selecciona `/ (root)`
- Haz clic en **Save**

### 3. Verificar la Configuración

- GitHub Pages estará disponible en: `https://tu-usuario.github.io/nombre-del-repo/`
- El despliegue puede tomar unos minutos en activarse

## 🚀 Proceso de Deploy

### 1. Ejecutar Deploy

```bash
npm run deploy
```

Este comando:
1. Ejecuta `predeploy` → `npm run build` (construye la aplicación)
2. Ejecuta `deploy` → `npx gh-pages -d build/client` (sube al branch gh-pages)

### 2. Verificar el Deploy

1. Ve a la pestaña **Actions** en tu repositorio
2. Verifica que el workflow se ejecutó correctamente
3. Visita tu sitio en `https://tu-usuario.github.io/nombre-del-repo/`

## 🔍 Verificación de Funcionamiento

### 1. Probar Rutas Directas

- ✅ `https://tu-usuario.github.io/nombre-del-repo/` → Página principal
- ✅ `https://tu-usuario.github.io/nombre-del-repo/profile` → Página de perfil
- ✅ `https://tu-usuario.github.io/nombre-del-repo/settings` → Página de configuración

### 2. Probar Navegación

- ✅ Navegación entre páginas funciona correctamente
- ✅ URLs se mantienen al recargar la página
- ✅ No aparecen errores 404

## 🛠️ Troubleshooting

### Problema: Error 404 en rutas directas

**Solución:** Verificar que el archivo `404.html` esté configurado correctamente y que la URL de redirección coincida con el nombre del repositorio.

### Problema: Assets no se cargan

**Solución:** Verificar que el `base` path en `vite.config.ts` termine con `/` y coincida con el nombre del repositorio.

### Problema: gh-pages no se reconoce

**Solución:** Usar `npx gh-pages` en lugar de `gh-pages` directamente.

### Problema: Branch gh-pages no se crea

**Solución:** 
1. Verificar que el directorio `build/client` existe después del build
2. Verificar que tienes permisos de escritura en el repositorio
3. Verificar que el repositorio remoto está configurado correctamente

## 📝 Checklist de Verificación

- [ ] `ssr: false` en `react-router.config.ts`
- [ ] `basename` configurado correctamente
- [ ] `base` path en `vite.config.ts` configurado
- [ ] `gh-pages` instalado como dependencia de desarrollo
- [ ] Scripts `predeploy` y `deploy` configurados
- [ ] Archivo `.nojekyll` creado en `public/`
- [ ] Archivo `404.html` creado en `public/`
- [ ] GitHub Pages configurado en Settings
- [ ] Deploy ejecutado exitosamente
- [ ] Rutas directas funcionan correctamente

## 🔗 Enlaces Útiles

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [React Router v7 Documentation](https://reactrouter.com/)
- [gh-pages Package](https://www.npmjs.com/package/gh-pages)

## 📞 Soporte

Si encuentras problemas:

1. Verifica el checklist de arriba
2. Revisa la sección de troubleshooting
3. Verifica los logs en GitHub Actions
4. Asegúrate de que el nombre del repositorio coincida en todas las configuraciones

---

**Nota:** Esta configuración está optimizada para React Router v7 con SPA mode. Para otros frameworks o configuraciones, pueden requerirse ajustes adicionales.

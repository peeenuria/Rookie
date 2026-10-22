# Rookie · Decathlon

Prototipo navegable de **Rookie**, una web app de running con plan personalizado y mentor real, que se activa al comprar unas zapatillas Decathlon.

> **Proyecto académico conceptual.** Desarrollado en el Máster en Diseño UX/UI de Digital Minds (2025/26) por Camila Palacio, María Camila Portillo Omeara y Nuria Pérez. No está afiliado ni respaldado por Decathlon. Las marcas citadas pertenecen a sus propietarios.

## Estructura

- `prototype/` — prototipo en HTML, CSS y JS (sin build). La entrada es `prototype/index.html`, que redirige al splash.
- `1-REGISTRO`, `2-MENU_PRINCIPAL`, `3-PLAN_DE_ENTRENAMIENTO`, `4-MENTOR` — historias de usuario.
- `PRD.md` — documento de producto.

## Ver en local

```bash
cd prototype
npx serve .
```

## Despliegue

Vercel publica la carpeta `prototype/` tal cual (ver `vercel.json`).

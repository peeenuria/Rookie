# RUNNING MENTORS

**Product Requirements Document (PRD)** | v1.0 | Junio 2026 | Decathlon x Running Mentors

> "La única app de running con alguien real velando por ti, sin la presión de tener que rendir"

| Campo | Detalle |

|---|---|

| **Producto** | Running Mentors - App móvil |

| **Partner estratégico** | Decathlon |

| **Estado** | Draft v1.0 |

| **Plataforma** | iOS y Android (Mobile-first) |

| **Modelo de negocio** | SaaS con suscripción + activación por código de compra Decathlon |

| **Objetivo principal** | Reducir el abandono del running en un 70% dentro de los primeros 6 meses |

## 1. Resumen Ejecutivo

Running Mentors es una app móvil para personas que se inician en el running y que, sin apoyo adecuado, abandonan el hábito antes de los seis meses. Combina planes de entrenamiento personalizados con el acompañamiento de un mentor real.

**Hipótesis fundacional:**

> Si ayudamos a personas que se inician en el running a superar la pérdida rápida de motivación mediante un sistema de coach y programa de entrenamiento, elegirán nuestra solución sobre no hacer nada, Strava, Garmin o run clubs convencionales, porque nuestra solución tiene acompañamiento real y está diseñada para principiantes.

La distribución se activa a través de un código QR o referencia de compra en Decathlon, convirtiendo cada venta de zapatillas de running en un punto de entrada al ecosistema.

### Fórmula del producto

> **App de running + Mentor real + Pressure-free progress**

- **Mentor real**: persona real que te sigue, te observa y no te deja desaparecer. Sin este atributo, sería Couch to 5K.

- **Pressure-free progress**: avanzas a tu manera, sin comparación ni agobio. Sin este atributo, sería Strava.

- **App de running**: soporte digital que estructura el plan, registra el progreso y conecta con el mentor.

## 2. Problema y Oportunidad

### El problema

- Pérdida rápida de motivación al no ver resultados inmediatos

- Falta de estructura: no saben cómo progresar de forma segura

- Ausencia de acompañamiento: corren solos y sin nadie que los responsabilice

- Presión social de apps como Strava, rendimiento público y comparativo

- Planes genéricos que no se adaptan a condición física ni objetivos reales

### La oportunidad

Decathlon vende miles de pares de zapatillas de running cada mes. Cada compra es un momento de máxima intención. Running Mentors activa ese momento como punto de entrada al producto.

### Contexto del usuario

Pedro, 32 años, sedentario o activo ocasional. Quiere mejorar su salud, pero no tiene estructura, experiencia ni nadie que le guíe. Ha abandonado apps antes por falta de motivación o presión de rendir.

## 3. Análisis Competitivo

| Producto | Mentor real | Sin presión | Para principiantes | Activación por compra |

|---|---|---|---|---|

| Running Mentors | Sí | Sí | Sí | Sí (Decathlon) |

| Strava | No | No | No | No |

| Garmin Connect | No | Parcial | No | No |

| Couch to 5K | No (IA) | Sí | Sí | No |

| Run Clubs | Parcial | Variable | Variable | No |

| Nike Run Club | No | Parcial | Parcial | No |

## 4. Usuarios y Persona Principal

### Persona: Pedro

- **Edad**: 32 años

- **Perfil de actividad**: Sedentario o activo ocasional

- **Motivación principal**: Mejorar su salud, crear un hábito sostenible

- **Pain principal**: Pierde la motivación rápidamente, no sabe cómo progresar

- **Relación con el running**: Nunca ha corrido o lo ha intentado sin éxito

- **Punto de entrada**: Compra zapatillas en Decathlon y escanea el código QR

### Jobs To Be Done

- Empezar a correr sin sentirme perdido ni abrumado

- Que alguien me diga exactamente qué tengo que hacer cada día

- Sentir que progreso, aunque sea poco a poco

- Tener a alguien que note si desaparezco y me ayude a volver

- Correr sin que me comparen con otros

### Motivaciones (onboarding)

Perder peso, Tonificarme, Mejorar salud, Mantenerme en forma, Relajarme, Crear hábito, Mejorar capacidades físicas, Progresar en mi deporte, Otro

## 5. Propuesta de Valor

> Running Mentors es la única app de running con alguien real velando por ti, sin la presión de tener que rendir.

- **Mentor real**: profesional real asignado, revisa tu progreso, se activa si desapareces. No es chatbot ni IA.

- **Pressure-free progress**: sin rankings, sin comparaciones públicas, sin presión de velocidad

- **Plan autogenerado**: según objetivos, historial, condición física y disponibilidad

- **Activación Decathlon**: acceso vía código de compra

- **Salidas grupales para beginners**: sin presión de rendimiento

- **Re-engagement automático**: mensajes si no cumple sesiones; el mentor toma el relevo si persiste

## 6. Arquitectura de la Solución (11 módulos)

| Módulo | Descripción |

|---|---|

| M01 - Activación | Scanner QR o referencia manual de compra Decathlon |

| M02 - Onboarding | 3 pantallas de walkthrough |

| M03 - Autenticación | Email/Google, login, recuperación de contraseña |

| M04 - Perfil y Stepper | Datos personales + objetivos y motivaciones |

| M05 - Asignación de Mentor | Listado de mentores, elección |

| M06 - Agenda de Citas | Videollamada con mentor, primera cita obligatoria, seguimiento cada 2 semanas |

| M07 - Plan Semanal | Home con sesiones, objetivos, calorías, distancia |

| M08 - Registro de Carreras | Inicio/fin de sesión, tracking automático o manual |

| M09 - Salidas Grupales | Calendario, inscripción, detalle |

| M10 - Progreso | Métricas, historial, racha, objetivos del mes |

| M11 - Re-engagement | Mensajes automatizados + mentor toma el relevo |

## 7. User Flows

### Primer contacto

Scanner QR/código manual → Walkthrough (3 pantallas) → Registro/login → Permiso de datos → Stepper (Info personal > Motivaciones > Elección de mentor) → Agenda primera cita (videollamada) → Confirmación → Home inicial → Primera sesión → Feedback → Home actualizado

**Edge cases**: código inválido/usado, email ya registrado, contraseña insegura, rechazo de permisos, stepper incompleto, cambio de mentor, sin conexión

### Segunda visita en adelante

Login → Home actualizado → Plan individual o salida grupal → Registro de carrera → Feedback → Videollamada de seguimiento cada 2 semanas → Refuerzo de racha o re-engagement

**Edge cases**: tracking no conectado, cambio de mentor, cancelación de cita, abandono → re-engagement → estado inactivo

## 8. Inventario de Pantallas

*(Ver detalle completo en documento original — incluye Entrada/Activación, Autenticación, Setup del Perfil, Home y Plan, Progreso/Mentor/Ajustes)*

## 9. Métricas de Éxito

**Objetivo principal**: Reducir en un 70% el abandono del running antes de los 6 meses.

| Métrica | Objetivo |

|---|---|

| Retención a 6 meses | 70% de mejora vs. benchmark |

| Sesiones semanales completadas | ≥2 sesiones/semana |

| Tasa de asistencia a citas de mentor | >80% |

| Racha activa media | — |

| NPS / Recomendación | — |

| Churn rate (30/60/90 días) | — |

| Activaciones por Decathlon | — |

## 10. Riesgos y Preguntas Abiertas

**Riesgos**: el usuario no percibe el valor, abandono en el primer día, no llega a completar el onboarding, disponibilidad de mentores, dependencia de Decathlon, adopción del tracking.

**Preguntas abiertas**: momento del flow para cambiar de mentor, qué pasa si el usuario abandona y no responde, cómo evitar abandono en los primeros 7 días, modelo de cobro, stack técnico, integraciones de tracking prioritarias.

## 11. Roadmap

### P0 - MVP

Activación QR, onboarding, registro/login, stepper, mentores, agenda primera cita (Google Meet), home con plan semanal, sesión de carrera, feedback, videollamada de seguimiento, re-engagement básico.

### P1 - Segunda iteración

Integración Garmin/Strava, salidas grupales, progreso completo, cambio de mentor, re-engagement avanzado, notificaciones push personalizadas.

### P2 - Iteraciones futuras

Apple Health/Google Fit, gamificación, transición al Run Club Decathlon, dashboard del mentor, suscripción in-app, versión web/desktop para mentores.

## 12. Notas de Diseño (Design System)

- **Base**: Decathlon Design System (Figma library `G7FHLKyzm0VlGFR2yn8dbJ`)

- **Color principal**: `#3643ba` (azul Decathlon)

- **Tipografía**: Plus Jakarta Sans

- **Espaciado**: base 4px

- **Frame de referencia**: iPhone 16 Pro (393×852px)

- **Grid**: 12 columnas, márgenes 16px, gutters 8px

---

*Documento generado a partir de los artefactos del Foundation & Design Sprint. Versión 1.0 - Junio 2026.*
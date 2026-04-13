# 🎬📚 Ocioteca

Ocioteca es una plataforma full-stack que centraliza la gestión de ocio en un único lugar. Permite buscar libros, series y películas, valorarlos, escribir reseñas y guardar el progreso de consumo.

---

## 🚀 ¿Qué problema resuelve?

Normalmente los usuarios necesitan utilizar distintas plataformas para buscar libros, consultar dónde ver series o películas y gestionar su progreso. Ocioteca unifica todo en una sola aplicación.

---

## ✨ Funcionalidades principales

- 🔍 Búsqueda en tiempo real de libros mediante Google Books.
- 🎬 Búsqueda en tiempo real de series y películas mediante TMDB.
- ⭐ Sistema de puntuación.
- 📝 Sistema de reseñas.
- 📊 Gestión de estado del contenido:
  - Quiero ver / leer
  - Viendo / leyendo
  - Terminado
  - En espera
  - Abandonado
- 📺 Para series: guardado de temporada y capítulo actual.
- 🎥 Visualización de plataformas de streaming disponibles.
- 📚 Enlace directo a Google Books para compra de libros.
- 🔐 Sistema de autenticación: es necesario iniciar sesión para guardar el progreso.

---

## 🛠 Tecnologías utilizadas

### Frontend
- Angular
- TypeScript
- HTML / CSS
- Componentes standalone y arquitectura basada en servicios

### Backend
- Spring Boot
- API REST
- Integración segura con APIs externas

### Base de datos
- MySQL (gestionada con HeidiSQL)

### APIs externas
- TMDB (The Movie Database)
- Google Books

### Seguridad
- Uso de variables de entorno para proteger las API keys.
- El backend actúa como intermediario para evitar exponer claves en el frontend.

---

## 🏗 Arquitectura

Frontend (Angular)  
⬇  
Backend (Spring Boot - API REST)  
⬇  
APIs externas (TMDB y Google Books)

Las claves de las APIs nunca son visibles en el navegador.

---

## 📂 Estructura general

- `/angular` – Aplicación frontend en Angular.
- `/backend` – API REST desarrollada con Spring Boot.
- `/database` – Scripts o configuración de base de datos (opcional).

---

## 📌 Estado del proyecto

Versión actual: MVP funcional.  
El proyecto está en continua mejora con futuras optimizaciones de rendimiento, experiencia de usuario y despliegue en producción.

---

## 👤 Autor

Proyecto desarrollado como aplicación full-stack para portfolio profesional.

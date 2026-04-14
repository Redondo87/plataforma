🎬📚 Ocioteca

Ocioteca es una aplicación full-stack que centraliza la gestión de ocio en un único lugar.
Permite buscar libros, series y películas, valorarlos, escribir reseñas y guardar el progreso de consumo.

🚀 ¿Qué problema resuelve?

Normalmente los usuarios necesitan utilizar distintas plataformas para:

Buscar libros
Consultar dónde ver series o películas
Gestionar su progreso de consumo

Ocioteca unifica todo en una sola aplicación.

✨ Funcionalidades principales

🔍 Búsqueda en tiempo real de libros mediante Google Books
🎬 Búsqueda en tiempo real de series y películas mediante TMDB
⭐ Sistema de puntuación
📝 Sistema de reseñas
📊 Gestión de estado del contenido:

Quiero ver / leer
Viendo / leyendo
Terminado
En espera
Abandonado

📺 Para series: guardado de temporada y capítulo actual
🎥 Visualización de plataformas de streaming disponibles
📚 Enlace directo a Google Books
🔐 Sistema de autenticación (necesario para guardar progreso)

🛠 Tecnologías utilizadas
Frontend
Angular
TypeScript
HTML / CSS
Arquitectura basada en servicios
Componentes standalone
Backend
Spring Boot
API REST
Arquitectura por capas (Controller / Service / Repository)
Base de datos
MySQL
Gestión mediante HeidiSQL
APIs externas
TMDB (The Movie Database)
Google Books
🔐 Seguridad
Las API Keys nunca se exponen en el frontend.
El backend actúa como intermediario.
Uso de archivo de configuración ignorado por Git.
Ejemplo de configuración incluido mediante application-example.properties.
🏗 Arquitectura

Frontend (Angular)
⬇
Backend (Spring Boot - API REST)
⬇
APIs externas (TMDB y Google Books)

Las claves de las APIs nunca son visibles en el navegador.

⚙️ Configuración del proyecto

Para ejecutar el proyecto en local es necesario:

Clonar el repositorio.
Crear el archivo:
src/main/resources/application.properties

Basado en:

application-example.properties
Configurar:
Base de datos MySQL
google.books.key
tmdb.key

Las claves de API no están incluidas por motivos de seguridad.

📂 Estructura general
/Angular        → Aplicación frontend en Angular
/Spring boot    → Backend desarrollado con Spring Boot
📌 Estado del proyecto

Versión actual: MVP funcional.
El proyecto está en continua mejora con futuras optimizaciones de rendimiento, experiencia de usuario y despliegue en producción.

👤 Autor

Proyecto desarrollado como aplicación full-stack para portfolio profesional.

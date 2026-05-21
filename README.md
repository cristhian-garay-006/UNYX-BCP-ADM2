# [NOMBRE DE LA APP]

Plataforma de demostración de habilidades blandas para estudiantes.

## Estructura del proyecto

```
proyecto/
├── index.html            — estructura principal (HTML)
├── css/
│   └── styles.css        — estilos de la aplicación
├── js/
│   └── app.js            — lógica de la aplicación
├── img/                  — imágenes (actualmente vacía)
├── README.md             — este archivo
├── Dockerfile            — imagen Docker con Nginx
└── docker-compose.yml    — orquestación de contenedores
```

## Cómo correr con Docker

```bash
docker-compose up --build
```

Acceder en: **http://localhost:8080**

## Cómo correr sin Docker

Simplemente abre `index.html` en tu navegador (Chrome recomendado para acceso a cámara en localhost).

> **Nota:** las funciones de grabación de video requieren un contexto seguro (`localhost` o `https://`).

## Cuentas de demo

| Rol | Credenciales |
|-----|-------------|
| Empresa | empresa@demo.com / demo123 |
| Estudiante | Registrarse con cualquier dato |

## Tecnologías

- **HTML5** — estructura semántica
- **CSS3** — variables CSS, Grid, Flexbox, media queries
- **JavaScript ES6+** — lógica SPA sin frameworks
- **MediaDevices API** — grabación de video desde cámara
- **FileReader API** — previsualización de foto de perfil
- **Nginx** — servidor estático en Docker
- **Docker** — despliegue contenerizado

## Pantallas de la aplicación

1. **Inicio** — Landing con botones de acceso
2. **Registro** — Formulario completo del estudiante
3. **Categorías** — Selección de habilidad blanda
4. **Retos** — Lista de retos por categoría
5. **Detalle del reto** — Grabación de video respuesta
6. **Resultados** — Puntaje y recomendación
7. **CV del estudiante** — Perfil profesional generado dinámicamente
8. **Login empresa** — Acceso al panel empresarial
9. **Panel empresa** — Tabla de talentos disponibles
10. **CV candidato** — Vista del perfil desde la empresa

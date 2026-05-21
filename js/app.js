// =============================================
// [NOMBRE DE LA APP] — app.js
// =============================================

// --- ESTADO Y DATOS GLOBALES ---
let usuarioNombre = "";
let usuarioCorreo = "";
let usuarioCarrera = "";
let usuarioPuntaje = 0;
let retosCompletados = [];
let datosUsuario = {
    nombre: '', dni: '', telefono: '', correo: '',
    carrera: '', descripcion: '', linkedin: '',
    direccion: '', foto: '', habilidades: [], idiomas: []
};
let categoriaActual = "";
let retoActual = null;

const retosData = {
    'Liderazgo': [
        { id: 'L1', nombre: 'Toma de decisiones bajo presión', desc: 'Resuelve un problema urgente con el equipo.', tiempo: '10 min', puntos: 100, escenario: 'Un proyecto clave tiene un retraso crítico y el cliente está furioso. Debes decidir qué camino tomar y cómo comunicarlo.' },
        { id: 'L2', nombre: 'Delegación efectiva', desc: 'Asigna tareas a un equipo saturado.', tiempo: '8 min', puntos: 80, escenario: 'Tienes 5 tareas urgentes y 3 miembros del equipo con diferentes niveles de carga. Explica cómo distribuirías las tareas.' },
        { id: 'L3', nombre: 'Manejo de conflictos', desc: 'Media entre dos colegas peleados.', tiempo: '12 min', puntos: 120, escenario: 'Dos pilares de tu equipo han dejado de hablarse por un malentendido. ¿Cómo abordarías la mediación?' }
    ],
    'Comunicación': [
        { id: 'C1', nombre: 'Feedback constructivo', desc: 'Da feedback a un empleado impuntual.', tiempo: '10 min', puntos: 90, escenario: 'Debes darle un feedback negativo a un colaborador que siempre llega tarde, pero es el más talentoso. ¿Cómo lo harías?' },
        { id: 'C2', nombre: 'Presentación ejecutiva', desc: 'Convence al CEO.', tiempo: '15 min', puntos: 100, escenario: 'Tienes 2 minutos para convencer al CEO de invertir en una herramienta. Resume tu propuesta.' },
        { id: 'C3', nombre: 'Negociación difícil', desc: 'Negocia con proveedor.', tiempo: '12 min', puntos: 110, escenario: 'Un proveedor quiere subir los precios un 20%. Tu presupuesto está cerrado. Propón una estrategia.' }
    ],
    'Trabajo en equipo': [
        { id: 'T1', nombre: 'Consenso grupal', desc: 'Logra un acuerdo unánime.', tiempo: '10 min', puntos: 85, escenario: 'El equipo no se pone de acuerdo en el logo de la empresa. Propón un método para el consenso.' }
    ],
    'Resolución de problemas': [
        { id: 'R1', nombre: 'Crisis de servidor', desc: 'Atiende caída de sistema.', tiempo: '15 min', puntos: 150, escenario: 'El sistema principal se cae durante Black Friday. Describe los primeros 3 pasos lógicos.' }
    ]
};

const recomendaciones = [
    "Destacas en toma de decisiones bajo presión.",
    "Tienes habilidades sólidas de comunicación asertiva.",
    "Tu perfil muestra liderazgo natural en situaciones de conflicto.",
    "Posees una capacidad analítica excelente."
];

const usuariosEmpresa = [
    { nombre: 'Carlos Ruiz', carrera: 'Administración', rango: 'Plata', puntaje: 82, correo: 'carlos@demo.com', rec: recomendaciones[1], retos: ['Feedback constructivo', 'Consenso grupal'] },
    { nombre: 'Ana García', carrera: 'Administración', rango: 'Oro', puntaje: 95, correo: 'ana@demo.com', rec: recomendaciones[0], retos: ['Toma de decisiones bajo presión', 'Crisis de servidor'] },
    { nombre: 'Elena Torres', carrera: 'Administración', rango: 'Bronce', puntaje: 65, correo: 'elena@demo.com', rec: recomendaciones[2], retos: ['Manejo de conflictos'] },
    { nombre: 'Marcos Lyon', carrera: 'Administración', rango: 'Plata', puntaje: 78, correo: 'marcos@demo.com', rec: recomendaciones[3], retos: ['Presentación ejecutiva'] }
];

// --- CÁMARA Y GRABACIÓN ---
let streamCamara = null;
let mediaRecorder = null;
let chunksVideo = [];

// =============================================
// MODAL DE ALERTA
// =============================================
let callbackAlerta = null;

function mostrarAlerta(mensaje, tipo = 'exito', callback = null) {
    const modal = document.getElementById('modal-alerta');
    const titulo = document.getElementById('modal-titulo');
    const msg = document.getElementById('modal-mensaje');
    const iconExito = document.getElementById('modal-icono-exito');
    const iconError = document.getElementById('modal-icono-error');

    msg.textContent = mensaje;
    callbackAlerta = callback;

    if (tipo === 'exito') {
        titulo.textContent = '¡Excelente!';
        titulo.style.color = '#15803d'; // Verde oscuro
        iconExito.style.display = 'flex';
        iconError.style.display = 'none';
    } else {
        titulo.textContent = 'Atención';
        titulo.style.color = '#b91c1c'; // Rojo oscuro
        iconExito.style.display = 'none';
        iconError.style.display = 'flex';
    }

    modal.style.display = 'flex';
    // Pequeño delay para la animación
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.card').style.transform = 'translateY(0)';
    }, 10);
}

function cerrarModalAlerta() {
    const modal = document.getElementById('modal-alerta');
    modal.style.opacity = '0';
    modal.querySelector('.card').style.transform = 'translateY(-20px)';
    setTimeout(() => {
        modal.style.display = 'none';
        if (callbackAlerta) {
            callbackAlerta();
            callbackAlerta = null;
        }
    }, 300);
}

// =============================================
// NAVEGACIÓN
// =============================================
function mostrarPantalla(id) {
    document.querySelectorAll('.pantalla').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    window.scrollTo(0, 0);
    if (id === 'pantalla-cv-usuario') {
        renderizarCV();
    }
}

// =============================================
// SESIÓN
// =============================================
function cerrarSesion() {
    usuarioNombre = '';
    mostrarPantalla('pantalla-inicio');
}

// =============================================
// CV USUARIO
// =============================================
function renderizarCV() {
    const d = datosUsuario;

    // Foto o iniciales
    const fotoEl = document.getElementById('cv-foto');
    const inicialesEl = document.getElementById('cv-iniciales');
    if (fotoEl && inicialesEl) {
        if (d.foto) {
            fotoEl.src = d.foto;
            fotoEl.style.display = 'block';
            inicialesEl.style.display = 'none';
        } else {
            fotoEl.style.display = 'none';
            inicialesEl.style.display = 'flex';
            const parts = d.nombre ? d.nombre.split(' ') : [];
            const initials = (parts[0] ? parts[0][0].toUpperCase() : '') + (parts[1] ? parts[1][0].toUpperCase() : '');
            inicialesEl.textContent = initials;
        }
    }

    // Texto básico
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val || ''; };
    set('cv-nombre', d.nombre);
    set('cv-carrera', d.carrera);
    set('cv-descripcion', d.descripcion);
    set('cv-correo', d.correo);
    set('cv-telefono', d.telefono);
    set('cv-linkedin', d.linkedin);
    set('cv-direccion', d.direccion);

    // Habilidades
    const habLista = document.getElementById('cv-habilidades-lista');
    if (habLista) {
        habLista.innerHTML = '';
        d.habilidades.forEach(h => {
            const div = document.createElement('div');
            div.textContent = '✔ ' + h;
            habLista.appendChild(div);
        });
    }

    // Idiomas
    const idiomaDiv = document.getElementById('cv-idiomas');
    if (idiomaDiv) {
        idiomaDiv.innerHTML = '';
        d.idiomas.forEach(it => {
            const p = document.createElement('p');
            p.style.margin = '2px 0';
            p.textContent = `${it.idioma}: ${it.nivel}`;
            idiomaDiv.appendChild(p);
        });
    }

    // Retos completados en el CV
    const cvRetos = document.getElementById('cv-retos');
    if (cvRetos) {
        cvRetos.innerHTML = '';
        retosCompletados.forEach(r => {
            const div = document.createElement('div');
            div.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';
            div.innerHTML = `<span style="color:#7c3aed;font-size:18px;">✓</span> ${r.nombre}`;
            cvRetos.appendChild(div);
        });
        if (retosCompletados.length === 0) {
            cvRetos.innerHTML = '<p style="color:#aaa;font-size:13px;">Aún no has completado retos.</p>';
        }
    }

    // Habilidades demostradas (sección resultado)
    const habRes = document.getElementById('cv-habilidades-resultado');
    if (habRes) {
        habRes.innerHTML = '';
        const cats = [...new Set(retosCompletados.map(r => r.id[0] === 'L' ? 'Liderazgo' : r.id[0] === 'C' ? 'Comunicación' : r.id[0] === 'T' ? 'Trabajo en equipo' : 'Resolución de problemas'))];
        cats.forEach(cat => {
            const div = document.createElement('div');
            div.style.marginBottom = '10px';
            const pct = Math.min(100, usuarioPuntaje + Math.floor(Math.random() * 10 - 5));
            div.innerHTML = `
                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px;">
                    <span>${cat}</span><span>${pct}%</span>
                </div>
                <div style="background:#eee;border-radius:6px;height:6px;">
                    <div style="background:#7c3aed;height:6px;border-radius:6px;width:${pct}%;"></div>
                </div>`;
            habRes.appendChild(div);
        });
        if (cats.length === 0) {
            habRes.innerHTML = '<p style="color:#aaa;font-size:13px;">Completa retos para ver tus habilidades demostradas.</p>';
        }
    }

    // Puntaje y rango
    set('cv-puntaje', String(usuarioPuntaje || 0));
    const rangoBadge = document.getElementById('cv-rango-badge');
    if (rangoBadge) {
        let rango = 'Bronce';
        if (usuarioPuntaje >= 90) rango = 'Oro';
        else if (usuarioPuntaje >= 70) rango = 'Plata';
        rangoBadge.textContent = rango;
    }
}

// =============================================
// REGISTRO
// =============================================

function irPaso(paso) {
    // Validación del Paso 1 antes de ir al Paso 2
    if (paso === 2) {
        const nombre = document.getElementById('reg-nombre').value;
        const dni = document.getElementById('reg-dni').value;
        const tel = document.getElementById('reg-tel').value;
        const correo = document.getElementById('reg-correo').value;
        const pass = document.getElementById('reg-pass').value;
        
        if (!nombre || !dni || !tel || !correo || !pass) {
            mostrarAlerta('Por favor completa todos los datos personales antes de continuar.', 'error');
            return;
        }
        if (!correo.includes('@')) {
            mostrarAlerta('Por favor ingresa un correo electrónico válido.', 'error');
            return;
        }
    }
    
    // Validación del Paso 2 antes de ir al Paso 3
    if (paso === 3) {
        const carrera = document.getElementById('reg-carrera').value;
        const desc = document.getElementById('descripcion').value;
        const dir = document.getElementById('direccion').value;
        
        if (!carrera || !desc || !dir) {
            mostrarAlerta('Por favor completa los datos de tu perfil profesional antes de continuar.', 'error');
            return;
        }
    }

    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'none';
    
    document.getElementById('step-' + paso).style.display = 'block';
    
    // Hacer scroll arriba suavemente al cambiar de paso
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function previewFoto(input) {
    const preview = document.getElementById('preview-foto');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.style.display = 'none';
        preview.src = '';
    }
}

function agregarIdioma() {
    const bloque = document.getElementById('bloque-idiomas');
    const div = document.createElement('div');
    div.style = 'display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin-bottom:8px;';
    div.innerHTML = `
        <input type="text" placeholder="Idioma (ej: Inglés)" style="flex:1; min-width: 150px; padding:12px 14px; border-radius:8px; border:1px solid #d1d8e0; font-family: inherit;">
        <select style="flex:1; min-width: 150px; padding:12px 14px; border-radius:8px; border:1px solid #d1d8e0; background-color: white; font-family: inherit;">
            <option>Básico</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
            <option>Nativo</option>
        </select>
        <button type="button" onclick="this.parentElement.remove()" style="width:auto; background:none; color:var(--brand-main); border:none; font-size:24px; font-weight:bold; cursor:pointer; padding:0 8px;" title="Eliminar idioma">×</button>
    `;
    bloque.appendChild(div);
}

function validarCarrera(select) {
    if (select.value !== 'Administración' && select.value !== '') {
        mostrarAlerta('Esta carrera estará disponible próximamente. Por ahora solo puedes registrarte en Administración.', 'error', () => {
            select.value = 'Administración';
        });
    }
}

function registrarUsuario(e) {
    e.preventDefault();
    usuarioNombre = document.getElementById('reg-nombre').value;
    usuarioCorreo = document.getElementById('reg-correo').value;
    usuarioCarrera = document.getElementById('reg-carrera').value;

    const habs = [];
    document.querySelectorAll('#checkboxes-habilidades input:checked').forEach(cb => habs.push(cb.value));
    const idiomas = [];
    document.querySelectorAll('#bloque-idiomas > div').forEach(row => {
        const inp = row.querySelector('input');
        const sel = row.querySelector('select');
        if (inp && inp.value.trim()) idiomas.push({ idioma: inp.value.trim(), nivel: sel.value });
    });
    const previewImg = document.getElementById('preview-foto');

    datosUsuario = {
        nombre: usuarioNombre,
        dni: document.getElementById('reg-dni').value,
        telefono: document.getElementById('reg-tel').value,
        correo: usuarioCorreo,
        carrera: usuarioCarrera,
        descripcion: document.getElementById('descripcion').value,
        linkedin: document.getElementById('linkedin').value,
        direccion: document.getElementById('direccion').value,
        foto: previewImg.style.display !== 'none' ? previewImg.src : '',
        habilidades: habs,
        idiomas: idiomas
    };

    document.getElementById('cat-saludo').innerText = "Bienvenido/a, " + usuarioNombre;
    mostrarPantalla('pantalla-categorias');
}

// =============================================
// RETOS
// =============================================
function seleccionarCategoria(cat) {
    categoriaActual = cat;
    document.getElementById('titulo-categoria').innerText = cat;

    const lista = document.getElementById('lista-retos');
    lista.innerHTML = '';

    retosData[cat].forEach((reto, index) => {
        const completado = retosCompletados.some(r => r.id === reto.id);
        lista.innerHTML += `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem;">
                <div>
                    <h3 style="margin-bottom: 0.5rem;">${reto.nombre}</h3>
                    <p style="margin-bottom: 0;">${reto.desc}</p>
                </div>
                <button class="btn btn-outline btn-small" ${completado ? 'disabled' : ''} onclick="seleccionarReto('${cat}', ${index})">
                    ${completado ? 'Completado ✔' : 'Iniciar reto'}
                </button>
            </div>
        `;
    });

    mostrarPantalla('pantalla-retos');
}

function seleccionarReto(cat, index) {
    retoActual = retosData[cat][index];
    document.getElementById('reto-nombre').innerText = retoActual.nombre;
    document.getElementById('reto-tiempo').innerText = retoActual.tiempo;
    document.getElementById('reto-puntos').innerText = retoActual.puntos + " pts";
    document.getElementById('reto-escenario').innerText = retoActual.escenario;

    // Limpiar grabaciones previas
    chunksVideo = [];
    const videoGrabado = document.getElementById('video-grabado');
    if (videoGrabado) { videoGrabado.style.display = 'none'; videoGrabado.src = ''; }
    const previewCamara = document.getElementById('preview-camara');
    if (previewCamara) previewCamara.style.display = 'none';
    const estadoGrabacion = document.getElementById('estado-grabacion');
    if (estadoGrabacion) estadoGrabacion.textContent = '';
    const btnActivar = document.getElementById('btn-activar');
    if (btnActivar) btnActivar.disabled = false;
    const btnGrabar = document.getElementById('btn-grabar');
    if (btnGrabar) btnGrabar.disabled = true;
    const btnDetener = document.getElementById('btn-detener');
    if (btnDetener) btnDetener.disabled = true;

    mostrarPantalla('pantalla-detalle-reto');
}

function enviarRespuesta() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        detenerGrabacion();
    }

    if (chunksVideo.length === 0) {
        mostrarAlerta('Por favor graba tu respuesta con la cámara antes de enviar.', 'error');
        return;
    }

    retosCompletados.push(retoActual);
    
    mostrarAlerta("¡Respuesta registrada con éxito!", "exito", () => {
        if (retosCompletados.length === 1) {
            let categoriasDisponibles = Object.keys(retosData).filter(c => c !== categoriaActual);
            let catAleatoria = categoriasDisponibles[Math.floor(Math.random() * categoriasDisponibles.length)];
            seleccionarReto(catAleatoria, 0);
        } else {
            usuarioPuntaje = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
            document.getElementById('res-mensaje').innerText = "¡Gracias, " + usuarioNombre.split(' ')[0] + "! Has completado los retos.";
            document.getElementById('res-puntaje').innerText = usuarioPuntaje;
            document.getElementById('res-recomendacion').innerText = recomendaciones[Math.floor(Math.random() * recomendaciones.length)];
            mostrarPantalla('pantalla-resultados');
        }
    });
}

// =============================================
// CÁMARA
// =============================================
async function activarCamara() {
    try {
        streamCamara = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById('preview-camara').srcObject = streamCamara;
        document.getElementById('preview-camara').style.display = 'block';
        document.getElementById('btn-grabar').disabled = false;
        document.getElementById('btn-activar').disabled = true;
        document.getElementById('estado-grabacion').textContent = 'Cámara activa. Listo para grabar.';
    } catch (err) {
        document.getElementById('estado-grabacion').textContent = 'No se pudo acceder a la cámara. Verifica los permisos.';
    }
}

function iniciarGrabacion() {
    chunksVideo = [];
    mediaRecorder = new MediaRecorder(streamCamara);
    mediaRecorder.ondataavailable = e => chunksVideo.push(e.data);
    mediaRecorder.onstop = () => {
        const blob = new Blob(chunksVideo, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const videoGrabado = document.getElementById('video-grabado');
        videoGrabado.src = url;
        videoGrabado.style.display = 'block';
        document.getElementById('estado-grabacion').textContent = 'Grabación lista. Puedes enviar tu respuesta.';
    };
    mediaRecorder.start();
    document.getElementById('btn-grabar').disabled = true;
    document.getElementById('btn-detener').disabled = false;
    document.getElementById('estado-grabacion').textContent = 'Grabando...';
}

function detenerGrabacion() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    if (streamCamara) {
        streamCamara.getTracks().forEach(t => t.stop());
    }
    document.getElementById('preview-camara').style.display = 'none';
    document.getElementById('btn-detener').disabled = true;
}

// =============================================
// EMPRESA
// =============================================
function loginEmpresa(e) {
    e.preventDefault();
    const email = document.getElementById('emp-correo').value;
    const pass = document.getElementById('emp-pass').value;

    if (email === 'empresa@demo.com' && pass === 'demo123') {
        renderTablaEmpresa();
        mostrarPantalla('pantalla-empresa');
    } else {
        mostrarAlerta('Credenciales incorrectas. Use: empresa@demo.com / demo123', 'error');
    }
}

function renderTablaEmpresa() {
    const tbody = document.getElementById('tabla-usuarios');
    tbody.innerHTML = '';

    const coloresBg = ['#e0f2fe', '#fef3c7', '#ffedd5', '#f1f5f9'];
    const coloresTxt = ['#0f2b4c', '#b45309', '#c2410c', '#334155'];

    usuariosEmpresa.forEach((u, index) => {
        let claseBadge = '';
        if (u.rango === 'Oro') claseBadge = 'oro';
        if (u.rango === 'Plata') claseBadge = 'plata';

        // Iniciales para el avatar
        const iniciales = u.nombre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const bgColor = coloresBg[index % coloresBg.length];
        const txtColor = coloresTxt[index % coloresTxt.length];

        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.2s;">
                <td style="padding: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 42px; height: 42px; border-radius: 50%; background-color: ${bgColor}; color: ${txtColor}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.95rem;">
                            ${iniciales}
                        </div>
                        <span style="font-weight: 700; color: var(--brand-dark); font-size: 0.95rem;">${u.nombre}</span>
                    </div>
                </td>
                <td style="padding: 1.5rem; color: var(--text-dim); font-size: 0.95rem;">${u.carrera}</td>
                <td style="padding: 1.5rem;">
                    <span class="badge ${claseBadge}">${u.rango}</span>
                </td>
                <td style="padding: 1.5rem; font-weight: 800; color: var(--brand-dark); font-size: 1.05rem;">${u.puntaje}</td>
                <td style="padding: 1.5rem;">
                    <button class="btn btn-outline" style="width: auto; padding: 8px 16px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; border-color: var(--brand-main); color: var(--brand-main); background-color: transparent;" onclick="verCvEmpresa(${index})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        Ver CV
                    </button>
                </td>
            </tr>
        `;
    });
}

function verCvEmpresa(index) {
    const u = usuariosEmpresa[index];
    document.getElementById('cve-nombre').innerText = u.nombre.toUpperCase();
    document.getElementById('cve-carrera').innerText = u.carrera.toUpperCase();
    document.getElementById('cve-correo').innerText = u.correo;
    document.getElementById('cve-puntaje').innerText = u.puntaje;

    let claseBadge = 'plata';
    if (u.rango === 'Oro') claseBadge = 'oro';
    if (u.rango === 'Bronce') claseBadge = '';
    const b = document.getElementById('cve-badge');
    b.innerText = u.rango.toUpperCase();
    b.className = `badge ${claseBadge}`;

    document.getElementById('cve-recomendacion').innerText = `"${u.rec}"`;

    const lista = document.getElementById('cve-retos');
    lista.innerHTML = '';
    u.retos.forEach(r => {
        lista.innerHTML += `<li>${r}</li>`;
    });

    mostrarPantalla('pantalla-cv-empresa');
}

// =============================================
// EVENT LISTENERS (al cargar el DOM)
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Contador descripción
    const descripcionEl = document.getElementById('descripcion');
    if (descripcionEl) {
        descripcionEl.addEventListener('input', function () {
            const contador = document.getElementById('contador-desc');
            if (contador) contador.textContent = `${this.value.length}/300 caracteres`;
        });
    }

    // Limitar a 4 habilidades
    document.querySelectorAll('#checkboxes-habilidades input[type=checkbox]').forEach(cb => {
        cb.addEventListener('change', function () {
            const seleccionados = document.querySelectorAll('#checkboxes-habilidades input:checked');
            if (seleccionados.length > 4) {
                this.checked = false;
                alert('Puedes seleccionar máximo 4 habilidades.');
            }
        });
    });
});

// =============================================
// FULLSCREEN
// =============================================
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error al intentar habilitar pantalla completa: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

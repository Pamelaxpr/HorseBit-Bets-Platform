# HorseBit-App — Plataforma SaaS Reorganizada

## Descripción
Código fuente limpio y reorganizado de la plataforma HorseBit de apuestas en carreras de caballos en tiempo real. Esta carpeta es la versión canónica y estructurada de los archivos que estaban dispersos y con nombres/extensiones incorrectas en `Azure/Saas-Platform/`.

---

## Estructura del Proyecto

```
HorseBit-App/
├── frontend/                   ← Interfaz web HTML/CSS/JS
│   ├── index.html              ← Página principal de la SaaS
│   ├── css/
│   │   ├── style.css           ← CSS de la presentación
│   │   └── horsebit.css        ← CSS específico de la SaaS (2.4MB, base64 incluido)
│   ├── assets/                 ← Imágenes de caballos y logos
│   │   ├── logo.jpeg
│   │   ├── cometa.webp
│   │   ├── pegaso.webp
│   │   ├── tornado.webp
│   │   └── trueno.webp
│   └── js/
├── backend/                    ← Servidor Node.js + Motor Python
│   ├── server.js               ← Express server (sirve frontend desde ../frontend)
│   ├── motor_carrera.py        ← Motor MQTT + MariaDB (Python)
│   └── package.json            ← Dependencias Node.js
├── database/
│   └── schema.sql              ← Schema real de MariaDB (caballos, carreras)
└── ansible/
    ├── inventory_nodos         ← Inventario INI: hipodromo-a, hipodromo-b
    └── playbooks/
        ├── 09_copiar_index.yml         ← Copia index.html al DocumentRoot
        ├── 10_deploy_nodos_web.yml     ← Deploy web en nodos (repo Pamelaxpr)
        ├── 11_haproxy_balanceador.yml  ← HAProxy HTTP round-robin
        └── 12_haproxy_ssl.yml          ← HAProxy HTTPS con SSL autofirmado
```

---

## Triggers (Disparadores)
- **Deploy completo**: `./deploy.sh` desde `Azure/Ansible/` (ejecuta playbooks 01→08→12)
- **Deploy solo nodos web**: `ansible-playbook -i ansible/inventory_nodos ansible/playbooks/10_deploy_nodos_web.yml`
- **Motor de carrera**: `python3 backend/motor_carrera.py` (requiere MQTT Broker y MariaDB activos)
- **Backend Node.js**: `node backend/server.js` (sirve frontend en puerto 3000)

---

## Servicios Integrados
| Servicio | Rol |
|---|---|
| **Nginx** | Servidor web en nodos hipodromo-a/b |
| **HAProxy** | Balanceador de carga HTTP/HTTPS |
| **Node.js + Express** | Backend API y servidor de estáticos |
| **PM2** | Process manager para Node.js en producción |
| **MariaDB** | Base de datos de caballos y resultados |
| **MQTT (Mosquitto)** | Mensajería en tiempo real para posiciones |
| **Python 3** | Motor de simulación de carreras |

---

## Variables de Entorno
Ver `.env.example` en la raíz del proyecto. Variables requeridas:
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` — Conexión MariaDB
- `MQTT_BROKER` — IP/hostname del broker MQTT
- `PORT` — Puerto del servidor Node.js (default: 3000)

---

## Correcciones Aplicadas vs Saas-Platform Original
| Archivo original | Problema | Corrección |
|---|---|---|
| `horseapp (1).html` | Era Python con extensión .html | → `backend/motor_carrera.py` |
| `director (1).py` | Era YAML Ansible con extensión .py | → `ansible/playbooks/09_copiar_index.yml` |
| `carrera (1).sh` | Era YAML Ansible con extensión .sh | → `ansible/playbooks/10_deploy_nodos_web.yml` |
| `default (1).conf` | Era YAML Ansible con extensión .conf | → `ansible/playbooks/11_haproxy_balanceador.yml` |
| `tabladatos (1).sql` | Era YAML Ansible con extensión .sql | → `ansible/playbooks/12_haproxy_ssl.yml` |
| `copiarindex (1).yml` | Era INI Inventory con extensión .yml | → `ansible/inventory_nodos` |
| `server.js` (en playbook 08) | Servía estáticos desde `''` | → Corregido a `../frontend` |
| `repo_url` (en playbook 08) | Apuntaba a `Isabellasys/horsebit-web` | → Corregido a `Pamelaxpr/HorseBit-Bets-Platform` |

---

## Registro de Cambios (Changelog)
| Fecha | Cambio |
|---|---|
| 2026-10-11 | Reorganización completa de `Saas-Platform` → `HorseBit-App` con estructura canónica |
| 2026-10-11 | Corrección de extensiones de archivo incorrectas (6 archivos) |
| 2026-10-11 | Creación de `database/schema.sql` real (el original era un playbook YAML) |
| 2026-10-11 | Corrección de `server.js` — ruta estáticos y separación frontend/backend |
| 2026-10-11 | Corrección de `repo_url` en playbook 10 a `Pamelaxpr/HorseBit-Bets-Platform` |
| 2026-10-11 | Añadido `blockinfile marker` en HAProxy para evitar duplicados al re-ejecutar |

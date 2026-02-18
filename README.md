# Modelo C4 - Arquitectura de Aplicación Web Escalable

## Análisis General

La arquitectura representa una **aplicación web moderna escalable** compuesta por:
- **Frontend**: Aplicación estática (HTML/CSS/JavaScript)
- **Backend**: API REST (Node.js/Express)
- **Base de Datos**: PostgreSQL
- **Orquestación**: Kubernetes con auto-escalado (HPA)
- **Containerización**: Docker para aislamiento y portabilidad

---

## C1: Diagrama de Contexto del Sistema

Este diagrama muestra la vista de nivel más alto, representando el sistema completo y sus interactores externos.

```mermaid
graph
    User["👤 Usuario Final"]
    
    subgraph System["🔷 Sistema de Aplicación Web"]
        WebApp["Aplicación Web<br/>(Frontend + Backend)"]
    end
    
    Admin["👨‍💼 Administrador<br/>del Sistema"]
    
    User -->|Accede a través de navegador| WebApp
    WebApp -->|Solicita datos| ExternalAPI
    Admin -->|Gestiona y monitorea| WebApp
    
    style System fill:#4A90E2,stroke:#2E5C8A,stroke-width:3px,color:#fff
    style User fill:#50C878,stroke:#2D7A3F,stroke-width:2px,color:#fff
    style Admin fill:#FF6B6B,stroke:#CC5555,stroke-width:2px,color:#fff
    style ExternalAPI fill:#FFA500,stroke:#CC8400,stroke-width:2px,color:#fff
```

**Descripción:**
- **Usuarios Finales**: Acceden a la aplicación web a través de navegadores HTTP/HTTPS
- **Administradores**: Gestionan la infraestructura, despliegues y monitoreo

---

## C2: Diagrama de Contenedores

Este nivel muestra los contenedores principales, sus responsabilidades y cómo se comunican.

```mermaid
graph
    Browser["🌐 Navegador Web<br/>(Cliente HTTP)"]
    
    subgraph Kubernetes["☸️ Cluster Kubernetes"]
        subgraph Frontend["📱 Contenedor Frontend"]
            FE["Cliente HTML/CSS/JS<br/>- index.html<br/>- script.js<br/>- styles.css"]
        end
        
        subgraph Backend["🔧 Contenedor Backend"]
            API["API REST Node.js<br/>- app.js<br/>- index.js<br/>- Rutas HTTP"]
        end
        
        subgraph Database["💾 Base de Datos"]
            DB["PostgreSQL<br/>(Stateful)"]
            PV["Volumen Persistente<br/>(PV/PVC)"]
        end
        
        subgraph Config["⚙️ Configuración"]
            ConfigMap["ConfigMap &amp;<br/>Secrets"]
        end
    end
    
    HPA["📊 Auto-escalado HPA<br/>(Horizontal Pod<br/>Autoscaler)"]
    
    Browser -->|HTTP/HTTPS| FE
    FE -->|API REST| API
    API -->|SQL| DB
    DB -->|Persiste datos| PV
    ConfigMap -->|Inyecta config| API
    HPA -.->|Monitorea &amp; escala| API
    
    style Kubernetes fill:#326CE5,stroke:#1E4B8C,stroke-width:3px,color:#fff
    style Frontend fill:#00D4FF,stroke:#0099CC,stroke-width:2px,color:#000
    style Backend fill:#FF6B9D,stroke:#CC3D6F,stroke-width:2px,color:#fff
    style Database fill:#FFA500,stroke:#CC8400,stroke-width:2px,color:#fff
    style Config fill:#9B59B6,stroke:#6C3A7E,stroke-width:2px,color:#fff
    style HPA fill:#F39C12,stroke:#C87F0A,stroke-width:2px,color:#fff
```

**Componentes Principales:**

| Contenedor | Responsabilidad | Tecnología |
|-----------|-----------------|-----------|
| **Frontend** | Interfaz de usuario estática | HTML5, CSS3, JavaScript |
| **Backend** | Lógica de negocio, API REST | Node.js, Express |
| **Database** | Persistencia de datos | PostgreSQL |
| **ConfigMap/Secrets** | Configuración y variables sensibles | Kubernetes |
| **HPA** | Auto-escalado automático | Kubernetes |

---

## C3: Diagrama de Componentes

### Backend - Componentes Internos

```mermaid
graph
    Request["HTTP Request<br/>(Cliente)"]
    
    subgraph BackendApp["🔧 Aplicación Backend"]
        Router["Router Express<br/>- GET /api/...<br/>- POST /api/...<br/>- PUT /api/...<br/>- DELETE /api/..."]
        
        subgraph Logic["Lógica de Negocio"]
            Controller["Controllers<br/>- Validación<br/>- Procesamiento<br/>- Respuesta"]
            Service["Servicios<br/>- Reglas de negocio<br/>- Transformación datos"]
        end
        
        subgraph Data["Acceso a Datos"]
            Repository["Repository/DAO<br/>- Consultas SQL<br/>- CRUD"]
            DBConnect["Conexión DB<br/>- Pool de conexiones<br/>- Transacciones"]
        end
        
        Error["Manejo de Errores<br/>- Validación<br/>- Logging<br/>- Respuestas HTTP"]
    end
    
    Database["🗄️ PostgreSQL"]
    Config["⚙️ Configuración<br/>(.env)"]
    
    Request --> Router
    Router --> Controller
    Controller --> Service
    Service --> Repository
    Repository --> DBConnect
    DBConnect --> Database
    
    Controller --> Error
    Service --> Error
    Repository --> Error
    
    Config -.->|Inicializa| DBConnect
    
    style BackendApp fill:#FF6B9D,stroke:#CC3D6F,stroke-width:2px,color:#fff
    style Logic fill:#FF8FB3,stroke:#CC7090,stroke-width:2px,color:#000
    style Data fill:#FF9FBE,stroke:#CC7FA0,stroke-width:2px,color:#000
    style Router fill:#E91E63,stroke:#B3154D,stroke-width:2px,color:#fff
    style Error fill:#FFC1CC,stroke:#CC99A6,stroke-width:2px,color:#000
```

### Frontend - Componentes Internos

```mermaid
graph
    subgraph FrontendApp["📱 Aplicación Frontend"]
        HTML["index.html<br/>- Estructura DOM<br/>- Elementos HTML<br/>- Referencias a CSS/JS"]
        
        CSS["styles.css<br/>- Estilos globales<br/>- Responsivos<br/>- Temas"]
        
        subgraph JS["script.js"]
            Events["Event Listeners<br/>- Click<br/>- Submit<br/>- Change"]
            
            API_Client["API Client<br/>- fetch() calls<br/>- Headers<br/>- Error handling"]
            
            DOM_Manip["DOM Manipulation<br/>- querySelector<br/>- innerHTML<br/>- classList"]
            
            State["Estado Local<br/>- Variables<br/>- LocalStorage<br/>- Session"]
        end
    end
    
    Backend["🔧 API Backend"]
    
    HTML --> CSS
    HTML --> JS
    Events --> DOM_Manip
    Events --> API_Client
    API_Client --> Backend
    Backend -->|JSON| API_Client
    API_Client --> State
    State --> DOM_Manip
    DOM_Manip --> HTML
    
    style FrontendApp fill:#00D4FF,stroke:#0099CC,stroke-width:2px,color:#000
    style JS fill:#00E5FF,stroke:#00B8D4,stroke-width:2px,color:#000
    style HTML fill:#4FC3F7,stroke:#3FA9D9,stroke-width:2px,color:#fff
    style CSS fill:#81D4FA,stroke:#66AACF,stroke-width:2px,color:#000
```

---

## C4: Diagrama de Código

### Backend - Estructura de Archivos y Clases

```mermaid
graph
    subgraph App["📂 Proyecto Backend"]
        Index["index.js<br/>- Punto de entrada<br/>- Inicialización"]
        
        App_js["app.js<br/>- Configuración Express<br/>- Middlewares<br/>- Rutas"]
        
        DB_js["db.js<br/>- Configuración PostgreSQL<br/>- Pool de conexiones<br/>- Query builder"]
        
        WWW["bin/www<br/>- Start server<br/>- Port config"]
        
        Package["package.json<br/>- Dependencies<br/>- Scripts"]
    end
    
    Index --> App_js
    App_js --> Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> Models
    Models --> DB_js
    Index --> WWW
    Package -.->|Define| App
    
    style App fill:#FF6B9D,stroke:#CC3D6F,stroke-width:2px,color:#fff
    style Routes fill:#FF8FB3,stroke:#CC7090,stroke-width:2px,color:#000
    style Controllers fill:#FF9FBE,stroke:#CC7FA0,stroke-width:2px,color:#000
    style Services fill:#FFB3C9,stroke:#CCA0A0,stroke-width:2px,color:#000
    style Models fill:#FFC1CC,stroke:#CC99A6,stroke-width:2px,color:#000
```

### Frontend - Estructura de Archivos

```mermaid
graph
    subgraph Web["📂 Proyecto Frontend"]
        HTML_file["index.html<br/>- Estructura del sitio<br/>- Elementos interactivos<br/>- Referencias externas"]
        
        CSS_file["styles.css<br/>- Reset CSS<br/>- Componentes<br/>- Responsivos<br/>- Animaciones"]
        
        JS_file["script.js<br/>- Funciones de negocio<br/>- Llamadas API<br/>- Manipulación DOM<br/>- Manejo de eventos"]
                
        Docker_file["Dockerfile<br/>- nginx imagen<br/>- Copia archivos<br/>- Exposición puerto 80"]
        
        Ignore["dockerignore<br/>- .git<br/>- node_modules<br/>- .env"]
    end
    
    HTML_file --> CSS_file
    HTML_file --> JS_file
    Docker_file --> HTML_file
    
    style Web fill:#00D4FF,stroke:#0099CC,stroke-width:2px,color:#000
```

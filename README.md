# NoteFlow

Una aplicación "light-weight", unicamente concentrada en la toma de notas cotidianas puntuales, desarrollada empleando   React Native y  Expo. Desde un comienzo esta conecbida para ser pequeña, minima y  persistente paar el usuario — las notas almacenadas persisten tras el arrancado de la app una vez tras otra gracias a   AsyncStorage.

---

## Tech Stack

| Herramienta | Proposito |
|---|---|
| Expo SDK + Expo Router | Navegación y bases del proyecto |
| React Native | UI y componentes clave de la App |
| Gluestack UI v3 | Librería de componentes visuales y "themes" |
| Zustand | Gesiton del estado global de las variables |
| AsyncStorage |Persistencia de Objetos |
| Zod | Validación de los Formularios |
| Expo Haptics | Interacciones táctiles  |
| FlashList | Renderizado de la las notas  |
| TypeScript | Lenguaje de Programcion con checkeado de seguradad |

---

##  Los Features

### Notes

- Crear , borrar y deitar notas, tanot en el titulo como en el cuerpo
- Busqueda con filtrado de la nota.
- Contador de caracteres 
- "Timestamp" para verificar la fecha de ultima edicion de la nota
- Hacer "pin" a la nota que lo requiera para que merpanzeca en lo mas visible de la interfaz
- "Long press" de una nota almcaenada con el fin de editar o borrarla

![Screenshot-NotesWindow](assets/screenshots/Screenshot-NotesWindow.png)

![Screenshot-EditNote](assets/screenshots/Screenshot-EditNote.png)


![Screenshot-NotesDelete](assets/screenshots/Screenshot-NotesDelete.png)

![Screenshot-Search](assets/screenshots/Screenshot-Search.png)

![Screenshot-NotesPinned](assets/screenshots/Screenshot-NotesPinned.png)

### Tags
- Crear un "tag" con un nombre y el color que se desee segun el tipo de nota
- Añadido de "tags" a notas al momento de la edicion
- Gestion y borrado de los"tags" desde la ventana de Manage.

![Screenshot-ManageTags](assets/screenshots/Screenshot-ManageTags.png)

### Quick Notes
- Toma de notas rapida sin necesidad de añadir titulo
- Limite de caracteres de 45 para favorecer la brevedad
- Aviso conform aproximación al limite de caracteres
- Posibilidad de añadir "tags"
- Gestion separado de estas para su correcta orgnaización

![Screenshot-QuickNotesTag](assets/screenshots/Screenshot-QuickNotesTag.png)

### Persistencia de los datos 

- Todas las notas y los "tags estan almacenadas localmente  via AsyncStorage
- Los datos sobreviven el repetidoa rrancado de la app asi como del emulador

---

## Prerequisitos

Es necesario teber instalado localmente :

- Node.js v18+
- Android Studio con el  Android Emulator (Pixel 3a API 34 usado durante el desarrollo)
- Java 17 (Android Studio's  JDK agrupado  es seleccionado automaticamente `android/local.properties`)

---

## Setup

```bash
# Clonar el Repo
git clone https://github.com/JCCLN19952008/NoteFlow.git
cd NoteFlow

# Instalar las dependencias
npm install

# Añadir local.properties para el  Android SDK y los  Java paths
# Crear android/local.properties con:

# sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
# org.gradle.java.home=C:\\Program Files\\Android\\Android Studio\\jbr
```

---

## Funcionamiento de la App

Asegurarse que previamente el Android Emulator ha sido arrancado, entonces:

```bash
# Hacer el build y instalar en el emulador ya arrancado (tanto la primera vez como cada vez qeu se hace algun cambio a la configuracion nativa de la app derivada de las librerias)
npx expo run:android

# Subsiguiente sesiones de desarrollo 
npx expo start --dev-client
```

Si el emulador no lograra conectar con el Servidor Metro, corre este comando en forma de tunel en otra terminal secundaria:

```bash
"C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk\platform-tools\adb.exe" reverse tcp:8081 tcp:8081
```

Enctonces abrir NoteFlow en el emulador y conectar a  `http://10.0.2.2:8081`( a veces conecta automaticamente sin typear la IP)

---

## Estructura de Directorios

```
NoteFlow/
├── app/
│   ├── _layout.tsx           # Root layout with GestureHandlerRootView and GluestackUIProvider
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab bar with Notes, Manage, Quick tabs
│   │   ├── index.tsx         # Notes list with search and FlashList
│   │   ├── manage.tsx        # Tag creation and management
│   │   └── quick.tsx         # Quick note capture
│   └── note/
│       ├── new.tsx           # New note form with Zod validation
│       └── [id].tsx          # Note detail and edit screen
├── store/
│   ├── notesStore.ts         # Zustand store for notes with AsyncStorage persistence
│   └── tagsStore.ts          # Zustand store for tags with AsyncStorage persistence
└── schemas/
    └── noteSchema.ts         # Zod validation schema for note form
```

---

## Notes for the Evaluator

- La aplicación usa un  **Development Build** en lugar  de Expo Go debido a dependencias nativas(FlashList, Gesture Handler parcialmente).
- `android/` se excluye del repo publico via  `.gitignore` — se regenera cada vez que se ejecuta `npx expo run:android`.
- `android/local.properties` tiene que ser creado manualmente con los "paths" acordes a la configuracion de tu maquina local
- La variable de entorno  `JAVA_HOME` para Gradle se configura via  `.vscode/settings.json` para apuntar al Android Studio's  JDK agrupado, de manera que se evitan conflictos con otras versiones de JAVA instaladas en la maquina local.
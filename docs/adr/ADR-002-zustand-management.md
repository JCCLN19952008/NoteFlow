# ADR-002: Uso de Zustand en lugar de Context API o Redux

## Estado
Aceptado

## Contexto
NoteFlow requiere gestión de estado global para las notas y los tags, accesible desde múltiples pantallas. Las principales opciones consideradas fueron Context API (nativa de React), Redux Toolkit y Zustand.

## Decisión
Se optó por Zustand v5 para la gestión del estado global de notas y tags.

## Razones
- Zustand tiene una API minimalista — un store se define en pocas líneas sin boilerplate
- No requiere envolver la aplicación en providers adicionales como Context API o Redux
- El rendimiento es superior a Context API para actualizaciones frecuentes ya que solo re-renderiza los componentes suscritos al estado que cambia
- Compatible con middleware (persist) que permitió la integración inicial con AsyncStorage y posteriormente la migración a la API REST sin cambios estructurales en los componentes
- Redux añadiría complejidad innecesaria (actions, reducers, dispatch) para el tamaño y scope de esta aplicación

## Consecuencias
- Ecosistema más pequeño que Redux, aunque suficiente para las necesidades del proyecto
- La migración de AsyncStorage a API REST fue transparente para los componentes al mantener la misma interfaz del store
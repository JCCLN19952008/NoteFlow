# ADR-001: Uso de Expo Managed Workflow en lugar de React Native CLI

## Estado
Aceptado

## Contexto
Al iniciar el desarrollo de NoteFlow se debía elegir entre Expo Managed Workflow y React Native CLI (bare workflow) como base del proyecto. Ambas opciones permiten desarrollar aplicaciones React Native para Android e iOS, pero difieren significativamente en su nivel de abstracción y complejidad de configuración.

## Decisión
Se optó por Expo Managed Workflow con Expo SDK 54 y Expo Router para la navegación.

## Razones
- Expo abstrae toda la configuración nativa de Android (Gradle, AndroidManifest, local.properties) permitiendo centrarse en el desarrollo de features en lugar de en la infraestructura
- El ecosistema de paquetes de Expo (expo-notifications, expo-location, expo-image-picker) está diseñado para integrarse sin conflictos entre sí
- Expo Router proporciona navegación basada en sistema de archivos, reduciendo el boilerplate de configuración
- EAS Build permite generar APKs de producción sin necesidad de configurar un entorno Android local completo
- La curva de aprendizaje es significativamente menor que con bare workflow

## Consecuencias
- Menor flexibilidad para modificaciones nativas profundas comparado con bare workflow
- Dependencia del ecosistema Expo para actualizaciones de SDK
- Necesidad de rebuilds completos al añadir dependencias nativas, aunque EAS Build lo gestiona en la nube
# ADR-003: Uso de AWS S3 + PostgreSQL en lugar de Firebase Storage + Firestore

## Estado
Aceptado

## Contexto
El proyecto requería almacenamiento de datos estructurados (notas, tags) y almacenamiento de archivos binarios (imágenes). Firebase ofrece Firestore y Firebase Storage como solución integrada. Alternativamente se podía usar una base de datos PostgreSQL con un servicio de almacenamiento de objetos separado.

## Decisión
Se optó por Neon (PostgreSQL serverless) con Prisma ORM para los datos estructurados, y AWS S3 para el almacenamiento de imágenes. Firebase se utiliza exclusivamente para autenticación.

## Razones
- PostgreSQL es una base de datos relacional que se adapta mejor a los datos estructurados de NoteFlow (relación M:M entre notas y tags) que el modelo de documentos NoSQL de Firestore
- Prisma ORM proporciona type-safety completo, migraciones versionadas y una API intuitiva para consultas relacionales
- Neon ofrece PostgreSQL serverless con tier gratuito generoso y despliegue en Frankfurt (baja latencia para Europa)
- AWS S3 es el estándar de la industria para almacenamiento de objetos — escalable, fiable y con control granular de permisos por usuario via UID de Firebase
- Separar autenticación (Firebase), datos (Neon) y archivos (S3) sigue el principio de responsabilidad única y permite escalar cada capa independientemente
- Firestore añadiría una segunda base de datos redundante dado que ya se usa Neon, incrementando complejidad sin beneficio claro

## Consecuencias
- Mayor complejidad de infraestructura al gestionar tres servicios externos en lugar de uno
- La seguridad de acceso a datos debe implementarse manualmente en la API (filtrado por userId) en lugar de usar las reglas de seguridad integradas de Firestore
- Mayor control y flexibilidad sobre el modelo de datos y las consultas
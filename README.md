# Open Food Facts - Escáner de Productos

## 1. Resumen del proyecto
La aplicación es una herramienta móvil desarrollada en React Native utilizando el framework Expo. Su funcionalidad principal radica en la integración con la API pública de Open Food Facts para escanear e identificar productos alimenticios a través de sus códigos de barras. 

El valor agregado del sistema es su persistencia en la nube: los usuarios pueden explorar productos y, tras crear una cuenta, almacenar sus preferencias en una lista de "Favoritos". Esta lista no depende del almacenamiento local del dispositivo, sino que es un dato de cuenta *server-side*, permitiendo que la experiencia de usuario sea multiplataforma, escalable y esté centralizada. 

## 2. Autenticación
Para la gestión de identidades y control de acceso, se implementó el servicio Supabase Auth. Se optó por una estrategia de autenticación segura mediante correo electrónico y contraseña.

A nivel de arquitectura, la navegación está protegida mediante validación de sesión: la pestaña de favoritos exige que el usuario esté autenticado para ser visualizada. Además, la seguridad se reforzó directamente en la base de datos PostgreSQL mediante políticas de Seguridad a Nivel de Fila (Row Level Security - RLS). Esto garantiza que el motor de la base de datos rechace cualquier intento de lectura o escritura de un usuario sobre los favoritos de otro, asegurando la privacidad de los datos. 

## 3. Tiempo real / sincronización
El ecosistema de favoritos se diseñó bajo una arquitectura orientada a eventos, descartando el uso de técnicas ineficientes como el *polling* constante. Para lograrlo, se implementó Supabase Realtime a través de WebSockets.

La aplicación abre un canal y se suscribe a los eventos de la tabla de favoritos. Al producirse un cambio (inserción o borrado desde cualquier dispositivo con la misma cuenta), el servidor emite un evento al instante. La aplicación utiliza este evento como un patrón de "Señal de Invalidación": reacciona al aviso y re-consulta la lista actualizada. Adicionalmente, se implementó un sistema de identificadores de petición (`requestId`) para mitigar condiciones de carrera y asegurar que la interfaz del usuario no procese respuestas desfasadas por latencia de red. 

## 4. Puesta en marcha
Para la evaluación de este proyecto, se ofrecen dos caminos. El **Camino A** (recomendado) despliega la infraestructura desde cero para verificar los scripts. El **Camino B** es una alternativa de respaldo utilizando el servidor de pruebas ya configurado.

### Paso 1: Preparar el proyecto local
1. Clonar este repositorio en la computadora.
2. Abrir la terminal en la carpeta del proyecto y ejecutar `npm install` para instalar todas las dependencias.

### Paso 2: Configurar la Base de Datos (Supabase)

**Camino A: Despliegue manual desde cero (Recomendado)**
1. Ingresar a supabase.com y crear un proyecto nuevo gratuito.
2. En el menú lateral, ir a **Authentication > Providers > Email** y desactivar la opción de confirmación de email para agilizar las pruebas.
3. Ir a **SQL Editor**, crear una nueva consulta (*New Query*) y ejecutar el siguiente código maestro para crear la tabla, aplicar las políticas (RLS) y encender el Tiempo Real:

```sql
-- 1. Crear la tabla
create table favorites (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users not null,
  product_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Row Level Security (Seguridad por usuario)
alter table favorites enable row level security;
create policy "Los usuarios pueden ver sus propios favoritos"
  on favorites for select using (auth.uid() = user_id);
create policy "Los usuarios pueden agregar sus propios favoritos"
  on favorites for insert with check (auth.uid() = user_id);
create policy "Los usuarios pueden borrar sus propios favoritos"
  on favorites for delete using (auth.uid() = user_id);

-- 3. Evitar favoritos duplicados
alter table favorites
  add constraint favorites_user_product_unique unique (user_id, product_id);

-- 4. Preparar la tabla para Tiempo Real (Identidad completa)
alter table favorites replica identity full;

-- 5. Habilitar la emisión de eventos en Tiempo Real
alter publication supabase_realtime add table favorites;
```

**Camino B: Entorno pre-configurado (Plan de contingencia)**
Si surge algún inconveniente al crear la base de datos, puede omitir el Camino A y utilizar el servidor de producción. Las credenciales de acceso se proveen por privado al docente evaluador.

### Paso 3: Variables de Entorno
1. En la raíz del proyecto local, crear el archivo `.env`.
2. **Si eligió el Camino A:** En Supabase, ir a **Project Settings > API**. Copiar la *Project URL* y la *Publishable Key* (anon).
3. **Si eligió el Camino B:** Utilizar las llaves provistas de forma privada.
4. Pegar los valores en el archivo `.env` de esta manera (borrando `/rest/v1/` de la URL si estuviera presente):

```text
EXPO_PUBLIC_SUPABASE_URL=URL_DEL_PROYECTO
EXPO_PUBLIC_SUPABASE_ANON_KEY=TU_PUBLISHABLE_KEY
```

### Paso 4: Ejecución
1. En la terminal, ejecutar `npx expo start -c` para iniciar el servidor limpiando la caché.
2. Escanear el código QR con la app Expo Go (en Android) o la cámara (en iOS) para probar la app en un dispositivo físico, o presionar la tecla 'a' en la terminal para compilar mediante conexión directa USB/ADB.
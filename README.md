Este es un sistema de reservas desarrollado en ReactJS y ExpressJS junto a la librerìa de Socke.io, la cual me permite
detectar cambios en tiempo real en la tabla para evitar errores donde ambos usuarios eligen la misma fecha.

Esta arquitectura utilizada para el proyecto permitirà su fàcil escalabiildad debido a la organizaciòn de sus archivos,
los cuales se separaron con carpetas para evitar còdigo spaghetti.

¿CÒMO FUNCIONA?
Al descargar la carpeta:
1. ingresar a la carpeta frontend y ejecutar el comando ¨npm install", esto descargarà todas las
   dependencias necesarias para poder correr el proyecto.
   
2.Ejecutar el schema.sql que viene en la carpeta, esto creara las tablas correspondientes
   
3. En la carpeta raìz de backend, crear un archivo .env para cada carpeta donde se pegarà lo siguiente

  .env de la carpeta backend:
  DB_HOST=localhost
  DB_USER=tu_usuario
  DB_PASSWORD=tu_contrasena
  DB_NAME=soporte
  DB_PORT=3306
  PORT=3000
  JWT_SECRET=mi_clave_super_secreta_123

  esto permitirà que se conecte a la base de datos correspondiente.
   
3. Replicar el mismo paso con la carpeta backend, ¨npm install" descargarà todas las dependencias correspondientes.

4. Una vez instalado todo, en la carpeta backend, correr el comando ¨node src/index.js" este es el archivo principal que
   harà funcionar la API en localhost con el puerto 3000.
   
5. Ingresar a la carpeta frontend y correr el comando ¨npm run dev" ejectuarà el proyecto en localhost en el puerto 5173
   (si por algun motivo el proyecto frontend usa un puerto diferente, en el archivo src/socket.js de la carpeta backend, se
   podrà visualizar un apartado donde viene la propiedad "origin", esta propiedad guarda la url del frontend para que no
   nuestre error en cors, si el frontend se ejecuta en otro puerto, cambiar ese puerto por el puerto en el que se ejecuta
   el proyecto frontend)
   
6. Se crearon 2 usuarios para validar que cuando un usuario selecciona una fecha, el otro vea en tiempo real como se
   deshabilita esta fecha y vice versa, las credencies para estos usuarios son "user1@gmail.com" con la contraseña "123456",
   el segundo usuario tiene como credenciales "user2@gmail.com" con la contraseña "123456".
   (Se pueden crear mas usuarios dentro de la carpeta "scripts" dentro de backend con el comando "node scripts/createUser".
   Esto crearà un nuevo usuario con la informacion agregada en los  campos correspondientes de este archivo createUser.js.
   
7. Una vez logueado con las credenciales correctas, la pàgina automàticamente redirigirà a la pàgina de reservaciones,
   se puede seleccionar cualquier fecha, eso la guarda temporalmente en la tabla a no ser que termine el proceso de reservaciòn
   o se salga de la pestaña (lo que causarà que quede libre nuevamente).

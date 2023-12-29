<a href="https://postimg.cc/2brTyksZ" target="_blank"><img src="https://i.postimg.cc/fL0PHk5B/Project-Name-Music-World-1.png" alt="Project-Name-Music-World-1.png" width="100%" /></a>


| índice    |
| --------- |
| Descripción del Poyecto  |
| Características    |
| Funcionalidad    |
| Tecnologías Utilizadas    |
| Desarrolladores Contribuyentes     |

### Descripción del Proyecto:

Con este proyecto, se da por concluída la mentoría en Desarrollo de Aplicaciones Web, aplicando todas las tecnologías y conocimientos adquiridos y aprendidos durante la misma. 
Mediante el presente proyecto se da por concluída la mentoría y se han aplicado los requerimientos mínimos y necesarios para el desarrollo de este tipo de aplicaciones.

### Características:

Esta web app cuenta con 2 interfaces de visualización, ya que se encuentran 2 tipos de usuarios: 
- DjUsers (Dj´s, musicalizadores, etc)
- MusicUsers (clientes, público en general)

La características principal, es que **Music World** acelera la *conexión* entre los DjUsers, y los MusicUsers que deseen contratar a un Dj para un evento.
Esta app propone agilizar el *esfuerzo de venta* por parte de los DjUsers, y que los MusicUsers tengan a disposición de forma eficiente aquellos DjUsers locales, y su oferta correspondiente oferta de eventos, y géneros musicales que ofrece el mismo, además de las tarifas por aquellos eventos.
Además, como propuesta innovadora, se permite a los MusicUsers configurar su "Playlist" brindando una biblioteca de música interactiva, para que seleccionen aquellas canciones para que el DjUser tenga en cuenta.


De acuerdo al tipo de usuario que interactúe con la web app, se desplegan funcionalidades establecidas para los mismos, de acuerdo a su funcionalidad en el sistema.
### Funcionalidad:
#### Interfaz de Usuarios No Registrados
Se muestra una pantalla para el ingreso de usuarios ya registrados, y además se incluye el registro de los nuevos usuarios, mostrando dos botones que permiten la selección del tipo de usuario que se va a registrar. Luego de seleccionar alguno de ellos, se desplega el formulario correspondiente a completar.
#### Interfaz de DjUsers
Un usuario Dj y/o empresa, luego de completar el registro, va a poder visualizar las siguientes secciones:
##### Mis Géneros
En esta sección, se provee un listado de géneros musicales, provistos por la Api de Spotify https://developer.spotify.com/. Cada género se muestra en componentes chips, y al ser seleccionados se almacenan en el estado del DjUser. 
##### Eventos
Aquí el DjUser tiene predefinido un listado de eventos, entre ellos: "Fiesta de Cumpleaños", "Eventos Corporativos", "Eventos Culturales", etc. Debe seleccionar aquellos en los que él se desempeña regularmente. Esta selección será visible a aquellos MusicUsers al momento de su contratación.
[![DJUSER-tipos-de-eventos.png](https://i.postimg.cc/4y3zVK95/DJUSER-tipos-de-eventos.png)](https://postimg.cc/sQtQRgKQ)

##### Mis Tarifas
Ya una vez definidos los tipos de eventos, se deberá configurar las tarifas correspondientes a los mismos y una estipulación de horas exclusivas para cada evento. También se puede eliminar el evento.
 [![djuser-tarifas-2.png](https://i.postimg.cc/8PMhWVFx/djuser-tarifas-2.png)](https://postimg.cc/SJQ2F3fG)
##### Áreas de trabajo
Cada DjUser debe indicar en un mapa interactivo, sus áreas de cobertura, a través de la incorporación de Google Map React. Además se puede visualizar el listado de las áreas seleccionadas, se puede consultar sus áreas de cobertura (Ir), y/o pueden ser eliminadas.
##### Contrataciones
Aquí se muestran en cards individuales, las contrataciones realizadas por los MusicUsers.  Cada una contiene: 
- Imagen y Nombre del tipo de Evento
- Email e Imagen del MusicUsers contratista
- Detalles del contrato, como por ejemplo: "Fecha y Hora", "Nombre y Apellido del responsable" (MusicUser o Responsable a cargo del evento), "Costo Total", entre otros.
- Eliminar Contrato, que permite rechazar el mismo
- Playlist del MusicUser 
[![Dise-o-sin-t-tulo-3.png](https://i.postimg.cc/9FYYKhWZ/Dise-o-sin-t-tulo-3.png)](https://postimg.cc/N5LX2Z2j)
#### Interfaz de Clientes
Un usuario y/o empresa, luego de registrarse, se va a encontrar con las siguientes secciones:
##### Mi Ubicación
Para una mayor funcionalidad del sistema, se requiere que el MusicUser indique su locació, para que el sistema pueda tener una referencia de su ubicación, o del evento a contratar.
##### Dj Cercanos
Con su ubicación ya establecida, el sistema va a desplegar un listado de DjUsers cercanos, y a los cuales éste puede visualizar con una "vista rápida", que muestra su información, y los eventos con las horas y tarifas definidas para c/u.
Cada card que muestra a los DjUsers, contiene un botón principal para configurar y contratar al mismo. al ser presionado, se muestra en cards individuales los eventos, con otro botón de "Contratar Evento" para completar un formulario de Contrato que contiene:
- Domicilio del Evento
- Nombre Responsable
- Apellido Responsable
- Calendario Interactivo (Data Picker)
- Hora de Inicio
- Hora de Finalización
- Coste total del Servicio
- Botón "Contratar Y Configurar"
[![MUSICUSER-Dj-cercanos.png](https://i.postimg.cc/3JTP2YSv/MUSICUSER-Dj-cercanos.png)](https://postimg.cc/8sZKSQVp)
Formulario de Contrato:
[![contrato-LISTO.png](https://i.postimg.cc/3wNR7g2Y/contrato-LISTO.png)](https://postimg.cc/HJGH98Sh)
##### Mis Contratos
Aquí se muestran en cards individuales, los contratos realizadas a los DjUsers. Cada una contiene:
- Tipo de Evento Contratado
- Imágenes del tipo de Evento y el DjUser
- Fecha y Hora solicitada para el evento
- Cliente Responsable
- Costo Total
- Botón "Eliminar Contrato"
y la configuración de la "Playlist" correspondiente para cada contrato, donde se pueden seleccionar algunas canciones para que el DjUser tenga en cuenta al momento del Evento.
Al ingresar a esta opción, se redirige a la biblioteca interactiva de música del DjUser en cuestion, como para parámetros iniciales encontramos los géneros musicales con los que el Dj trabaja.
Al seleccionar un género, automáticamente el sistema solicita a la Api de Spotify un listado de artistas referentes de ese género, y los muestra en cards individuales. Además se permite al usuario buscar algún artista en particular, a través del Campo de Búsqueda.
Al seleccionar un artista, se desplegará un listado con todos los álbumes del mismo, y si se selecciona un álbum, se desplegará una ventana con el listado de canciones, permitiendo al MusicUser escuchar cada track, y añadirlo al playlist.
[![Dise-o-sin-t-tulo-1.png](https://i.postimg.cc/gJB3mzxB/Dise-o-sin-t-tulo-1.png)](https://postimg.cc/LYLJVMBz)
Reproductor de canciones:
[![MUSICUSER-Playlist3.png](https://i.postimg.cc/bJ39dXv4/MUSICUSER-Playlist3.png)](https://postimg.cc/FdkLnB3x)
### Tecnologías Utilizadas
Las tecnologías utilizadas para el desarrollo de esta web app fueron:
##### Lenguaje de Programación Base
- JavaScript 
- Framework de JavaScript: React
##### Tipado de Datos
- TypeScript
##### Enrutamiento de Componentes
- React-Router
##### Estilos
- Material UI
##### Solicitudes HTTP a Apis
- Axios
##### Manejo y Control del Estado
- Redux Toolkit
##### Mapas
- Google Map React
##### Gestion de Versiones
- Git
### Desarrolladores Contribuyentes
##### Desarrollado por:
Miguel Ortiz, Junior Front-End Developer.
https://www.linkedin.com/in/michel-ortiz-9736b32a5/
##### Code-Review a cargo de:
Fernando A. Gonzalez, Software Lead Engineer.
https://www.linkedin.com/in/fernando-a-gonzalez/

# Contexto de proyecto

## Objetivo del proyecto

Plataforma en línea con TODO el contenido de la carrera de ingenería de sistemas informáticos, repositorio de investigaciones, proyectos, comunidades y sociedad científica de esta carrera.

## Stack tecnológico

- Frontend: NextJS + TailwindCSS
- Backend: Django (actualmente con Server Actions de NextJS)
- Database: PostgreSQL
- Otros: Blender, React Three Fiber + Drei

Link de prototipo web de ai studio (mas completo): https://aistudio.google.com/apps/1bc766bb-b18b-4654-8da8-d2039ededf72?showPreview=true&showAssistant=true

## Aporte general y enorme

Ambiente 3d que será modelado en Blender sobre los pisos de sistemas de mi universidad, con vista área estilo project zomboid, donde se podrá recorrer la universidad, cada aula será una sección de la aplicación, al actualizar, la web como tal debe ponerse en frente de la pantalla, obvio se tendrá un boton para intercalar entre modo 3d y modo web para ver directamente la web como tal.

## Roles

- Admin: Puede ver un sidebar donde ve tablas con toda la información de las secciones, puede aprobar o rechazar propuestas segun el área
- Estudiante: Puede ver todo el contenido de la página y realizar acciones que requieran al usuario, además de mandar propuestas y postulaciones

## Módulos

### Investigación

#### Projects

Proyectos de investigación que abarquen categorias, su desarrollo, likes, etc.
Dentro de puede ver un resumen del proyecto (descripcion) su nivel de "Impacto SOCEISI", likes y compartir, ademas de los datos de los investigadores, obvio al creador como investigador lider y los demas como coautores
Cada estudiante puede postular a un proyecto de investigación, pero el investigador creador define cuantos cupos de ayuda tendría su proyecto, y el creador puede designar a otros usuarios como autores, asi como bajar el rango a coautor a otros
El estudiante creador debe aprobar o rechazar las solicitudes de apoyo de investigación en su panel regular, en sección "Mi Perfil" debe haber un sidebar con todas las opciones de la app para ver las propias del estudiante.
El administrador debe aprobar esta solicitud de proyecto de investigación para poder ser visible para todos
Por cada proyecto publicado y aprobado se le suman puntos de ranking y medallas.

#### Artículos

Poder ver de igual manera un listado de los articulos con el titulo del mismo, y en la vista ver los autores, las fechas de publicacion, no las citaciones, y lo mismo que se ve en AIStudio, el resumen ejecutivo que debe crear el estudiante con las secciones de titulo, intro, metodología, resultados y la conclusión, tambien se puede descargar, no se solicita la colaboracion
De igual manera, un boton que permita presentar un nuevo articulo, lo mismo, no es publico para todos a menos que el admin lo apruebe desde su panel.
Por cada articulo publicado se le suman puntos de ranking y se les da medallas

#### Eventos

2 Vistas
Vista galeria -> Una vista de cards donde se vean los eventos, con su titulo, y su fecha, ademas de ver detalles
Vista calendario -> Un calendario donde se puedan ver todas las actividades segun su fecha

En ambas se pueden ver los detalles de la actividad, titulo, descricion, fecha de ejecucion, area de la actividad (social, epc, investigacion, etc etc), toda esta seccion solo puede ser modificada (creacion, actualizacion, etc) por el administrador, y un boton al final que sea estilo "Deseas colaborar?" y un boton de "Apoyar en actividad"

Y en ambas vistas, que van debajo de la siguiente seccion

Vista main de esto, una gran card con dias, horas, minutos y segundos para la actividad, que avance en tiempo real, obvio considerando el evento que viene

La seccion se divide en 3 secciones

Evento Proximo (contador, etc)

Calendario (vista de gallery y vista de calendario)

Archivos de impacto

Gallery de actividades pasadas

Al finalizar cada actividad, el administrador evalua a cada miembro participante y subre su puntaje de ranking

// Eliminar seccion de Desarrollo y trasladarlo a comunidad

### Comunidad

#### Incubadora

Seccion con todos los proyectos a realizar, igual con titulo, descripcion, tecnologias (aqui creo que si iria jsonb en postgresql), etiquetas, cliente al que esta dirigido, equipo de desarrolladores y una imagen, luego a ver detalles del proyecto
Ademas de compartir y solicitar unirse, ademas de igualmente, poder sugerir un tipo de proyecto, ademas por proyecto igual el creador es el admin, gestiona participantes del proyecto y sus roles dentro del mismo (como dev o como admin)
Al final de un desarrollo el admin da una puntuacion a todos los devs, lo que suma a su puntaje y ranking
Cada propuesta de proyecto debe ser aprobada por el admin

#### Formación Contínua

Primero se ven las mentorias que se estan llevando a cabo, aqui hay de 2
Existirán 2 botones acá, uno para solicitar una mentoria y otro para abrir una, en ambos se abre un modal donde se registra el tema, la descripcion breve, y las categorias, aqui igual es un seleccionab le de las categorias existentes y si no existe, se agregan en caliente estilo notion like, esto igual se sube como propuesta

Se pueden ver a detalle de la mentoria, si es una de tipo donde el estudiante abre una mentoria para todos los interesados, debe subir un documento con su temario en formato pdf, si es una solicitud de mentoria/ayuda entonces con el titulo y descripcion bastan

En el curso o mentoria que abre el estudiante, el como "lider" de esa formacion puede dar por finalizado el modulo o la mentoria, evaluando a cada participante, el lider recibe puntaje mayor y medallas, los mentorados o alumnos de la mentoria reciben un puntaje por asistencia y medallas

En caso de solicitud, el solicitante puede marcar como completada o cancelada la solicitud de mentoria, y calificar al mentor, lo mismo, obvio se le asignan mas puntos al que ayudo, pero tambien al que solicito la ayuda

#### Foro

Pagina clon de stackoverflow/reddit, donde un usuario sube una cuestion, y varios usuarios pueden responder, se califica la cantidad de votos para la pregunta, y con un sistema de ordenamiento basado en likes, tambien las respuestas, y el creador puede dar por aprobada la respuesta que le haya servido, solo se tienen 2 niveles de comentarios, la respuesta al post original, y las respuestas a dicha respuesta, pero llega hasta ahi

Por comentar una solucion se dan pocos puntos, por recibir likes se reciben mas, y por ser la solucion aprobada por el creador del post se reciben muchos mas y una medalla si es la primera vez que sucede

Por poner un post tambien se recibe un punto

Cada post tiene categorias

// Nuevas secciones para Comunidad

#### Escuela de Programación Competitiva

Seccion en desarrollo

#### AWS Student Group (Nombre temporal)

Seccion en desarrollo

#### Comunidad de ciberseguridad

Seccion en desarrollo

#### Interaccion social y voluntariado

Seccion en desarrollo

#### ISI Sports

Seccion en desarrollo

### Sociedad

Seccion directa, sin subsecciones
Seccion de cards puramente informativos sobre todos los miembros de diferentes secciones

Para todos solo nombre de contacto, foto de perfil y boton de ver perfil
Seccion directiva -> Cards para los siguientes roles fijos: Presidente, Vicepresidente, Secretario de directiva, Secretario de Investigacion, Secretario de RSU e Interaccion Social, Secretario de relaciones, secreatario de deportes y cultura, Vocal, Vocal

Como admin poder asignar a cada uno de ellos, y automaticamente tambien pasan a tener rol de administrador, ademas de que el o y a de secretario(a) es dinamico segun el genero, eso tambien se define al momento de la asignacion.

Luego las secciones de abajo son para todos los demas miembros que se unan a la sociedad cientifica que se van a todas las areas, igual solo ppf, nombre y el botoncito de ver perfil

### Ranking o Cuadro de Honor

Seccion directa, sin subsecciones

Top 3, 2 y 1 de los que mas tienen isipoints (IPs) (referencia tech), y segun cada cantidad de puntos tambien su rango

Y por abajo una tabla con los demas puestos, algo sencillo, y poder ver su ppf, su nombre, y un boton para ver su perfil

### Mi perfil

#### Dashboard

Vista general con los dev points (son puntos generales para todo, olvidate de research points y demas)
Logros
Misiones, que no se tengan que activar misiones, que siempre esten activas y segun la seccion en la que se realice la accion, se suman puntos.
Eventos, diferente de seccion de eventos, en este caso se ven misiones especiales que el administrador define, sobretodo en eventos si en el modal de creacion de eventos el admin tambien marca una casilla de [] aplica a puntaje y si la marca, se habilita un campo numerico donde se pone la cantidad int de puntos a asignar y la descripcion de lo que debe realizar tipo "Ganar el primer lugar en tal actividad" y asi. Al final el admin otorga los puntos
Insignias, todas las medallas que mencionamos previamente, que tengan que ver con las primeras veces quizas dando una mentoria, ayudando a un compañero, y que ademas sean acumulables ejemplo "Uno para todos | Responde a una solicitud de mentoria satisfactoriamente x4" el x4 porque digamos que este estudiante resolvio eso 4 veces, o al reves "Todos para uno | Recibe ayuda en una solicitud de mentoria x4" y asi, con logos bonitos y demas
Nivel de desarrollo -> Aqui se me ocurren 5 niveles (junior, dev master, gonzalord, quantum coder, SENIOR SOCEISI)
Nos olvidamos de nivel de investigacion

#### Perfil

Resumen de datos del perfil, puntos, rango, nombres, redes del usuario (si las agrega en la seccion de su perfil se ven, si no, no)
Una descripcion propia por el usuario que el escribe, y todos sus aportes al sistema, y las secciones en la que esta relacionado (incubadora, artiuclos, investigaciones, etc etc)
Ademas de poder poner sus skills, solo las skills, unicamente las skills, no el porcentaje ni seniority, y los logros obtenidos

## Otros

Estilo: Moderno, futurista, mejores practicas UX/UI, modo oscuro, no con azules, netamente oscuro, y modo claro, tailwindCSS

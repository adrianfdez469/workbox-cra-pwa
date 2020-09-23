Link [Esto es un link](https://dir.com/asd/dasd)
# H1
## h2
### `h3` con fondo gris
`estas comillas ponen el fondo gris`

# React PWA(Progressive Web App) o Aplicacion Web Progresiva creada con la herramienta [`create-react-app`](https://create-react-app.dev/docs/getting-started/)

## Que herramientas se usan
Para la demostracion se utiliza [`React`](https://es.reactjs.org/) como libreria principal para la construccion del demo, junto con [`Workbox`](https://developers.google.com/web/tools/workbox) que es un conjunto de bibliotecas y módulos de Node que facilitan el almacenamiento de los recursos en caché y aprovechan al máximo las funciones utilizadas para crear PWA.

### En que consiste la aplicacion
La aplicacion es bastante sencilla, consta de un botón principal que al presionarlo, realiza una petición get a una `API-REST`, la cual devuelve un arreglo con usuairos, en los que cada uno tiene además del nombre y el id, una url con la direccion de la foto de ese usuario.<br>

La aplicacion podra ser instalada en la PC o el Telefono como si fuera una aplicacion nativa dando la posibildad de ser usada con o sin conexion a internet. Siendo estas las caracteristicas principales de las PWA.

### Que aprenderán
Aprenderas como editar la configuracion de `webpack` en una `create-react-app` para poder usar un `service-worker` personalizado.<br>

### Como probar la aplicacion local en tu PC
Para poder probar la aplicacion, debes clonar ese repositorio local en tu maquina, mediante la consola de comandos entrar a la carpeta raiz del proyecto y teniendo una conexion estable de internet ejecutar el comando `yarn` o `npm install`. 

Después debes clonar el codigo del servidor api-rest [API](https://github.com/adrianfdez469/DUMY_API_REST_FOR_WORKBOX_TEST.git). Una vez clonado, mediante la consola de comandos entrar a la carpeta raiz y con una conexion estable de internet ejecutar el comando `yarn` o `npm install`.

Una vez terminado los 2 procesos anteriores debes poner a funcionar las dos aplicaciones. Comienza por el API(2do que clonaste), usando la consola de comandos, ubicado en la carpeta raiz 
ejecutar `yarn start` o `npm start`. Ejecuta la misma operacion para la otra aplicacion (1ra que clonaste). Automaticamente se debe abrir el navegador (se necesitan chrome o firefox en versiones recientes para que funcionen las caracteristicas de PWA) en la direccion http://localhost:3000 con el demo, una vez que vayas interactuando con este, el mismo va a ir guardando los recursos en la cache del navegaror, puedes instalar la aplicacion en la computadora si deseas mediante un icono que aparece en la barra de direcciones en el extremo derecho. Despues de esto puedes cerrar los servidores completamente, cerrar y abrir la aplicacion, te darás cuenta que funciona al 100%. ☺

### Pasos para crear esta convertir la app en un PWA
1- Modificar manifest.json
2- Habilitar el registro del service-worker en nuestra aplicación.
3- Primero que todo debemos reconfigurar `webpack` para que use nuestra configuracion personalizada de workbox.
3- Personalizar el archivo `serviceWorker.js` que se crea por defecto cuando usas `create-react-app`.
4- Crear el `sw.js` que será el service-worker personalizado por nosotros que utilizará la aplicación. 

#### 1- Modificando el manifest.json
En este fichero se configuran los elementos básicos de una PWA. Como por ejemplo el nombre, el color de fondo, entro otras cosas. No voy a detenerme a explicar cada detalle de este fichero, si necesitas saber mas visita este (link)[https://developer.mozilla.org/es/docs/Web/Manifest], aquí para que funcione con los minimos cambios modificamos la propiedad `"start_url": "."` por `"start_url": "/"`.

#### 2- Registrando el service-worker
Por defecto `create-react-app` nos brinda un grupo de funcionalidades y bondades que podemos utilizar para nuestro beneficio, y la creacion y registro de los services-workers es una de ellas, sin embargo viene desabilitado por defecto, por lo que para habilitarlo tenemos que modificar el fichero `/src/index.js`, cambiamos:
    serviceWorker.unregister();
por
    serviceWorker.register();
Esto por defecto habilita en nuestra aplicacion la creacion de un service-werker predeterminado webpack. <br>
Hasta este punto, ya tenemos una PWA básica, en la cual se cachean los recursos estáticos, es decir los ficheros *.js, *.css y *.html que necesitan la SPA(Single Page Application) para funcionar, por lo que ya en este punto, podemos instalarla en la PC y trabajar con ella offline.<br> 
Pero queda un detalle, cómo hacemos para cachear las peticiones, imágenes y otros recursos que necesita nuestro sitio para trabajar y son llamados bajo demanda?<br>
En los próximos pasos, explicaremos que debemos hacer para lograr esto.


#### 3- Reconfigurando webpack en una `create-react-app` 
Debemos saber que a partir de la versión 2 de `create-react-app`, la configuracion de `webpack` incluye `workbox` de manera predeterminada como uno de sus plugins, en versiones anteriores no usaba webpack, sin embargo incluía otro plugin con funcionalidades similares. Por lo que tenemos que hacer algo para eliminar estos plugins si existen. Es valido aclarar que este demo está realizado con `create-react-app v2`.<br>

Para poder modificar la configuración predeterminada de webpack debemos instalar `react-app-rewired` mediante `npm install react-app-rewired --dev` o `yarn add react-app-rewired --dev`. Este leerá un archivo llamado `config.overrides.js` situado en el directorio raiz (donde se encuentra el `package.json`).<br>

En este archivo debemos exportar un objeto con un atributo webpack, el cual contendrá una función que recive 2 parametros, config y enviroment.<br>
`config` contiene el objeto de configuración que trae por defecto webpack, en este debemos eliminar los plugins que no usaremos y agregar el nuestro. Para esto instalaremos otros 2 paquetes de npm `yarn add workbox-webpack-plugin --dev` o `npm install workbox-webpack-plugin --dev` que permitirá inyectar el plugin de workbox a webpack y `yarn add react-app-rewire-unplug --dev` o `npm install react-app-rewire-unplug --dev` que permitirá eliminar plugins de la configuracion de webpack. 

Veamos el codigo como queda.

    
    const workboxPlugin = require('workbox-webpack-plugin');
    const rewireUnplug = require('react-app-rewire-unplug');
    const path = require('path');

    module.exports = {
        webpack: function(config, env) {
            // Eliminando el plugin de webpack, se usan los dos para que funcione en cualquiera de las verisones
            // de create-react-app, pero en las veriones recientes con solo eliminar 'GenerateSW' será sufiente
            // ya que las versiones viejas de create-react-app usan SWPrecacheWebpackPlugin y las modernas >= v2
            // usan GenerateSW.
            config = rewireUnplug(config, env, {
                pluginNames: ['GenerateSW', 'SWPrecacheWebpackPlugin']
            });

            // Agregando el plugin de workbox a webpack
            config.plugins.push(new workboxPlugin.InjectManifest({
                // Dirección donde webpack irá a buscar el fichero service-worker                
                swSrc: path.join(__dirname, 'public', 'sw.js'),
                // Dirección donde webpack ubicará el fichero service-worker cuando realice el build
                swDest: 'sw.js'
            }))

            // Devolvemos la nueva configuracion de webpack
            return config;
        }
    }

Depués de esto, para que react reconozca y use este archivo, tenemos que modificar en el package.json los scripts `start` y `build` de la siguiente manera:

    {
        ...
        "scripts": {
            "start": "react-app-rewired start",
            "build": "react-app-rewired build",
        },
        ...
    }

Y esta es la razon por la que los paquetes anteriormente instalados se incluyen solamente como dependencias de desarrollo `--dev`, ya que son usados solamente en tiempo de creacion `yarn start/nom start` o construccion `yarn build/nom build` del proyecto, pero antes de intentar realizar estas acciones `start o build` debemos crear el fichero `/public/sw.js`, el cual puedes dejar vacío por el momento.

#### Personalizando serviceWorker.js
Este archivo es auto generado por `create-react-app` que a grandes rasgos, se encarga de realizar un grupo de validaciones y registrar en el navegador el `service-worker`, que en nuestro caso será `/public/sw.js` que creamos anteriormente. Por lo que tenemos que realizar las siguientes modificaciones:

1- Para poder probar todo lo que haremos en desarrollo, en la funcion `register()` de `/ser/serviceWorker.js` comentareamos parte de la validacion del `if` como se muestra:
    if (/*process.env.NODE_ENV === 'production' && */'serviceWorker' in navigator) {
        //...
    }
2- El segundo cambio que debemos hacer en la linea 35, dentro de esa misma funcion cambiar:
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
por:
    const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

#### Trabajando con el Service Worker (sw.js)
Ha llegado el paso final, pero antes de explicar que haremos dentro del fichero `sw.js` hay algunas cuestiones sobre el funcionamiento de la app que debemos conocer.
Lo que queremos lograr al final, es tener una aplicacion que funcione completamente offline, y la forma de lograrlo es convirtiendola en una PWA como hemos explicado hasta ahora. Pero qué significa esto? Significa que la aplicacion debe tener todos los recursos que necesita disponibles incluso cuando no tenga una coneccion a internet o el servidor de la aplicacion que provee el servicio esté caido. En la web la manera de lograr esto es guardando en la memoria caché del navegador todos estos recuros, desde los ficheros estaticos `*.js *.css *.html` hasta las peticiones e imágenes que se llaman bajo demanda, y es aquí donde entra workbox a cumplir su función.

Existen varias maneras de incluir workbox en nuestro proyecto, mediane CDN o mediante módulos. Para este proyecto usaremos la segunda variante.
Para empezar debemos intalar varios paquetes:<br>
`npm install workbox-routing workbox-strategies workbox-expiration workbox-precaching` o <br>
`yarn add workbox-routing workbox-strategies workbox-expiration workbox-precaching`<br>

Veamos el código:

    // /public/sw.js
    import {precacheAndRoute} from 'workbox-precaching';

    // eslint-disable-next-line no-restricted-globals
    precacheAndRoute(self.__WB_MANIFEST);

Estas primeras lineas son practicamente obligatorias, `precacheAndRoute` se encarga de cachear todos los archivos estáticos que usa la aplicación para renderizarse, y el uso de `self.__WB_MANIFEST` es obligatorio en este archivo, si no lo pones en este fichero no funcioná nada en la pagina, verás un error alertardo que no se encuentra "self.__WB_MANIFEST" en sw.js y está dado porque él método InjectManifest (config-overrides.js) busca esta variable en este fichero y trata de sustituirla por un arreglo que contiene todos los recursos estáticos, para evitar este problema, siempre pon el codigo que mostré, por eso dije que era "obligatorio".<br>

Lo segundo que haremos será cachear la respuesta de la peticion que se realiza al API-SERVER el cual devuelve un json como respuesta, lo haremos agregando el siguiente codigo:

    import {registerRoute} from 'workbox-routing';
    import {NetworkFirst} from 'workbox-strategies';
    import {precacheAndRoute} from 'workbox-precaching';

    // eslint-disable-next-line no-restricted-globals
    precacheAndRoute(self.__WB_MANIFEST);

    registerRoute('http://localhost:3001/data', 
        new NetworkFirst({
            cacheName: 'server-data',
            // Tiempo a esperar por el service worker antes de responder con los datos de la cache
            networkTimeoutSeconds: 1 
        })
    )

Aquí lo nuevo es que importamos `registerRoute` de `workbox-routing` y `NetworkFirst` de `workbox-strategies`.<br>
El primero se usa para registrar las peticiones, y se le pasan 2 parametros, el 1ro puede ser un string o una expresion regultar o una funcion boleana, este primer parámetro se encarga de decidir si guardar en caché o no cualquier petición.<br>
Como segundo parámetro se pasa la estrategia a seguir. Workbox define un grupo de estrategias las cuales son:
`CacheFirst` `NetworkFirst` `CacheOnly` `NetworkOnly` `StaleWhileRevalidate` cada una de estas se utiliza en diferentes escenarios, dirígete al sitio oficial de workbox para conocer sobre estas.
Especificamente en el codigo que vemos, lo que hace es que cada vez que responda la peticion realizada a http://localhost:3001/data esta se cachea en el navegador, y esa cache no se usa mientras la respuesta de esa peticion sea satisfactoria, en el momento en que se cae la conexion, entonces el service-worker busca los datos dentro de la cache y los devuelve como respuesta de la petición. La propiedad `cacheName` es el nombre de la cache donde se guardaran estos datos, para verlos abre en chrome Herramientas de desarrollador(F12) y en la pestaña "Aplicación" en el apartado "Cache" despliega "Cache Storage" y verás "server-data" con los datos de la respuesta de la petición (es posible que tengas que recargar el navegador antes de verlo).

Por ultimo, agregamos los elementos finales:

    import {registerRoute} from 'workbox-routing';
    import {NetworkFirst, StaleWhileRevalidate} from 'workbox-strategies';
    import {precacheAndRoute} from 'workbox-precaching';
    import {ExpirationPlugin} from 'workbox-expiration';

    // eslint-disable-next-line no-restricted-globals
    precacheAndRoute(self.__WB_MANIFEST);

    registerRoute('http://localhost:3001/data', 
        new NetworkFirst({
            cacheName: 'server-data',
            // Tiempo a esperar por el service worker antes de responder con los datos de la cache
            networkTimeoutSeconds: 1 
        })
    )

    registerRoute(
        ({request, url}) => {
            return url.href.startsWith('http://localhost:3001/public/images/avatars/');
        },
        new StaleWhileRevalidate({
            cacheName: 'image-cache',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 20,
                    maxAgeSeconds: 7 * 24 * 60 * 60
                })
            ]
        })
    )

Esta última modificación permite aplicar la estrategia `StaleWhileRevalidate` a las peticiones que comienzan con el patrón definido en el codigo `http://localhost:3001/public/images/avatars/`. Esta estrategia funciona de la siguiente manera, la primera vez que se realiza la peticion, al responder, se guardan en chaché y se envia la respuesta al navegador, de ahi en adelante, la respuesta simpre se busca en la caché, sin embargo se realiza la petición tambien para actualizar esta caché, muy util para avatares de perfiles de usuarios de contactos, y situaciones similares. En este ejemplo se incorpora a la estrategia un plugin de expiracion, al cual se le configura cantidad maxima de recursos y el tiempo maximo a permanecer en caché.

#### Conclusiones
Con esto terminamos!!! ☻



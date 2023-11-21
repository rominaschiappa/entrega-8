emercado-api
JSONs container para simular una Api REST para el ecommerce e-Mercado.

# Login

## Paso 1

Se debe instalar  'jsonwebtoken'

`npm install jsonwebtoken`

## Paso 2

se crea el endpoint

`app.post('/login',express.json(), (req,res) =>{})`

app - es el llamado a express

post - es el metodo HTTP

'/login' - este es el nombre del endpoint

express.json() - es el middelware para verificar el body

(re, res) => {} - esta parte ya entra a la logica de la peitición

## Paso 3

Creamos el token

Const token = jwt.sign({userId: 509}, 'secretKey', {expiresIn: '1h'})

jwt.sign - es lo que inicia la creacion del token

{userId: 509} - aqui va el user.id como no hay BDD puse un random

'secretKey' - Esta normalmente va en un .env que son variables de entorno pero podes en este caso ponerlo acá
las variables de entorno se utilizan para guardar informacion sin que se vean, esto es importante cuando se sube a git o se pone en produccion

    res.json({token}) - Devolvemos el token en un json

# Verificación

Creamos la variable con el middelwarw
`const verificacion = (req, res, next) =>{`

Obtenemos el token 
`const token = req.header('Authorization');`

Verificamos que exista
`if(token === undefined){`

Si no existe el token debemos decirle amigablemente al usuario que no esta logeado
`return res.status(400).json({'mesagge': 'Error, debe estar ingresado en el sistema para ingresar, verifique su información. Disculpe las molestias'})`

Utilizamos try y catch para casar cualquier error que haya

try{

    const verificationUser = jwt.verify(token, 'secretKey')

    req.usuario = verificationUser

Si está logeado sigue a la función gracias al next

`next()`

Si hay error devuelve un error

`catch (error){res.status(400).json({'mesagge': 'Verificacion incorrecta'})`

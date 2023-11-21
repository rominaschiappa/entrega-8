const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const dataFolderPath = path. join(__dirname);

app.get('/cats/:id', (req, res) => {
    const catId = req.params.id;
    const filePath = path.join(dataFolferPath, 'cat', `${catsId}.json`);
});

app.get('/cart/:id', (req, res) => {
    const cartId = req.params.id;
    const filePath = path.join(dataFolderPath, 'cart', `${cartId}.json`);
    res.sendFile(filePath);
});

app.get('/cats_products/:id', (req, res) => {
    const cats_productsId = req.params.id;
    const filePath = path.join(dataFolder, 'cats_products', `${cats_productsId}.json`);
    res.sendFile(filePath);
});

app.get('/products/:id', (req, res) => {
    const productsId = req.params.id;
    const filePath = path.join(dataFolderPath, 'products', `${productsId}.json`);
    res.sendFile(filePath);
});

app.get('/products_comments/:id', (req,res)=>{
    const products_commentsId = req.params.id;
    const filePath = path.join(dataFolderPath, 'products_comments', `${products_commentsId}.json`);
    res.sendFile(filePath);
});

app.get('/sell/:id', (req,res)=>{
    const sellId = req.params.id;
    const filePath = path.join(dataFolderPath, 'sell', `${sellId}.json`);
    res.sendFile(filePath);
});

app.get('/user_cart/:id',(req,res)=>{
    const user_cartId = req.params.id;
    const filePath = path.join(dataFolderPath, 'user_cart', `${user_cartId}.json`);
    res.sendFile(filePath);
});

app.listen(port, () =>{
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


app.post('/login', express.json(),async (req,res)=>{

    
    const  {username , password } = req.body;


const pool = mariadb.createPool({
    host: 'your_host',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database',
    connectionLimit: $
});

const conn = await pool.getConnection();
const user = conn.query(`SELECT * FROM users WHERE username = ${username} & password = ${password}`);
const token = jwt.sign({userId : user.id} , 'secretkey',{expiresIn: '1h'});
res.json({token});
});

const verificacion = (req,res,next) => {
     
    const token = req.header('Autorizacion');
    
    if (token=== undefined){
        return res.status(400).json({'mensaje': 'Error, debe estar ingresado en el sistema para ingresar, verifique su informacion.Disculpe las molestias'})
    }    
    try
    {
        const verificationUser = jwt.verify(token, 'secretKey')
        req.usuario = verificationUser
        next()
    }
    catch(error){
        res.status(400).json({'mensaje':'Verificacion incorrecta'})
    }
};
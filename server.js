const express = require('express')
const mysql = require('mysql')
const myconn = require('express-myconnection')
const app = express()
const multer=require('multer')

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.set('port', process.env.PORT || 9000)

const storage=multer.diskStorage({
    filename:function(res,file,cb){
        console.log(file)
        cb(null,file.originalname)
    },
    destination:function(res,file,cb){
        cb(null,`./archivos`)
    }
})

const upload=multer({storage})

const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'clases'
}
//middlewares
app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json())
app.use(express.static('./archivos'))
//rutas
app.get('/', (req, res) => {
    res.send("Welcome")
})
//Server running
app.listen(app.get('port'), () => {
    console.log('server running on port', app.get('port'))
})

app.get('/clases', (req, res) => {
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('SELECT * FROM clase', (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.get('/funciones', (req, res) => {
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('SELECT * FROM getfunciones', (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.get('/atributos', (req, res) => {
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('SELECT * FROM getatributos', (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.get('/herencia', (req, res) => {
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('SELECT * FROM herenciaf', (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

//Subir archivos
/*app.post('/upload',upload.single('myFile'), (req,res)=>{
    res.send({data:'OK'})
})*/

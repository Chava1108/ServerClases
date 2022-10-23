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

app.post('/upload',upload.single('myFile'), (req,res)=>{
    res.send({data:'OK'})
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

app.get('/clases/:nombre', (req, res) => {
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('SELECT id FROM clase WHERE clase.nombre=?', [req.params.nombre],(err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.get('/atributosHeredados/:id', (req, res) => {
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('CALL getAtributosHeredados(?);', [req.params.id],(err,rows)=>{
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

//funciones get de los usuarios

app.get('/usuario', (req, res)=> {
    req.getConnection((err, conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('SELECT * FROM usuario', (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

//funciones get de proyectos

app.get('/proyecto/:id', (req, res) => {
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('SELECT * FROM proyecto WHERE proyecto.id_usr=?', [req.params.id],(err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.post('/clases', (req, res) => {
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('INSERT INTO clase set ?',[req.body], (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

//funcion post para la tabla de usuario
app.post('/usuario', (req, res) => {
    req.getConnection((err, conn)=> {
        if(err){
            return res.send(err)
        }
        conn.query('INSERT INTO usuario set ?', [req.body], (err, rows) => {
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

//funcion post para tabla de proyecto

app.post('/proyecto', (req, res) => {
    req.getConnection((err, conn)=> {
        if(err){
            return res.send(err)
        }
        conn.query('INSERT INTO proyecto set ?', [req.body], (err, rows) => {
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.post('/atributos', (req, res) => {
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('INSERT INTO atributos set ?',[req.body], (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.post('/funciones', (req, res) => {
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('INSERT INTO funciones set ?',[req.body], (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.post('/herencia', (req, res) => {
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        conn.query('INSERT INTO herencia set ?',[req.body], (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.delete('/clase/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        console.log(req.body)
        conn.query('DELETE from clase where Id = ?',[req.params.id], (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.delete('/atributos/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        console.log(req.body)
        conn.query('DELETE from atributos where id_clase = ?',[req.params.id], (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.delete('/funciones/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        console.log(req.body)
        conn.query('DELETE from funciones where id_clase = ?',[req.params.id], (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.delete('/herencia/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        console.log(req.body)
        conn.query('DELETE from herencia where  id_claseHijo = ?',[req.params.id], (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.put('/atributos/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        console.log(req.body)
        conn.query('UPDATE atributos set ? WHERE id = ?',[req.body,req.params.id], (err,rows)=>{
            if(err){
                return res.send(err)
            }
            res.json(rows)
        })
    })
})

app.put('/funciones/:id',(req,res)=>{
    req.getConnection((err,conn)=>{
        if(err){
            return res.send(err)
        }
        console.log(req.body)
        conn.query('UPDATE funciones set ? WHERE id = ?',[req.body,req.params.id], (err,rows)=>{
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



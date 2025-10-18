// ทำการ import http เข้ามาเพื่อทำการ run server
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors')
const mysql = require('mysql2/promise')

app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:5173'
}));

let conn = null

// function ดึงข้อมูลจาก DataBase
const initMySQL = async () => {
  try {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'numerical',
      port: 8889
    });
    console.log("✅ MySQL connected");

    //----------------Bisection----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS bisectionproblems(
            equation varchar(255) PRIMARY KEY,
            xr float,
            xl float,
            error float
        )
    `);
    console.log("✅ Table 'bisectionproblems' ensured");


    //----------------Graphical----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS graphicalproblems(
            equation varchar(255) PRIMARY KEY,
            xr float,
            xl float,
            error float
        )
    `);
    console.log("✅ Table 'graphicalproblems' ensured");


    //----------------FalsePosition----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS falseposition(
            equation varchar(255) PRIMARY KEY,
            xr float,
            xl float,
            error float
        )
    `);
    console.log("✅ Table 'falseposition' ensured");


    //----------------OnePoint----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS onepoint(
            equation varchar(255) PRIMARY KEY,
            x float,
            error float
        )
    `);
    console.log("✅ Table 'onepoint' ensured");


    //----------------NewtonRaphson----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS newtonraphson(
            equation varchar(255) PRIMARY KEY,
            x float,
            error float
        )
    `);
    console.log("✅ Table 'newtonraphson' ensured");


    //----------------Secant----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS secant(
            equation varchar(255) PRIMARY KEY,
            x0 float,
            x1 float,
            error float
        )
    `);
    console.log("✅ Table 'secant' ensured");

    //----------------interpolation----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS interpolations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            method VARCHAR(255),        
            x DOUBLE
            )
    `);
    console.log("✅ Table 'interpolation' ensured");

    //----------------interpolation_point----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS interpolation_points (
            id INT AUTO_INCREMENT PRIMARY KEY,
            interpolation_id INT,      
            point_index INT,
            x DOUBLE NOT NULL,
            fx DOUBLE NOT NULL,
            FOREIGN KEY (interpolation_id) REFERENCES interpolations(id)
                ON DELETE CASCADE
            )
    `);
    console.log("✅ Table 'interpolation_point' ensured");


  } catch(err) {
    console.error("❌ Cannot init MySQL or create table:", err.message);
  }
};

// กำหนด host และ port เริ่มต้น
const port = 8000

// --------------------------------GET------------------------------------

// path = GET /Bisection
app.get('/Bisection' , async (req,res) =>{
    console.log('GET Bisection Complete')
    const results = await conn.query('SELECT * FROM bisectionproblems')
    res.json(results[0])
})

// path = GET /Graphical
app.get('/Graphical' , async (req,res) =>{
    console.log('GET Graphical Complete')
    const results = await conn.query('SELECT * FROM graphicalproblems')
    res.json(results[0])
})

// path = GET /FalsePosition
app.get('/FalsePosition' , async (req,res) =>{
    console.log('GET FalsePosition Complete')
    const results = await conn.query('SELECT * FROM falseposition')
    res.json(results[0])
})

// path = GET /OnePoint
app.get('/OnePoint' , async (req,res) =>{
    console.log('GET OnePoint Complete')
    const results = await conn.query('SELECT * FROM onepoint')
    res.json(results[0])
})

// path = GET /NewtonRaphson
app.get('/NewtonRaphson' , async (req,res) =>{
    console.log('GET NewtonRaphson Complete')
    const results = await conn.query('SELECT * FROM newtonraphson')
    res.json(results[0])
})

// path = GET /Secant
app.get('/Secant' , async (req,res) =>{
    console.log('GET Secant Complete')
    const results = await conn.query('SELECT * FROM secant')
    res.json(results[0])
})

// path = GET /newtondivided
app.get('/newtondivided' , async (req,res) =>{
    console.log('GET newtondivided Complete')
    const results = await conn.query(`
        SELECT inter.x_value , p.point_index , p.x , p.fx 
        FROM interpolations inter,interpolation_points p
        where inter.id = p.interpolation_id AND inter.method = 'newton'
    `);
    res.json(results[0])
})

// --------------------------POST----------------------------------

// path = POST /Bisection สำหรับการสร้าง Equation ใหม่บันทึกเข้าไป
app.post('/Bisection' , async(req,res) =>{
    try{
        let data = req.body
            const results = await conn.query('INSERT INTO bisectionproblems SET ?', data)
            res.json({
                message : 'insert Bisection ok',
                data : results[0]
            })  
    }
    catch(error){
        console.error('error message',error.message)
        res.status(500).json({
            message: 'something wrong',
        })
    }
})

// path = POST /Graphical สำหรับการสร้าง Equation ใหม่บันทึกเข้าไป
app.post('/Graphical' , async(req,res) =>{
    try{
        let data = req.body
            const results = await conn.query('INSERT INTO graphicalproblems SET ?', data)
            res.json({
                message : 'insert Graphical ok',
                data : results[0]
            })  
    }
    catch(error){
        console.error('error message',error.message)
        res.status(500).json({
            message: 'something wrong',
        })
    }
})


// path = POST /FalsePosition สำหรับการสร้าง Equation ใหม่บันทึกเข้าไป
app.post('/FalsePosition' , async(req,res) =>{
    try{
        let data = req.body
            const results = await conn.query('INSERT INTO falseposition SET ?', data)
            res.json({
                message : 'insert FalsePosition ok',
                data : results[0]
            })  
    }
    catch(error){
        console.error('error message',error.message)
        res.status(500).json({
            message: 'something wrong',
        })
    }
})


// path = POST /OnePoint สำหรับการสร้าง Equation ใหม่บันทึกเข้าไป
app.post('/OnePoint' , async(req,res) =>{
    try{
        let data = req.body
            const results = await conn.query('INSERT INTO onepoint SET ?', data)
            res.json({
                message : 'insert OnePoint ok',
                data : results[0]
            })  
    }
    catch(error){
        console.error('error message',error.message)
        res.status(500).json({
            message: 'something wrong',
        })
    }
})


// path = POST /NewtonRaphson สำหรับการสร้าง Equation ใหม่บันทึกเข้าไป
app.post('/NewtonRaphson' , async(req,res) =>{
    try{
        let data = req.body
            const results = await conn.query('INSERT INTO newtonraphson SET ?', data)
            res.json({
                message : 'insert NewtonRaphson ok',
                data : results[0]
            })  
    }
    catch(error){
        console.error('error message',error.message)
        res.status(500).json({
            message: 'something wrong',
        })
    }
})


// path = POST /Secant สำหรับการสร้าง Equation ใหม่บันทึกเข้าไป
app.post('/Secant' , async(req,res) =>{
    try{
        let data = req.body
            const results = await conn.query('INSERT INTO secant SET ?', data)
            res.json({
                message : 'insert Secant ok',
                data : results[0]
            })  
    }
    catch(error){
        console.error('error message',error.message)
        res.status(500).json({
            message: 'something wrong',
        })
    }
})


// path = POST /interpolation 
app.post('/inter' , async(req,res) =>{
    try{
        let data = req.body
        let inter = {
            x : data.x,
            method : data.method
        }
        const results = await conn.query('INSERT INTO interpolations SET ?', inter)
        res.json({
            message : 'insert newtondivded ok',
            data : results[0]
        })
        for(let i=0;i<data.points.length;i++){
            let point = {
                interpolation_id : results[0].insertId,
                point_index : i,
                x : data.points[i].x,
                fx : data.points[i].fx
            }
            await conn.query('INSERT INTO interpolation_points SET ?', point)
        }
        
    }
    catch(error){
        console.error('error message',error.message)
        res.status(500).json({
            message: 'something wrong',
        })
    }
})

// ทำการ run server
app.listen( port, async (req,res) => {
    await initMySQL()
    console.log('http server run at' + port)
})
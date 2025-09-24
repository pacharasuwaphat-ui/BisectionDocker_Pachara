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
      host: 'db',
      user: 'root',
      password: 'root',
      database: 'Bisection',
      port: 3306
    });
    console.log("✅ MySQL connected");

    await conn.query(`
        CREATE TABLE IF NOT EXISTS bisectionproblems(
            equation varchar(255) PRIMARY KEY,
            xr float,
            xl float,
            error float
        )
    `);
    console.log("✅ Table 'bisectionproblems' ensured");
  } catch(err) {
    console.error("❌ Cannot init MySQL or create table:", err.message);
  }
};

// กำหนด host และ port เริ่มต้น
const port = 8000

// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/Bisection' , async (req,res) =>{
    console.log('GET Complete')
    const results = await conn.query('SELECT * FROM bisectionproblems')
    res.json(results[0])
})

// path = POST /Bisection สำหรับการสร้าง Equation ใหม่บันทึกเข้าไป
app.post('/Bisection' , async(req,res) =>{
    try{
        let data = req.body
        
            const results = await conn.query('INSERT INTO bisectionproblems SET ?', data)
            res.json({
                message : 'insert ok',
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



// ทำการ run server
app.listen( port, async (req,res) => {
    await initMySQL()
    console.log('http server run at' + port)
})
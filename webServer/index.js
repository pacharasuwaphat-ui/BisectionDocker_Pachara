// ทำการ import http เข้ามาเพื่อทำการ run server
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors')
const mysql = require('mysql2/promise')
const swaggerUI = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

app.use(express.json());




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

    //----------------root2x----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS root2x(
            equation varchar(255) ,
            xr float,
            xl float,
            error float,
            method varchar(255),
            PRIMARY KEY( equation , xr , xl , error , method)
        )
    `); 
    console.log("✅ Table 'root2x' ensured");


    //----------------root1x----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS root1x(
            equation varchar(255) ,
            x float,
            error float,
            method varchar(255),
            PRIMARY KEY (equation , x , error , method)
        )
    `);
    console.log("✅ Table 'root1x' ensured");


    //----------------interpolation----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS interpolations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            method VARCHAR(255),        
            x DOUBLE,
            n INT
            )
    `);
    console.log("✅ Table 'interpolation' ensured");

    //----------------interpolation_point----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS interpolation_points (
            id INT AUTO_INCREMENT PRIMARY KEY,
            interpolation_id INT,      
            point_index INT,
            xi DOUBLE NOT NULL,
            fx DOUBLE NOT NULL,
            FOREIGN KEY (interpolation_id) REFERENCES interpolations(id)
                ON DELETE CASCADE
            )
    `);
    console.log("✅ Table 'interpolation_point' ensured");

    //----------------singleintegration----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS singleintegration(
            equation varchar(255),
            x0 float,
            x1 float,
            method varchar(255),
            PRIMARY KEY (equation , x0 , x1 , method)
        )
    `);
    console.log("✅ Table 'singleintegration' ensured");

    //----------------compositeintegration----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS compositeintegration(
            equation varchar(255),
            x0 float,
            x1 float,
            n int,
            method varchar(255),
            PRIMARY KEY (equation , x0 , x1 , n , method)
        )
    `);
    console.log("✅ Table 'compositeintegration' ensured");

    //----------------LinearAlgebra----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS LinearAlgebra(
            id INT AUTO_INCREMENT PRIMARY KEY,
            n int,
            error double,
            method varchar(255)
        )
    `);
    console.log("✅ Table 'LinearAlgebra' ensured");

    //----------------Linear_A----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS Linear_A(
            id INT AUTO_INCREMENT PRIMARY KEY,
            data float,
            index_i int,
            index_j int,
            linear_id int,
            FOREIGN KEY (linear_id) REFERENCES LinearAlgebra(id)
            ON DELETE CASCADE
        )
    `);
    console.log("✅ Table 'Linear_A' ensured");

    //----------------Linear_B----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS Linear_B(
            id INT AUTO_INCREMENT PRIMARY KEY,
            data float,
            index_i int,
            linear_id int,
            FOREIGN KEY (linear_id) REFERENCES LinearAlgebra(id)
            ON DELETE CASCADE
        )
    `);
    console.log("✅ Table 'Linear_B' ensured");
    
    //----------------Linear_X0----------------
    await conn.query(`
        CREATE TABLE IF NOT EXISTS Linear_X0(
            id INT AUTO_INCREMENT PRIMARY KEY,
            data float,
            index_i int,
            linear_id int,
            FOREIGN KEY (linear_id) REFERENCES LinearAlgebra(id)
            ON DELETE CASCADE
        )
    `);
    console.log("✅ Table 'Linear_X0' ensured");


  } catch(err) {
    console.error("❌ Cannot init MySQL or create table:", err.message);
  }
};

// กำหนด host และ port เริ่มต้น
const port = 8000

// --------------------------------GET------------------------------------

/**
 * @swagger
 * /Bisection:
 *  get:
 *      summary : Get Bisection old problems
 *      responses :
 *          200:
 *              description : Success get
 *          500:
 *              description : Error get
 */

// path = GET /Bisection
app.get('/Bisection' , async (req,res) =>{

    console.log('GET Bisection Complete')
    const results = await conn.query('SELECT * FROM root2x where method = "bisection"')
    res.json(results[0])
})

// path = GET /Graphical
app.get('/Graphical' , async (req,res) =>{
    console.log('GET Graphical Complete')
    const results = await conn.query('SELECT * FROM root2x where method = "graphical"')
    res.json(results[0])
})

// path = GET /FalsePosition
app.get('/FalsePosition' , async (req,res) =>{
    console.log('GET FalsePosition Complete')
    const results = await conn.query('SELECT * FROM root2x where method = "false"')
    res.json(results[0])
})

// path = GET /OnePoint
app.get('/OnePoint' , async (req,res) =>{
    console.log('GET OnePoint Complete')
    const results = await conn.query('SELECT * FROM root1x where method = "onepoint"')
    res.json(results[0])
})

// path = GET /NewtonRaphson
app.get('/NewtonRaphson' , async (req,res) =>{
    console.log('GET NewtonRaphson Complete')
    const results = await conn.query('SELECT * FROM root1x where method = "newton"')
    res.json(results[0])
})

// path = GET /Secant
app.get('/Secant' , async (req,res) =>{
    console.log('GET Secant Complete')
    const results = await conn.query('SELECT * FROM root2x where method = "secant"')
    res.json(results[0])
})

// path = GET /newtondivided
app.get('/newtondivided' , async (req,res) =>{
    console.log('GET newtondivided Complete')
    const results = await conn.query(`
        SELECT inter.id  , inter.x ,inter.n , p.point_index , p.xi , p.fx 
        FROM interpolations inter,interpolation_points p
        where inter.id = p.interpolation_id AND inter.method = 'newton'
        ORDER BY inter.id, p.point_index
    `);

    let id = -1;
    let x = 0;
    let n = 0;
    let NewResult = []
    let point = []
    for(const r of results[0]){
        if(id != r.id){
            id = r.id;
            x = r.x;
            n = r.n;
        }

        point.push({
            point_index : r.point_index,
            xi : r.xi,
            fx : r.fx
        })

        if(r.point_index == n-1){
            NewResult.push({
                id : r.id,
                x : r.x,
                n : r.n,
                point : point
            })
            point = []
        }
    }

    res.json(NewResult)
})

// path = GET /lagrange
app.get('/lagrange' , async (req,res) =>{
    console.log('GET lagrange Complete')
    const results = await conn.query(`
        SELECT inter.id  , inter.x ,inter.n , p.point_index , p.xi , p.fx 
        FROM interpolations inter,interpolation_points p
        where inter.id = p.interpolation_id AND inter.method = 'lagrange'
        ORDER BY inter.id, p.point_index
    `);

    let id = -1;
    let x = 0;
    let n = 0;
    let NewResult = []
    let point = []
    for(const r of results[0]){
        if(id != r.id){
            id = r.id;
            x = r.x;
            n = r.n;
        }

        point.push({
            point_index : r.point_index,
            xi : r.xi,
            fx : r.fx
        })

        if(r.point_index == n-1){
            NewResult.push({
                id : r.id,
                x : r.x,
                n : r.n,
                point : point
            })
            point = []
        }
    }

    res.json(NewResult)
})

// path = GET /spline
app.get('/spline' , async (req,res) =>{
    console.log('GET spline Complete')
    const results = await conn.query(`
        SELECT inter.id  , inter.x ,inter.n , p.point_index , p.xi , p.fx 
        FROM interpolations inter,interpolation_points p
        where inter.id = p.interpolation_id AND inter.method = 'spline'
        ORDER BY inter.id, p.point_index
    `);

    let id = -1;
    let x = 0;
    let n = 0;
    let NewResult = []
    let point = []
    for(const r of results[0]){
        if(id != r.id){
            id = r.id;
            x = r.x;
            n = r.n;
        }

        point.push({
            point_index : r.point_index,
            xi : r.xi,
            fx : r.fx
        })

        if(r.point_index == n-1){
            NewResult.push({
                id : r.id,
                x : r.x,
                n : r.n,
                point : point
            })
            point = []
        }
    }

    res.json(NewResult)
})

// path = GET /singletrape
app.get('/singletrape' , async (req,res) =>{
    console.log('GET singletrapezoidal Complete')
    const results = await conn.query('SELECT * FROM singleintegration where method = "trapezoidal"')
    res.json(results[0])
})

// path = GET /singlesimpson
app.get('/singlesimpson' , async (req,res) =>{
    console.log('GET singlesimpson Complete')
    const results = await conn.query('SELECT * FROM singleintegration where method = "simpson"')
    res.json(results[0])
})

// path = GET /compositetrape
app.get('/compositetrape' , async (req,res) =>{
    console.log('GET compositetrapezoidal Complete')
    const results = await conn.query('SELECT * FROM compositeintegration where method = "trapezoidal"')
    res.json(results[0])
})

// path = GET /composiesimpson
app.get('/compositesimpson' , async (req,res) =>{
    console.log('GET compositesimpson Complete')
    const results = await conn.query('SELECT * FROM compositeintegration where method = "simpson"')
    res.json(results[0])
})

// path = GET /cramer
app.get('/cramer' , async (req,res) =>{
    const results1 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , a.data , a.index_i , a.index_j
        FROM linearalgebra linears,linear_a a
        where linears.id = a.linear_id AND linears.method = 'cramer'
        ORDER BY linears.id, a.index_i , a.index_j
    `);
    const results2 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_b b
        where linears.id = b.linear_id AND linears.method = 'cramer'
        ORDER BY linears.id, b.index_i
    `);
    let NewResult = []
    let A = []
    let count = 0
    let c = 0
    let row = []
    for(const r of results1[0]){
        let n = r.n
        count++
        c++
        row.push(r.data)
        if(count === n){
            A.push(row)
            count = 0
            row = []
        }
        if(c === n*n){
            NewResult.push({
                id : r.id,
                n : r.n,
                error : r.error,
                A : A,
                B : []
            })
            c = 0
            A = []
        }
    }
    let B = []
    count = 0
    let k = 0
    for(const r of results2[0]){
        let n = r.n
        count++
        B.push(r.data)
        if(count === n){
            NewResult[k++].B = B
            count = 0
            B = []
        }
    }
    console.log('GET guassjordan Complete')
    res.json(NewResult)
})


// path = GET /guass
app.get('/guass' , async (req,res) =>{
    const results1 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , a.data , a.index_i , a.index_j
        FROM linearalgebra linears,linear_a a
        where linears.id = a.linear_id AND linears.method = 'guass'
        ORDER BY linears.id, a.index_i , a.index_j
    `);
    const results2 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_b b
        where linears.id = b.linear_id AND linears.method = 'guass'
        ORDER BY linears.id, b.index_i
    `);
    let NewResult = []
    let A = []
    let count = 0
    let c = 0
    let row = []
    for(const r of results1[0]){
        let n = r.n
        count++
        c++
        row.push(r.data)
        if(count === n){
            A.push(row)
            count = 0
            row = []
        }
        if(c === n*n){
            NewResult.push({
                id : r.id,
                n : r.n,
                error : r.error,
                A : A,
                B : []
            })
            c = 0
            A = []
        }
    }
    let B = []
    count = 0
    let k = 0
    for(const r of results2[0]){
        let n = r.n
        count++
        B.push(r.data)
        if(count === n){
            NewResult[k++].B = B
            count = 0
            B = []
        }
    }
    console.log('GET guassjordan Complete')
    res.json(NewResult)
})


// path = GET /guassjordan
app.get('/guassjordan' , async (req,res) =>{
    const results1 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , a.data , a.index_i , a.index_j
        FROM linearalgebra linears,linear_a a
        where linears.id = a.linear_id AND linears.method = 'guassjordan'
        ORDER BY linears.id, a.index_i , a.index_j
    `);
    const results2 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_b b
        where linears.id = b.linear_id AND linears.method = 'guassjordan'
        ORDER BY linears.id, b.index_i
    `);
    let NewResult = []
    let A = []
    let count = 0
    let c = 0
    let row = []
    for(const r of results1[0]){
        let n = r.n
        count++
        c++
        row.push(r.data)
        if(count === n){
            A.push(row)
            count = 0
            row = []
        }
        if(c === n*n){
            NewResult.push({
                id : r.id,
                n : r.n,
                error : r.error,
                A : A,
                B : []
            })
            c = 0
            A = []
        }
    }
    let B = []
    count = 0
    let k = 0
    for(const r of results2[0]){
        let n = r.n
        count++
        B.push(r.data)
        if(count === n){
            NewResult[k++].B = B
            count = 0
            B = []
        }
    }
    console.log('GET guassjordan Complete')
    res.json(NewResult)
})


// path = GET /invers
app.get('/invers' , async (req,res) =>{
    const results1 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , a.data , a.index_i , a.index_j
        FROM linearalgebra linears,linear_a a
        where linears.id = a.linear_id AND linears.method = 'invers'
        ORDER BY linears.id, a.index_i , a.index_j
    `);
    const results2 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_b b
        where linears.id = b.linear_id AND linears.method = 'invers'
        ORDER BY linears.id, b.index_i
    `);
    let NewResult = []
    let A = []
    let count = 0
    let c = 0
    let row = []
    for(const r of results1[0]){
        let n = r.n
        count++
        c++
        row.push(r.data)
        if(count === n){
            A.push(row)
            count = 0
            row = []
        }
        if(c === n*n){
            NewResult.push({
                id : r.id,
                n : r.n,
                error : r.error,
                A : A,
                B : []
            })
            c = 0
            A = []
        }
    }
    let B = []
    count = 0
    let k = 0
    for(const r of results2[0]){
        let n = r.n
        count++
        B.push(r.data)
        if(count === n){
            NewResult[k++].B = B
            count = 0
            B = []
        }
    }
    console.log('GET invers Complete')
    res.json(NewResult)
})


// path = GET /lu
app.get('/lu' , async (req,res) =>{
    const results1 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , a.data , a.index_i , a.index_j
        FROM linearalgebra linears,linear_a a
        where linears.id = a.linear_id AND linears.method = 'lu'
        ORDER BY linears.id, a.index_i , a.index_j
    `);
    const results2 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_b b
        where linears.id = b.linear_id AND linears.method = 'lu'
        ORDER BY linears.id, b.index_i
    `);
    let NewResult = []
    let A = []
    let count = 0
    let c = 0
    let row = []
    for(const r of results1[0]){
        let n = r.n
        count++
        c++
        row.push(r.data)
        if(count === n){
            A.push(row)
            count = 0
            row = []
        }
        if(c === n*n){
            NewResult.push({
                id : r.id,
                n : r.n,
                error : r.error,
                A : A,
                B : []
            })
            c = 0
            A = []
        }
    }
    let B = []
    count = 0
    let k = 0
    for(const r of results2[0]){
        let n = r.n
        count++
        B.push(r.data)
        if(count === n){
            NewResult[k++].B = B
            count = 0
            B = []
        }
    }
    console.log('GET lu Complete')
    res.json(NewResult)
})

// path = GET /cholesky
app.get('/cholesky' , async (req,res) =>{
    const results1 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , a.data , a.index_i , a.index_j
        FROM linearalgebra linears,linear_a a
        where linears.id = a.linear_id AND linears.method = 'cholesky'
        ORDER BY linears.id, a.index_i , a.index_j
    `);
    const results2 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_b b
        where linears.id = b.linear_id AND linears.method = 'cholesky'
        ORDER BY linears.id, b.index_i
    `);
    let NewResult = []
    let A = []
    let count = 0
    let c = 0
    let row = []
    for(const r of results1[0]){
        let n = r.n
        count++
        c++
        row.push(r.data)
        if(count === n){
            A.push(row)
            count = 0
            row = []
        }
        if(c === n*n){
            NewResult.push({
                id : r.id,
                n : r.n,
                error : r.error,
                A : A,
                B : []
            })
            c = 0
            A = []
        }
    }
    let B = []
    count = 0
    let k = 0
    for(const r of results2[0]){
        let n = r.n
        count++
        B.push(r.data)
        if(count === n){
            NewResult[k++].B = B
            count = 0
            B = []
        }
    }
    console.log('GET lu Complete')
    res.json(NewResult)
})

// path = GET /jacobi
app.get('/jacobi' , async (req,res) =>{
    const results1 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , a.data , a.index_i , a.index_j
        FROM linearalgebra linears,linear_a a
        where linears.id = a.linear_id AND linears.method = 'jacobi'
        ORDER BY linears.id, a.index_i , a.index_j
    `);
    const results2 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_b b
        where linears.id = b.linear_id AND linears.method = 'jacobi'
        ORDER BY linears.id, b.index_i
    `);
    const results3 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_x0 b
        where linears.id = b.linear_id AND linears.method = 'jacobi'
        ORDER BY linears.id, b.index_i
    `);
    let NewResult = []
    let A = []
    let count = 0
    let c = 0
    let row = []
    for(const r of results1[0]){
        let n = r.n
        count++
        c++
        row.push(r.data)
        if(count === n){
            A.push(row)
            count = 0
            row = []
        }
        if(c === n*n){
            NewResult.push({
                id : r.id,
                n : r.n,
                error : r.error,
                A : A,
                B : [],
                X0 : []
            })
            c = 0
            A = []
        }
    }
    let B = []
    count = 0
    let k = 0
    for(const r of results2[0]){
        let n = r.n
        count++
        B.push(r.data)
        if(count === n){
            NewResult[k++].B = B
            count = 0
            B = []
        }
    }
    let C = []
    count = 0
     k = 0
    for(const r of results3[0]){
        let n = r.n
        count++
        C.push(r.data)
        if(count === n){
            NewResult[k++].X0 = C
            count = 0
            C = []
        }
    }
    console.log('GET jacobi Complete')
    res.json(NewResult)
})

// path = GET /guassseidel
app.get('/guassseidel' , async (req,res) =>{
    const results1 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , a.data , a.index_i , a.index_j
        FROM linearalgebra linears,linear_a a
        where linears.id = a.linear_id AND linears.method = 'jacobi'
        ORDER BY linears.id, a.index_i , a.index_j
    `);
    const results2 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_b b
        where linears.id = b.linear_id AND linears.method = 'jacobi'
        ORDER BY linears.id, b.index_i
    `);
    const results3 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_x0 b
        where linears.id = b.linear_id AND linears.method = 'jacobi'
        ORDER BY linears.id, b.index_i
    `);
    let NewResult = []
    let A = []
    let count = 0
    let c = 0
    let row = []
    for(const r of results1[0]){
        let n = r.n
        count++
        c++
        row.push(r.data)
        if(count === n){
            A.push(row)
            count = 0
            row = []
        }
        if(c === n*n){
            NewResult.push({
                id : r.id,
                n : r.n,
                error : r.error,
                A : A,
                B : [],
                X0 : []
            })
            c = 0
            A = []
        }
    }
    let B = []
    count = 0
    let k = 0
    for(const r of results2[0]){
        let n = r.n
        count++
        B.push(r.data)
        if(count === n){
            NewResult[k++].B = B
            count = 0
            B = []
        }
    }
    let C = []
    count = 0
     k = 0
    for(const r of results3[0]){
        let n = r.n
        count++
        C.push(r.data)
        if(count === n){
            NewResult[k++].X0 = C
            count = 0
            C = []
        }
    }
    console.log('GET jacobi Complete')
    res.json(NewResult)
})


// path = GET /conjugate
app.get('/conjugate' , async (req,res) =>{
    const results1 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , a.data , a.index_i , a.index_j
        FROM linearalgebra linears,linear_a a
        where linears.id = a.linear_id AND linears.method = 'conjugate'
        ORDER BY linears.id, a.index_i , a.index_j
    `);
    const results2 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_b b
        where linears.id = b.linear_id AND linears.method = 'conjugate'
        ORDER BY linears.id, b.index_i
    `);
    const results3 = await conn.query(`
        SELECT linears.id   , linears.n , linears.error , b.data , b.index_i 
        FROM linearalgebra linears,linear_x0 b
        where linears.id = b.linear_id AND linears.method = 'conjugate'
        ORDER BY linears.id, b.index_i
    `);
    let NewResult = []
    let A = []
    let count = 0
    let c = 0
    let row = []
    for(const r of results1[0]){
        let n = r.n
        count++
        c++
        row.push(r.data)
        if(count === n){
            A.push(row)
            count = 0
            row = []
        }
        if(c === n*n){
            NewResult.push({
                id : r.id,
                n : r.n,
                error : r.error,
                A : A,
                B : [],
                X0 : []
            })
            c = 0
            A = []
        }
    }
    let B = []
    count = 0
    let k = 0
    for(const r of results2[0]){
        let n = r.n
        count++
        B.push(r.data)
        if(count === n){
            NewResult[k++].B = B
            count = 0
            B = []
        }
    }
    let C = []
    count = 0
     k = 0
    for(const r of results3[0]){
        let n = r.n
        count++
        C.push(r.data)
        if(count === n){
            NewResult[k++].X0 = C
            count = 0
            C = []
        }
    }
    console.log('GET conjugate Complete')
    res.json(NewResult)
})
        

// --------------------------POST----------------------------------


/**
 * @swagger
 * /root2x:
 *  post:
 *      summary : Push (graphical , bisection , falseposition , secant) to db
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          equation:
 *                              type : string
 *                          xr :
 *                              type : float
 *                          xl :
 *                              type : float
 *                          error :
 *                              type : float
 *                          method :
 *                              type : string
 *      responses : 
 *          200:
 *              description : Success post
 *          500:
 *              description : Error post
 */

// path = POST /root2x (graphical , bisection , false , secant) สำหรับการสร้าง Equation ใหม่บันทึกเข้าไป
app.post('/root2x' , async(req,res) =>{
    try{
        let data = req.body
            const results = await conn.query('INSERT INTO root2x SET ?', data)
            res.json({
                message : 'insert '+data.method+' ok',
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


// path = POST /root1x ( newtonraphson , onepoint ) สำหรับการสร้าง Equation ใหม่บันทึกเข้าไป
app.post('/root1x' , async(req,res) =>{
    try{
        let data = req.body
            const results = await conn.query('INSERT INTO root1x SET ?', data)
            res.json({
                message : 'insert '+data.method+' ok',
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
            method : data.method,
            n : data.n
        }
        const results = await conn.query('INSERT INTO interpolations SET ?', inter)
        res.json({
            message : 'insert interpolations ok',
            data : results[0]
        })
        for(let i=0;i<data.points.length;i++){
            let point = {
                interpolation_id : results[0].insertId,
                point_index : i,
                xi : data.points[i].xi,
                fx : data.points[i].fx
            }
            await conn.query('INSERT INTO interpolation_points SET ?', point)
        }
        res.json({
            message : 'insert interpolations_point ok',
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


// path = POST /singleintegration 
app.post('/singleintegration' , async(req,res) =>{
    try{
        let data = req.body
            const results = await conn.query('INSERT INTO singleintegration SET ?', data)
            res.json({
                message : 'insert singleintegration ok',
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


// path = POST /compositeintegration 
app.post('/compositeintegration' , async(req,res) =>{
    try{
        let data = req.body
            const results = await conn.query('INSERT INTO compositeintegration SET ?', data)
            res.json({
                message : 'insert compositeintegration ok',
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


// path = POST /linearAlgebra 
app.post('/linearAlgebra' , async(req,res) =>{
    try{
        let data = req.body
        let main = {
            n : data.n,
            error : data.error,
            method : data.method
        }
        const results = await conn.query('INSERT INTO linearalgebra SET ?', main)
        for(let i=0;i<data.A.length;i++){
            for(let j=0;j<data.A[i].length;j++){
                let A = {
                    data : data.A[i][j],
                    index_i : i,
                    index_j : j,
                    linear_id : results[0].insertId
                }
                await conn.query('INSERT INTO linear_a SET ?', A)
            }
            let B = {
                data : data.B[i],
                index_i : i,
                linear_id : results[0].insertId
            }
            await conn.query('INSERT INTO linear_b SET ?', B)
            if('X0' in data){
                let X0 = {
                    data : data.X0[i],
                    index_i : i,
                    linear_id : results[0].insertId
                }
                await conn.query('INSERT INTO linear_x0 SET ?', X0)
            }
        }
        res.json({
            message : 'insert linearalgebra ok',
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

const swaggerOptions = {
    definition : {
        openapi:'3.0.0',
        info:{
            title:'API Doc',
            version:'1.0.0',
            description:'api for numerical web document'
        },
        servers:[
            {
                url: 'http://localhost:8000',
            },
        ],
    },
    apis:['index.js'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))


// ทำการ run server
app.listen( port, async (req,res) => {
    await initMySQL()
    console.log('http server run at' + port)
})
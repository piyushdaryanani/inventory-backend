const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "ims"
});

con.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL connected!");

con.query('SHOW TABLES', (err, results) => {
    if (err) throw err;
    console.log('📌 Tables in ims:');
    console.log(results);
  });
});

module.exports = con;
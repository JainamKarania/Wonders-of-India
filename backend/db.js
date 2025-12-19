import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_mysql_password",
  database: "wonders_of_india",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Failed", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

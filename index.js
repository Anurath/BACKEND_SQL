const mysql = require("mysql2");
const { faker } = require('@faker-js/faker');
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require('method-override')

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ]
};

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "Anurath@123"
});


app.get("/", (req, res) => {
  let q = "SELECT count(id) FROM userData";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(id)"];
      res.render("home.ejs", { count });
    })
  } catch (err) {
    console.log(err);
    res.send("Some err on DB");
  }
})

app.get("/user", (req, res) => {
  let q = "SELECT * FROM userData";

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let data = result;
      res.render("users.ejs", { data });
    })
  } catch (err) {
    console.log(err);
    res.send("Some err on DB");
  }
})

//edit page

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM userData WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    })
  } catch (err) {
    console.log(err);
  }
})

//update patch
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM userData WHERE id='${id}'`;
  let { username: newUser, password: formPass, post_content :new_post_content } = req.body;
  try {
    connection.query(q, (err, result) => {
      let user = result[0];
      
      if (formPass != user.password) {
        console.log("WRONG PASSWORD");
      }
      else {
        let q2 = `UPDATE userData SET name = ${newUser} , content = ${new_post_content} WHERE id = ${id}`;
        connection.query(q2, (err, result) => {
          
          res.send(result);
        })
      }
    })
  } catch (err) {
    console.log(err);
  }
})



app.listen(port, () => {
  console.log(`Server working on port no. ${port}`);
})


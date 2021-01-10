const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./db");
const dbJson = require("./testDb");

const app = express();
const port = 3000

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/", (req, res) => {
    console.log("Requete");
    res.send("Page principale");
});

app.get("/users", (req, res) => {
    var name = 'test';
    var reply = [];
    connection.query("SELECT * FROM team;",(err, result) => {
        if(err) throw err;
        for(var i = 0; i < result.length; i++){
            var person = result[i];
            reply.push({name: person.name, role: person.role, avatar: person.avatar});
        }
        res.json(reply);
    });
});

app.get("/getNames", (req, res) => {
    var reply = [];
    connection.query("SELECT name FROM team;", (err, result) => {
        if(err) throw err;
        for(var i = 0; i < result.length; i++){
            var name = result[i];
            reply.push({name: name.name});
        }
        res.json(reply);
    })
});

app.post("/addUser", (req, res) => {
    var body = req.body;
    var name = body.name;
    var role = body.role;
    connection.query('INSERT INTO team(name, role, avatar) VALUES(?, ?, "img1.png");', [name, role], (err, result) => {
        if(err) errorSqlJson(res, result)
        res.json({
            success: true,
            name: name,
            role: role
        });
    })
});

app.post("/delUserByName", (req, res) => {
    var body = req.body;
    var name = body.name;
    connection.query(`DELETE FROM team WHERE name = ?` ,[name], (err, result) => {
        if(err) res.json({
            success: false,
            message: err.message
        })
        res.json({
            success: true,
            name: name,
        });
    })
});

app.post("/delUserByRole", (req, res) => {
    var body = req.body;
    var role = body.role;
    var name = undefined;
    if(body.role == undefined){
        errorSqlJson(res, new Error("No role specified"))
    } else {
        connection.query(`SELECT name FROM team WHERE role = ?`, [role], (err, result) => {
            if(err) errorSqlJson(res, err);
            name = result.name;
        });
        connection.query("DELETE FROM team WHERE role = ?", [role], (err, result) => {
            if(err) errorSqlJson(res, err);
            res.json({
                success: true,
                name: name,
                role: role
            })
        });
    }
});

app.post("/getNameByRole", (req, res) => {
    var body = req.body;
    var role = body.role;
    var name = undefined;
    if(body.role == undefined){
        errorSqlJson(res, new Error("No role specified"))
    } else {
        connection.query(`SELECT name FROM team WHERE role = ?`, [role], (err, result) => {
            if(err) errorSqlJson(res, err);
            console.log("Name : "+result.name);
            name = result.name;
            res.json({
                success: true,
                name: name
            });
        })
    }
})

app.get("/projects", (req, res) => {
    connection.query("SELECT * FROM projects;", (err, result) => {
        if(err) errorSqlJson(res, err);
        var reply = [];
        for(var i = 0; i < result.length; i++){
            var project = result[i];
            console.log(project.person);
            console.log(JSON.parse(project.person));
            reply.push({name: project.name, description: project.description, person: JSON.parse(project.person), status: project.status, date: project.date, id: project.id});
        }
        res.json(reply);
    });
});

app.post("/addProject", (req, res) => {
    console.log("start request add project post");
    var body = req.body;
    var name = body.name, status = body.status, person = body.person, date = body.date, description = body.description;
    var datas = [name, description, JSON.stringify(person), status, date];
    var nothingNull = true;
    if(name == undefined){errorSqlJson(res, "Name is missing");nothingNull = false;}
    else if (person == undefined){errorSqlJson(res, "Person are missing");nothingNull = false;}
    else if (date == undefined){errorSqlJson(res, "Date is missing");nothingNull = false;}
    else if (status == undefined){errorSqlJson(res, "Status is missing");nothingNull = false;}
    if(!nothingNull) return;
    console.log([person]);
    console.log(JSON.parse(person));
    connection.query("INSERT INTO projects(name, description, person, status, date) VALUES(?, ?, ?, ?, ?)", datas, (err, result) => {
        if(err) errorSqlJson(res, err);
        res.json({
            success: true,
        });
    })
});

app.get("/json", (req, res) => {
    dbJson.query("SELECT * FROM json", (err, result) => {
        if(err) throw err;
        var reply = [];
        for(var i = 0; i < result.length; i++){
            var data = result[i];
            var data_json = JSON.parse(data.name);
            console.log(data_json[1]);
            reply.push(data);
        }
        res.json(reply);
    });
});

app.post("/addJson", (req, res) => {
    dbJson.query("INSERT INTO json(name) VALUES (?)", [JSON.stringify(['Paul', 'Thomas', 'Laura'])], (err, result) => {
        if(err) errorSqlJson(res, err);
        res.json({
            success: true,
        })
    });
});

app.post("/testPost", (req, res) => {
    res.json({
        success: true,
    });
});

function errorSqlJson(res, err){
    res.json({
        success: false,
        message: typeof err == "string" ? err : err.message,
    })
}

app.listen(port, () => console.log("Serveur demarré sur le port "+port));

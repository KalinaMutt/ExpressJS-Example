require("dotenv").config();
const path = require("path");
const cors = require("cors");
const sql = require("mssql");

class Database {
  //Kalina---------------------------------------------------------------------------------------------
  config = {
    
  };

  poolconnection = null;
  connected = false;

  constructor() {
    console.log("Database config:  ${JSON.stringify(config)}");
  }
  async connect() {
    try {
      if (this.connected === false) {
        this.poolconnection = await sql.connect(this.config);
        this.connected = true;
      } else {
        console.log("already connected");
      }
      return "success";
    } catch (error) {
      return error;
    }
  }

  async disconnect() {
    try {
      this.poolconnection.close();
      console.log("connection closed");
    } catch (error) {
      console.error(error);
    }
  }

  async executeQuery(query) {
    var connectionstat = await this.connect();
    console.log(connectionstat);
    const request = this.poolconnection.request();
    const result = await request.query(query);
    return result.rowsAffected[0];
  }
  async createuser(data) {
    var connectionstat = await this.connect();
    console.log(connectionstat);
    const request = this.poolconnection.request();
    request.input("id", sql.Int, data.id);
    request.input("firstName", sql.NVarChar(255), data.firstName);
    request.input("lastName", sql.NVarChar(255), data.lastName);
    request.input("password", sql.Int, data.password);
    request.input("organisation", sql.Int, data.organisation);
    request.input("status", sql.TinyInt, data.status);
    request.input("inoffice", sql.TinyInt, data.inoffice);
    request.input("lat", sql.Float, data.lat);
    request.input("long", sql.Float, data.long);
    request.input("admin", sql.TinyInt, data.admin);

    const result = await request.query(
      "INSERT INTO Person (id,firstname,lastname,password,organisation,status,inoffice,lat,long,admin) VALUES (@id,@firstName,@lastName,@password,@organisation,@status,@inoffice,@lat,@long,@admin)"
    );
    return result.rowsAffected[0];
  }

  async personAll() {
    var connectionstat = await this.connect();
    console.log(connectionstat);
    const request = this.poolconnection.request();
    const result = await request.query("SELECT * FROM person");

    return result.recordset;
  }
  async readPerson(id) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    const result = await request
      .input("id", sql.Int, id)
      .query("SELECT * FROM Person where id=@id");

    return result.recordset[0];
  }
  async updatePerson(id, data) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();

    request.input("id", sql.Int, id);
    request.input("firstName", sql.VarChar(255), data.firstName);
    request.input("lastName", sql.VarChar(255), data.lastName);

    const result = await request.query(
      "UPDATE Person set firstName=@firstName,lastName=@lastName WHERE id=@id"
    );

    return result.rowsAffected[0];
  }

  async deletePerson(id) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const idAsNumber = Number(id);
    const request = this.poolconnection.request();
    const result = await request
      .input("id", sql.Int, idAsNumber)
      .query("Delete from person where id=@id");

    return result.rowsAffected[0];
  }

  async pushcoord(id, lat, long) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    request.input("id", sql.Int, id);
    request.input("lat", sql.Float, lat);
    request.input("long", sql.Float, long);
    const result = await request.query(
      "UPDATE person SET lat=@lat ,long=@long WHERE id=@id"
    );

    return result.rowsAffected[0];
  }

  async officechange(id, inoffice) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    request.input("id", sql.Int, id);
    request.input("inoffice", sql.TinyInt, inoffice);
    const result = await request.query(
      "UPDATE person SET inoffice=@inoffice WHERE id=@id"
    );

    return result.rowsAffected[0];
  }

  async statuschange(id, status) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    request.input("id", sql.Int, id);
    request.input("status", sql.TinyInt, status);
    const result = await request.query(
      "UPDATE person SET status=@status WHERE id=@id"
    );

    return result.rowsAffected[0];
  }

  async verifylogin(firstName, lastName, password, organisation) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    request.input("firstname", sql.VarChar(255), firstName);
    request.input("lastname", sql.VarChar(255), lastName);
    request.input("password", sql.Int, password);
    request.input("organisation", sql.Int, organisation);

    const result = await request.query(
      "SELECT id,admin,password FROM person WHERE firstname=@firstname AND lastname=@lastname AND password=@password AND organisation=@organisation"
    );
    return result.recordset[0];
  }

  async createtask(data) {
    var connectionstat = await this.connect();
    console.log(connectionstat);
    const request = this.poolconnection.request();
    request.input("id", sql.Int, data.id);
    request.input("title", sql.NVarChar(255), data.title);
    request.input("description", sql.NVarChar(500), data.description);
    request.input("category", sql.NVarChar(30), data.category);
    request.input("startdate", sql.Date, data.date);
    request.input("duration", sql.Int, data.duration);
    request.input("organisation", sql.Int, data.organisation);
    request.input("complete", sql.TinyInt, 0);

    const result = await request.query(
      "INSERT INTO tasks (id,title,description,category,startdate,duration,organisation,complete) VALUES (@id,@title,@description,@category,@startdate,@duration,@organisation,@complete)"
    );
    return result.rowsAffected[0];
  }

  async taskAll() {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    const result = await request.query("SELECT * FROM tasks");

    return result.recordset;
  }
  async taskcat(category) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    request.input("category", sql.NVarChar(30), category);
    const result = await request.query(
      "SELECT * FROM tasks WHERE category=@category AND complete=0"
    );

    return result.recordset;
  }

  async taskcomplete(id) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    request.input("id", sql.Int, id);
    const result = await request.query(
      "UPDATE tasks SET complete=1 WHERE id=@id"
    );

    return result.rowsAffected[0];
  }

  async timereset(id, date) {
    var connectionstat = await this.connect();
    console.log(connectionstat);
    const request = this.poolconnection.request();
    request.input("id", sql.Int, id);
    request.input("startdate", sql.Date, date);
    const result = await request.query(
      "UPDATE tasks SET startdate=@startdate WHERE id=@id"
    );

    return result.rowsAffected[0];
  }

  async durationreset(id, duration) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    request.input("id", sql.Int, id);
    request.input("duration", sql.Int, duration);
    const result = await request.query(
      "UPDATE tasks SET duration=@duration WHERE id=@id"
    );

    return result.rowsAffected[0];
  }

  async notesclear(id) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    request.input("id", sql.Int, id);
    const result = await request.query("DELETE FROM notes WHERE task=@id");

    return result.rowsAffected[0];
  }

  async newnote(note) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();

    const maxid = await request.query("SELECT MAX(id) AS id FROM notes");
    request.input("description", sql.NVarChar(500), note.description);
    request.input("task", sql.Int, note.task);
    request.input("id", sql.Int, maxid.recordset[0].id + 1);
    const result = await request.query(
      "Insert into notes (id,task,description) VALUES (@id,@task,@description)"
    );

    return result.rowsAffected[0];
  }
  async notesAll(id) {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    request.input("task", sql.Int, id);
    const result = await request.query("SELECT * FROM notes WHERE task=@task");
    return result.recordset;
  }

  async createtable() {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    const result = await request.query(
      "CREATE table person (id int,firstname VARCHAR(255), lastname VARCHAR(255),password int, organisation int,status TINYINT, inoffice TINYINT,lat float, long float, admin TINYINT  PRIMARY KEY (id)) "
    );
    return result.rowsAffected[0];
  }
  async droptable() {
    var connectionstat = await this.connect();
    console.log(connectionstat);

    const request = this.poolconnection.request();
    const result = await request.query("DROP TABLE IPS");

    return result.rowsAffected[0];
  }
  //Kalina-------------------------------------------------------------------------------------------------------------------------------

//Admin Side Database:
//Create Task Function - Alex
async addTask(data) {
  var connectionstat = await this.connect();
  console.log(connectionstat);
  const request = this.poolconnection.request();
  request.input("id", sql.Int, data.id);
  request.input("title", sql.NVarChar(255), data.title);
  request.input("description", sql.NVarChar(500), data.description);
  request.input("category", sql.NVarChar(30), data.category);
  request.input("startdate", sql.Date, data.date);
  request.input("duration", sql.Int, data.duration);
  request.input("organisation", sql.Int, data.organisation);
  request.input("complete", sql.TinyInt, 0);
  const result = await request.query(
    "INSERT INTO tasks (id,title,description,category,startdate,duration,organisation,complete) VALUES (@id,@title,@description,@category,@startdate,@duration,@organisation,@complete)"
  );
  return result.rowsAffected[0];
}

//Get Task Function - Alex
async getTasks() {
  var connectionstat = await this.connect();
  console.log(connectionstat);
  const request = this.poolconnection.request();
  const result = await request
    .query("SELECT * FROM tasks WHERE complete=0");

  return result.recordset;
}

//Get Completed Tasks Function - Alex
async getCompletedTasks() {
  var connectionstat = await this.connect();
  console.log(connectionstat);
  const request = this.poolconnection.request();
  const result = await request
    .query("SELECT * FROM tasks WHERE complete=1");

  return result.recordset;
}

//Create Employee Function - Alex
async addEmployee(data) {
  var connectionstat = await this.connect();
  console.log(connectionstat);
  const request = this.poolconnection.request();
  request.input("id", sql.Int, data.id);
  request.input("firstname", sql.NVarChar(255), data.firstName);
  request.input("lastname", sql.NVarChar(255), data.lastName);
  request.input("password", sql.Int, data.password);
  request.input("organisation", sql.Int, data.organisation);
  request.input("admin", sql.TinyInt, data.admin);
  const result = await request.query(
    "INSERT INTO person (id, firstname, lastname, password, organisation, admin) VALUES (@id, @firstname, @lastname, @password, @organisation, @admin)"
  );
  return result.rowsAffected[0];
}

//Get Employee ID + Name for all employees Function - Alex
async getEmployeeInfo() {
  var connectionstat = await this.connect();
  console.log(connectionstat);

  const request = this.poolconnection.request();
  const result = await request
    .query("SELECT id, firstname, lastname FROM person");

    console.log(result.recordset);
  return result.recordset;
}

//Get all information for a specific employee using id - Alex
async getSpecificEmployeeInfo(employeeID) {
  var connectionstat = await this.connect();
  console.log(connectionstat);
  const request = this.poolconnection.request();
  const result = await request
    .query("SELECT * FROM person WHERE id =" + employeeID);

  return result.recordset;
}

//Delete employee by id - Alex
async deleteEmployee(id) {
  var connectionstat = await this.connect();
  console.log(connectionstat);

  const employeeID = Number(id);
  const request = this.poolconnection.request();
  const result = await request
    .input("id", sql.Int, employeeID)
    .query("DELETE FROM person WHERE id=@id");

  return result.rowsAffected[0];
}

//Delete task by id - Alex
async deleteTask(id) {
  var connectionstat = await this.connect();
  console.log(connectionstat);

  const taskID = Number(id);
  const request = this.poolconnection.request();
  const result = await request
    .input("id", sql.Int, taskID)
    .query("DELETE FROM tasks WHERE id=@id");

  return result.rowsAffected[0];
}

}
//Kalina-----------------------------------------------------------------------------------
let connector = new Database();

const express = require("express");

const app = express();
app.use(cors());

PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("hello from the server");
});


app.post("/person", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    var user = await datachunk(chunks);
    records = await connector.readPerson(user.id);
    res.send(records);
  });


});
app.post("/updatecoord", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    parse = await datachunk(chunks);
    let resul = await connector.pushcoord(parse.id, parse.lat, parse.long);
    res.send(200);
  });
});


app.post("/login", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    let using = await datachunk(chunks);

    let user = await connector.verifylogin(
      using.firstName,
      using.lastName,
      using.password,
      using.organisation
    );
    res.send(user);
  });
});


app.post("/tasks", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    let cat = await datachunk(chunks);

    let tasks = await connector.taskcat(cat);
    res.send(tasks);
  });
});


app.post("/newnote", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    let note = await datachunk(chunks);

    let result = await connector.newnote(note);
    res.send(200);
  });
});


app.post("/notes", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    let id = await datachunk(chunks);

    let result = await connector.notesAll(id.id);
    res.send(result);
  });
});


app.post("/completetask", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    let id = await datachunk(chunks);

    let result = await connector.taskcomplete(id.id);
    res.send({ result: result });
  });
});


app.post("/officechange", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    let id = await datachunk(chunks);

    let result = await connector.officechange(id.id, id.inoffice);
    res.send({ result: result });
  });
});


app.post("/statuschange", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    let id = await datachunk(chunks);

    let result = await connector.statuschange(id.id, id.status);
    res.send({ result: result });
  });
});


app.post("/timereset", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    let id = await datachunk(chunks);
    let result = await connector.timereset(id.id, new Date(id.date));
    let result2 = await connector.notesclear(id.id);
    res.send({ result: result });
  });
});

app.listen(PORT, () => {
  console.log("server listening on " + PORT);
});


async function datachunk(chunks) {
  data = Buffer.concat(chunks);
  const stringData = data.toString();
  const parse = JSON.parse(stringData);
  data = parse;
  return data;
}
//Kalina-----------------------------------------------------------------------------------

// API Calls for Admin Side Database
//Post call for new tasks - Alex
app.post("/tasks", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    let data = await datachunk(chunks);
    records = await connector.addTask(data);
    res.send(records);
  });
});

//Get call for active tasks - Alex
app.get("/tasks", async (req, res) => {
  records = await connector.getTasks();
  res.send(records);
});

//Get call for completed tasks - Alex
app.get("/tasks/completed", async (req, res) => {
  records = await connector.getCompletedTasks();
  res.send(records);
});

// Post call for new employees - Alex
app.post("/employees", async (req, res) => {
  let chunks = [];
  req.on("data", async (chunk) => {
    chunks.push(chunk);
  });
  req.on("end", async () => {
    let data = await datachunk(chunks);
    records = await connector.addEmployee(data);
    res.send(records);
  });
});

//Get call for employee ID + Name info - Alex
app.get("/employees", async (req, res) => {
    let records = await connector.getEmployeeInfo();
    res.send(records);
});

//Get call for all information for single employee - Alex
app.get("/employees/:id", async (req, res) => {
  const employeeID = req.params.id;
  records = await connector.getSpecificEmployeeInfo(employeeID);
  res.send(records);
});

//Delete call for employee by id - Alex
app.delete("/employees/:id", async (req, res) => {
  const employeeID = req.params.id;
  records = await connector.deleteEmployee(employeeID);
  res.send(records);
});

//Delete call for tasks by id - Alex
app.delete("/tasks/:id", async (req, res) => {
  const taskID = req.params.id;
  records = await connector.deleteTask(taskID);
  res.send(records);
});
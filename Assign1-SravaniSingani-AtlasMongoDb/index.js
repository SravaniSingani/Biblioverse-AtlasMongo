const express = require("express"); //include express in this app
// const { request } = require("http");
const path = require("path"); //module to help with file paths
const {MongoClient, ObjectId} = require("mongodb"); //import mongoclient from mongodb
const { request } = require("http");
const dotenv = require("dotenv");

dotenv.config(); //load local environment variables from .env file

// const dbUrl = "mongodb://127.0.0.1:27017/bookdb";
// connectString = mongodb+srv://<username>:<password>@cluster0.okbxtx1.mongodb.net/
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/`;
const client = new MongoClient(dbUrl);

const app = express(); // create an express app
const port = process.env.PORT || "8888"; 


//Set up template engine
app.set("views", path.join(__dirname, "views")) //first "views" is the view of the app and second "views" is the directory name
app.set("view engine", "pug");


//set up a path for static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
//app.use(express.static(path.join(__dirname, "public"),{'Content-Type': 'text/javascript'}));


//Set up soem page routes
app.get("/",async(request,response) => {
 let links = await getbookLinks();
 response.render("index", {title: "Home", book:links});
 
 // console.log(links);
}
);

// edited now
app.get("/biblio/books", async (request, response) => {
    let links = await getbookLinks();
    response.render("books", { title: "Biblio products", book: links });
});

app.get("/biblio/about", async (request, response) => {
    let links = await getbookLinks();
    response.render("about", { title: "Biblio about", book: links });
});

app.get("/biblio/contact", async (request, response) => {
    let links = await getbookLinks();
    response.render("contact", { title: "Biblio reviews", book: links });
});

app.get("/biblio/contact/add", async(request, response) => {
    let links = await getbookLinks();
    response.render("contact", { title: "Add a review", book:links});
   
});

app.post("/biblio/contact/submit", async(request, response)=>{
    let name = request.body.name;

    let email = request.body.email;
    let rate = request.body.rate;
    let feedback = request.body.feedback;
    let newReview = {
        "name" : name,
        "email" : email,
        "rate" : rate,
        "feedback" : feedback
    };
    await addReview(newReview);
    response.redirect("/biblio/contact"); //redirect back to contact
})


app.listen(port,() => {
    console.log(`Listening on http://localhost:${port}`);
});


//mongodb functions
async function connection(){
    db = client.db("bookdb");
    return db;
}

//Funtion to select all data in the booklinks function
async function getbookLinks(){
    db = await connection();
    let results = db.collection("bookLinks").find({});
    let res = await results.toArray();
    return res;
}

async function addReview(reviewData){
    db = await connection();
    let status = await db.collection("bookLinks").insertOne(reviewData);
    console.log("review added");
}




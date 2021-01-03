var express = require('express');
var bodyParser = require('body-parser');
var sqlDAO = require('./sqlDAO');
var mongoDAO = require('./mongoDAO');
var ejs = require('ejs');
const { body, validationResult, check } = require('express-validator/check');

var app = express();

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('home')
})
// ________________________COUNTRIES____________________________
//Countries
app.get('/listCountries', (req, res) => {
    sqlDAO.getCountries()
        .then((result) => {
            console.log(result)
            res.render('listCountries', { countries: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get('/addCountry', (req, res) => {
    res.render("addCountry", { errors: undefined, co_code: "", co_name: "", co_details: "" })
})

//Add Country
//express validation for adding country, validates if country code exists in database, if all OK then addCountry to database
app.post('/addCountry',
    [check('co_code')
        .custom(async co_code => { //custom validator
            var value
            if (co_code.length == 3) {// if the co_code length is 3 then continue
                value = await checkID(co_code); // checks if the co_code is in use, and stores response in value
                console.log(value)
                if (value) { // if the value is true, then continue... Throws the error that country exists in database
                    throw new Error("Error: " + co_code + " already exists ")
                } else { return true }// Indicates the success of this synchronous custom validator
            } else { return true }
        }),
    check('co_code').isLength({ min: 3, max: 3 }).withMessage("Country Code must be 3 characters"),// Validator with simple error message
    check('co_name').isLength({ min: 3 }).withMessage("Country Name must be at least 3 characters"),
    ],
    (req, res) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("addCountry", { errors: errors.errors, co_code: req.body.co_code, co_name: req.body.co_name, co_details: req.body.co_details })
        } else { // If no errors are present, add all values to database and rederict back to /listCountries page
            sqlDAO.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
                .then((result) => {
                    res.redirect('/listCountries');
                })
                .catch((error) => {// if any errors send it to a new page... if any new error I get I will come back to fix what I missed
                    res.send(error)
                })
        }
    })



//Delete a country
app.get('/delete/:co_code', (req, res) => {//delete the country from the co_code in the url
    sqlDAO.deleteCountry(req.params.co_code)
        .then((result) => {
            res.redirect("/listCountries")
        })
        .catch((error) => {
            res.send('<h1>ERROR MESSAGE </h1> <br><br> <h2>' + req.params.co_code + ' has cities, it cannot be deleted </h2>')// if the country has cities, then it cannot be deleted
        })
})

//editing country
app.get('/editCountry/:co_code', (req, res) => {//Edit country, takes the co_code in its url
    var code = req.params.co_code
    sqlDAO.getCountries()//getting all the countries from MySQL Database
        .then((result) => {
            result.forEach(country => {// iterate through countries, for each country 
                if (code == country.co_code) {// check if the country code from databse matches the code from the url
                    res.render("editCountry", { errors: undefined, co_code: code, co_name: country.co_name, co_details: country.co_details })
                }
            })
        })
        .catch((error) => {//catch error here and log 
            console.log(error)
        })
})
// updating country details 
app.post('/editCountry/:co_code',
    [check('co_code').custom((value, { req }) => {//Added custom validation to make sure the country code is not changed, and cannot be changed
        if (value !== req.params.co_code) {
            console.log(req.params.co_code)
            throw new Error("Country Code cannot change value")
        } else { return true }// if the co_code is the same then exit validation
    }),
    check('co_name').isLength({ min: 3 }).withMessage("Country Name must be at least 3 characters")
    ], (req, res) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {// if errors exist then display error messages to ejs 
            res.render("editCountry", { errors: errors.errors, co_code: req.params.co_code, co_name: req.body.co_name, co_details: req.body.co_details })
        } else {// if no errors exist, append details to database and redirect back to countries list ejs 
            sqlDAO.updateCountry(req.body.co_code, req.body.co_name, req.body.co_details)
                .then((result) => {
                    res.redirect('/listCountries');
                })
                .catch((error) => {// catch errors here 
                    res.send(error)
                })
        }
    })

// ________________________CITIES_____________________________
// Cities
app.get('/listCities', (req, res) => {
    sqlDAO.getCities()
        .then((result) => {
            res.render('listCities', { cities: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//Delete a City (Innovation)
app.get('/deleteCity/:cty_code', (req, res) => {
    sqlDAO.deleteCity(req.params.cty_code)
        .then((result) => {
            res.redirect("/listCities")
        })
        .then((error) => {
            res.send(error)
        })
})

//All Details GET method 
app.get('/allDetails/:cty_code', (req, res) => {
    var cityCode = req.params.cty_code
    sqlDAO.getCities()
        .then((result) => {
            result.forEach(async city => {
                if (cityCode == city.cty_code) {
                    // get the Country Name value to store in country name field in ejs
                    var country = await getCountryName(city.co_code)

                    res.render("allDetails", {// Renders all the values from Cities table in mySQL Database, to the input fields
                        errors: undefined, cty_code: req.params.cty_code, cty_name: city.cty_name,
                        population: city.population, isCoastal: city.isCoastal, areaKM: city.areaKM, co_code: city.co_code, co_name: country
                    })
                }
            })
        })
        .catch((error) => {
            res.send(error)
        })
})

//function to get the name of the country in countries table in MySQL
function getCountryName(code) {
    return new Promise((resolve, reject) => {
        sqlDAO.getCountries()
            .then((result) => {
                result.forEach(country => {
                    if (code == country.co_code) {
                        return resolve(country.co_name)
                    }
                })
            })
            .catch((error) => {
                return reject(error)
            })
    })
}

//Post method to update city details to MySQL database (Innovation)
app.post('/updateCity/:cty_code',
[
    check('cty_code').custom((value, {req}) => {
        if(value !== req.params.cty_code) {
            throw new Error("City Code cannot change value")
        } else { return true}
    }),
    check('cty_code').isLength({ min: 3, max: 3 }).withMessage("City Code must be 3 Characters"),
    check("cty_name").isLength({ min: 3 }).withMessage("City Name must be at least 3 characters"),
    check('population').not().isEmpty().withMessage("Population cannot be empty"),
    check('isCoastal').trim().isBoolean().withMessage("Must be a boolean true or false"),
    check('areaKM').not().isEmpty().withMessage("Area (KM) cannot be empty ")
], (req,res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("allDetails", {
            errors: errors.errors, cty_code: req.params.cty_code, co_code: req.body.co_code
            , cty_name: req.body.cty_name, population: req.body.population, isCoastal: req.body.isCoastal,
            areaKM: req.body.areaKM, co_name: req.body.co_name
        })
    }else {
        sqlDAO.updateCity(req.body.cty_code, req.body.co_code, req.body.cty_name, req.body.population, req.body.isCoastal, req.body.areaKM)
            .then((result) => {
                res.redirect('/listCities');
            })
            .catch((error) => {
                res.send(error)
            })
    }
})

// Get method to render addCity ejs page. (Innovation)
app.get('/addCity', (req, res) => {
    res.render("addCity", {
        errors: undefined, cty_code: req.body.cty_code, co_code: req.body.co_code
        , cty_name: req.body.cty_name, population: req.body.population, isCoastal: req.body.isCoastal,
        areaKM: req.body.areaKM
    })
})

//Post method to add the city to MySQL database. (Innovation)
app.post('/addCity',
    [check('co_code').custom(async co_code => {//custom validator to check if country code exists in MySQL database
        var value;
        if (co_code.length == 3) {
            value = await checkID(co_code);
            if (value) {
                return true;
            } else { throw new Error("Cannot add Country " + co_code + " as this country is not in MySQL database") }
        }
    }),
    check('cty_code').custom(async cty_code => {// custom validator to check if city_code exists in MySQL database
        var value;
        if(cty_code.length == 3){
            value = await checkCity(cty_code);
            if(value) {
                throw new Error("Cannot add City "+ cty_code+" as this city is is already in MySQL database ")
            } else { return true }
        }
    }),
    check('co_code').isLength({ min: 3, max: 3 }).withMessage("Country Code must be 3 characters"), 
    check('cty_code').isLength({ min: 3, max: 3 }).withMessage("City Code must be 3 Characters"),// validation for cty_code
    check("cty_name").isLength({ min: 3 }).withMessage("City Name must be at least 3 characters"),
    check('population').not().isEmpty().withMessage("Population cannot be empty"),
    check('isCoastal').trim().isBoolean().withMessage("Must be a boolean true or false"),
    check('areaKM').not().isEmpty().withMessage("Area (KM) cannot be empty ")
    ],

    (req, res) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("addCity", {
                errors: errors.errors, cty_code: req.body.cty_code, co_code: req.body.co_code
                , cty_name: req.body.cty_name, population: req.body.population, isCoastal: req.body.isCoastal,
                areaKM: req.body.areaKM
            })
        } else {
            sqlDAO.addCity(req.body.cty_code, req.body.co_code, req.body.cty_name, req.body.population,
                req.body.isCoastal, req.body.areaKM)
                .then((result) => {
                    res.redirect('listCities');
                })
                .catch((error) => {
                    res.send(error)
                })
        }
    })

//Function to check if city code exists in city table in MySQL
function checkCity(cty_code){
    return new Promise((resolve, reject) => {
        sqlDAO.getCities()
            .then((result) => {
                result.forEach(city => {
                    if (cty_code == city.cty_code) {
                        return resolve(true);
                    }
                })
                return resolve(false)
            })
            .catch((error) => {
                return reject(error)
            })
    })
}

// ________________________HEADS OF STATE______________________
//Heads of state GET method 
app.get('/listHeads', (req, res) => {
    mongoDAO.getHeadsOfState()
        .then((documents) => {
            res.render('listHeads', { hOs: documents })
        })
        .catch((error) => {
            res.send(error)
        })
})
//Add Heads GET Method 
app.get('/addHeads', (req, res) => {
    res.render("addheads", { errors: undefined, _id: "", headOfState: "" })
})
//Add Heads POST method 
app.post('/addHeads',
    [check('_id').custom(async _id => {
        var value
        if (_id.length == 3) {
            value = await checkID(_id);
            console.log(value)
            if (value) {
                return true;
            } else { throw new Error("Cannot add Head of State " + _id + " as this country is not in MySQL database") }
        } else { return true }
    }),
    check('headOfState').isLength({ min: 3 }).withMessage("Head of State must be at least 3 characters"),
    check('_id').isLength({ min: 3, max: 3 }).withMessage("Country Code must be 3 characters")
    ],
    (req, res) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("addHeads", { errors: errors.errors, _id: req.body._id, headOfState: req.body.headOfState })// renders errors to ejs 
        } else {// if no errors are present, then continue to add heads of state to database
            mongoDAO.addHeadsOfState(req.body._id, req.body.headOfState)
                .then((result) => {
                    res.redirect("/listHeads")
                })
                .catch((error) => {
                    if (error.code = 11000) {// if error code is 11000, means that Country code already exists in mongodb database 
                        res.send("<h1>Error: " + req.body._id + " already exists in MongoDB database")
                    }
                })
        }
    })

// delete Head of State, (Innovation)
app.get('/deleteHead/:_id', (req, res) => {
    mongoDAO.deleteHeadOfState(req.params._id)
        .then((result) => {
            res.redirect("/listHeads")
        })
        .catch((error) => {
            res.send(error)
        })
})
//update head of state details (Innovation)
app.get('/updateHead/:_id', (req, res) => {
    var id = req.params._id
    mongoDAO.getHeadsOfState()
        .then((result) => {
            result.forEach(head => {
                if (id == head._id) {
                    res.render("updateHead", {
                        errors: undefined, _id: id,
                        headOfState: head.headOfState
                    })
                }
            })
        })
        .catch((error) => {
            console.log(error)
        })
})

//Post method to update head of state details. (Innovation)
app.post('/updateHead/:_id',
    [check('_id').custom((value, { req }) => {// custom validator to check if country code is the same 
        if (value !== req.params._id) {
            throw new Error("Country Code cannot change value")
        } else { return true }
    }),
    check('headOfState').isLength({ min: 3 }).withMessage("Head of State must be at least 3 characters")
    ], (req, res) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("updateHead", { errors: errors.errors, _id: req.params._id, headOfState: req.body.headOfState })//render errors
        } else {// if no errors detected then update new details to mongodb database
            mongoDAO.updateHead(req.body._id, req.body.headOfState)
                .then((result) => {
                    res.redirect('/listHeads');
                })
                .catch((error) => {
                    res.send(error)
                })
        }
    })

//function to check if the id exists in mysql database
function checkID(id) {
    return new Promise((resolve, reject) => {
        sqlDAO.getCountries()
            .then((result) => {
                result.forEach(country => {
                    if (id == country.co_code) {
                        return resolve(true);
                    }
                })
                return resolve(false)
            })
            .catch((error) => {
                return reject(error)
            })
    })
}

//____________________________________________
app.listen(3004, () => {
    console.log("Listening on port 3004");
})
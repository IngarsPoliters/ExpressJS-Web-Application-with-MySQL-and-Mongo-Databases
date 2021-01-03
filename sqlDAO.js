var mysql = require('promise-mysql');
var pool;

mysql.createPool({
    connectionLimit: 4,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'geography'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error);
    });

var getCountries = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from country')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var addCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        pool.query('insert into country VALUES("' + co_code + '","' + co_name + '","' + co_details + '")')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var deleteCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from country where co_code = ?',
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var deleteCity = function (cty_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql:'DELETE FROM city WHERE cty_code = ?',
            values: [cty_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var updateCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        //query 
        var myQuery = {
            sql: 'update country SET co_name="'+ co_name +'", co_details="'+co_details+'" WHERE co_code = ?',
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var getCities = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from city')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var addCity = function (cty_code, co_code, cty_name, population, isCoastal, areaKM) {
    return new Promise((resolve, reject) => {
        pool.query('insert into city VALUES("' + cty_code + '","' + co_code + '","' + cty_name 
            + '","' +population + '","'+isCoastal + '","'+areaKM +'")')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var updateCity = function (cty_code, co_code, cty_name, population, isCoastal, areaKM) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'UPDATE city SET cty_code="'+ cty_code+'", cty_name="'+cty_name+
                '", population="'+population+'", isCoastal="'+isCoastal+'", areaKM="'+areaKM+'" WHERE cty_code = ?',
            values: [cty_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


module.exports = { getCountries, addCountry, deleteCountry, updateCountry, getCities, deleteCity, addCity, updateCity}
/*!
* Start Bootstrap - Shop Homepage v5.0.5 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

function getWeather() {
    fetch('weatherforecast/GetWeatherForecast')
        .then(response => response.json())
        .then(data => printToConsole(data))
        .catch(error => console.error('Unable to get items', error));
}

function printToConsole(data) {
    data.forEach(item => {
        console.log(item.date);
    });
}


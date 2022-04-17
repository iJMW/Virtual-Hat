/*!
* Start Bootstrap - Shop Homepage v5.0.5 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

let user = JSON.parse(sessionStorage.getItem("user"));

class User{
    constructor(username, password, email, firstName, lastName){
        this.Username = username;
        this.User_Password = password;
        this.Email = email;
        this.First_Name = firstName;
        this.Last_Name = lastName;
    }
}

let merchandise = JSON.parse(sessionStorage.getItem("merchandise"));

class Merchandise {
    constructor(merchandiseId, merchandiseName, price, dateAdded, brand, displayActive) {
        this.Merchandise_Id = merchandiseId;
        this.Merchandise_Name = merchandiseName;
        this.Price = price;
        this.Date_Added = dateAdded;
        this.Brand = brand;
        this.Display_Active = displayActive;
    }
}

let cart = JSON.parse(sessionStorage.getItem("cart"));

class Order {
    constructor(orderId, dateOrdered, total, address, placedBy, merchandiseId, displayActive) {
        this.Order_Id = orderId;
        this.Date_Ordered = dateOrdered;
        this.Total = total;
        this.Address = address;
        this.Placed_By = placedBy;
        this.Merchandise_Id = merchandiseId;
        this.Display_Active = displayActive;
    }
}

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

function GetUser() {
    console.log("Inside GetUser");

    let user = new User(document.getElementById("loginUsername").value, document.getElementById("loginPassword").value, "", "", "");

    fetch('UserManagement/GetUser', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
    })
    .then(response => {
        if (response.status === 200) {
            response.json().then(data => {
                let verifiedUser = data;
                console.log(JSON.stringify(verifiedUser));
                sessionStorage.setItem("user", JSON.stringify(verifiedUser));
                window.location.href = "../homepage.html";
            });
            // window.location.href = "../homepage.html";
        } else {
            alert("Incorrect Credentials");
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function AddUser() {

    let user = new User(document.getElementById("signupUsername").value, document.getElementById("signupPassword").value, document.getElementById("signupEmail").value, document.getElementById("signupFirstName").value, document.getElementById("signupLastName").value);
            
   // Call the AddUser function in UserManagementController
    fetch('UserManagement/AddUser', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
    })
    .catch(error => console.error('Error: ', error));

}

function GetMerchandise() {
    console.log("Inside GetMerchandise");

    // merchandise = new User(document.getElementById("loginUsername").value, document.getElementById("loginPassword").value, "", "", "");

    fetch('Merchandise/GetMerchandise')
        .then(response => {
            response.json().then(data => {
                merchandise = new Merchandise(data.merchandise_Id, data.merchandise_Name, data.price, data.date_Added, data.brand, data.display_Active);
            }).then(() => {
                PopulateHomePage();
            });
        })
        .catch(error => {
            console.log(error);
        });

}

function AddMerchandise() {

}

function PopulateHomePage() {

    /*
        <div id="ProductClick" onclick="GoToDetailedItemPage()">
            <!-- Product image-->
            <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
            <!-- Product details-->
            <div class="card-body p-4">
                <div class="text-center">
                    <!-- Product name-->
                    <h5 class="fw-bolder">Fancy Product</h5>
                    <!-- Product price-->
                    $40.00 - $80.00
                </div>
            </div>
        </div>
     */

    console.log(merchandise);

    // Set the number of items in the user's cart
    if (cart == null) {
        cart = [];
    }
    document.getElementById("cartSize").textContent = cart.length;

    // Get the first product div
    let div = document.getElementById("product1");

    let mainDiv = document.createElement("div");
    mainDiv.id = merchandise.Merchandise_Id;
    mainDiv.addEventListener("click", function () {
        GoToDetailedItemPage(merchandise);
    });

    let image = document.createElement("img");
    image.className = "card-img-top";
    image.src = "../img/" + merchandise.Merchandise_Id + ".png";
    image.alt = "Comically Large Hat";

    let detailsDiv = document.createElement("div");
    detailsDiv.classList.add("card-body", "p-4");

    let centerDiv = document.createElement("div");
    centerDiv.className = "text-center";


    let productTitle = document.createElement("h5");
    productTitle.className = "fw-bolder";
    productTitle.textContent = merchandise.Merchandise_Name;

    let price = document.createTextNode("$ " + merchandise.Price);

    centerDiv.appendChild(productTitle);
    centerDiv.appendChild(price);
    detailsDiv.appendChild(centerDiv);
    mainDiv.appendChild(image);
    mainDiv.appendChild(detailsDiv);

    div.insertBefore(mainDiv, div.children[0]);

}

function GoToDetailedItemPage(merchandiseSelected) {

    sessionStorage.setItem("merchandise", JSON.stringify(merchandiseSelected));
    sessionStorage.setItem("user", JSON.stringify(user));

    window.location.href = "../shopitem.html";

}

function populateDetails() {
    // Set the number of items in the user's cart
    if (cart == null) {
        cart = [];
    }
    document.getElementById("cartSize").textContent = cart.length;
    console.log(cart.length);
    document.getElementById("image").src = "../img/" + merchandise.Merchandise_Id + "_Large.png";
    document.getElementById("name").textContent = merchandise.Merchandise_Name;
    document.getElementById("price").textContent = "$ " + merchandise.Price;
    document.getElementById("description").textContent = "Big hat for BIG dudes"
}

function GoToCheckout() {
    // Store the user
    sessionStorage.setItem("user", JSON.stringify(user));
    // Store the cart in the session storage
    sessionStorage.setItem("cart", JSON.stringify(cart));
    // Navigate to the checkout page
    window.location.href = "../checkout.html";
}

function populateCheckout() {

    // Set the number of items in the user's cart
    if (cart == null) {
        cart = [];
    }
    document.getElementById("cartSize").textContent = cart.length;
    console.log(cart.length);

    // Will store the total price
    let total = 0.0;

    // Get the unordered list
    let checkoutList = document.getElementById("checkoutList");

    // Iterate over each item in the cart
    for (let i = 0; i < cart.length; i++) {

        // Create a list item tag
        let listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-condensed");

        // Create a div
        let nameDescDiv = document.createElement("div");

        // Create a header for the product name
        let productTitle = document.createElement("h6");
        productTitle.className = "my-0";
        productTitle.textContent = cart[i].Merchandise_Name;

        // Create a small tag for the description of the product
        let description = document.createElement("small");
        description.className = "text-muted";
        description.textContent = "Brief Description"

        // Create a span for the price
        let price = document.createElement("span");
        price.className = "text-muted";
        price.textContent= "$ " + cart[i].Price;

        // Append all the items
        nameDescDiv.appendChild(productTitle);
        nameDescDiv.appendChild(description);
        listItem.appendChild(nameDescDiv);
        listItem.appendChild(price);
        checkoutList.appendChild(listItem);

        // Update the total
        total += parseFloat(cart[i].Price);

    }

    // Add the total value
    let listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "d-flex", "justify-content-between");

    // Create a span for the currency
    let currency = document.createElement("span");
    currency.textContent = "Total (USD)";

    // Create a strong tag for the totalAmt
    let totalAmt = document.createElement("strong");
    totalAmt.textContent = "$ " + total;

    // Set the values of shipping information based on user account
    document.getElementById("firstName").value = user.first_Name;
    document.getElementById("lastName").value = user.last_Name;
    document.getElementById("username").value = user.username;
    document.getElementById("email").value = user.email;


    // Append the total
    listItem.appendChild(currency);
    listItem.appendChild(totalAmt);
    checkoutList.appendChild(listItem);
}

function addItemToCart() {
    // Add the current merchandise to the cart
    if (cart == null) {
        cart = [];
    }
    // Get the quantity to be added to the cart
    let quantity = document.getElementById("quantity").value;
    // Add the entered quantity of merchandise to the cart
    for (let i = 0; i < quantity; i++) {
        cart.push(merchandise);
        // Print that the item was added to the cart
        console.log("Item was added to cart!");
    }
    // Store the cart in the session storage
    sessionStorage.setItem("cart", JSON.stringify(cart));
    // Update the cart size
    document.getElementById("cartSize").textContent = cart.length;
    console.log(cart.length);
}

function addOrder() {

    // Create the address string entered by the user
    let address = document.getElementById("address").value.trim() + " "
        + document.getElementById("state").value.trim() + " "
        + document.getElementById("country").value.trim() + " "
        + document.getElementById("zip").value.trim();

    // Stores the current date AKA the date the order was placed
    let dateOrdered = new Date();

    // Iterate over each element in the cart
    for (let i = 0; i < cart.length; i++) {

        // Create a new order for each item in the cart
        let order = new Order(0, dateOrdered, cart[i].Price, address, user.username, cart[i].Merchandise_Id, "Y");

        // Call the AddOrder function in OrdersController
        fetch('Orders/AddOrder', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order),
        })
        .catch(error => console.error('Error: ', error));

    }

    // Store the cart in the session storage; empty the cart
    sessionStorage.setItem("cart", JSON.stringify([]));


    // Navigate the user back to the homepage
    sessionStorage.setItem("user", JSON.stringify(user));
    window.location.href = "../homepage.html";

}

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    document.querySelector("#continueButton").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        // Perform your AJAX/Fetch login

        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});

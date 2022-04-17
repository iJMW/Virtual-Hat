/*!
* Start Bootstrap - Shop Homepage v5.0.5 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

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
            });
            window.location.href = "../homepage.html";
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
            var itemarr = [];
            response.json().then(data => {
                //alert("Number of items found is: " + data.length);
                console.log(data);
                //passing data directly here... can probably be moved
                PopulateHomePage(data);

                //merchandise = new Merchandise(data[0].merchandise_Id, data[0].merchandise_Name, data[0].price, data[0].date_Added, data[0].brand, data[0].display_Active);
            }).then(() => {
                
            });
        })
        .catch(error => {
            console.log(error);
        });

}

function AddMerchandise() {

}

function PopulateHomePage(arr) {

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
    //checking input array
    console.log(arr);
    //main div on page
    let itemdiv = document.getElementById("items");

    
    //for each obj in array
    for (var i = 0; i < arr.length; i++) {

        //curent var for tracking item number
        let current = i + 1;
        //create merchandise object for current index
        merchandise = new Merchandise(arr[i].merchandise_Id, arr[i].merchandise_Name, arr[i].price, arr[i].brand, arr[i].displayActive);
        // Get the first product div
        let div = document.getElementById("product" + current);

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
}

function GoToDetailedItemPage(merchandiseSelected) {

    sessionStorage.setItem("merchandise", JSON.stringify(merchandiseSelected));

    window.location.href = "../shopitem.html";

}

function populateDetails() {
    document.getElementById("image").src = "../img/" + merchandise.Merchandise_Id + "_Large.png";
    document.getElementById("name").textContent = merchandise.Merchandise_Name;
    document.getElementById("price").textContent = "$ " + merchandise.Price;
    document.getElementById("description").textContent = "Big hat for BIG dudes"
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

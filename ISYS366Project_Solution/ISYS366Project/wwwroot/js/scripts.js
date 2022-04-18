/*!
* Start Bootstrap - Shop Homepage v5.0.5 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

let user = JSON.parse(sessionStorage.getItem("user"));

class User{
    constructor(username, password, email, firstName, lastName, isAdmin){
        this.Username = username;
        this.User_Password = password;
        this.Email = email;
        this.First_Name = firstName;
        this.Last_Name = lastName;
        this.isAdmin = isAdmin;
    }
}

class Merchandise {
    constructor(merchandiseId, merchandiseName, price, dateAdded, brand, displayActive) {
        this.Merchandise_Id = merchandiseId;
        this.Merchandise_Name = merchandiseName;
        this.Price = price;
        this.Date_Added = dateAdded;
        this.Brand = brand;
        this.Display_Active = displayActive;
    }

    toString() {
        return "Id: " + this.Merchandise_Id + "\n Name: " + this.Merchandise_Name
            + "\n Price: " + this.Price + "\n Brand: " + this.Brand + "\n Date: " + this.Date_Added;
    }
}

//Uses variable page to determine which page to redirect
//If the user is not an admin, it will not do anything
function changeLocation(page) {
    if (user.isAdmin === 'y') {
        if (page === 'order') {
            window.location.href = "order_management.html";
        } else if (page === 'merchandise') {
            window.location.href = "merchandise_management.html";
        } else if (page === 'user') {
            window.location.href = "user_management.html";
        } else {
            window.location.href = "homepage.html";
        }
    }
}

//#region Merchandise Management Screen Functions
var merchandiseList = [];
function GetAllMerchandise() {
    if (user.isAdmin !== 'y') {
        document.getElementById("adminFunctions").style.display = "none";
    } else {
        fetch('Merchandise/GetAllMerchandise')
            .then(response => {
                response.json().then(data => {
                    data.forEach(item => {
                        //Add a merchanise object using the item's data
                        merchandiseList.push(new Merchandise(item.merchandise_Id, item.merchandise_Name, item.price, item.date_Added, item.brand, item.display_Active));
                    });
                }).then(() => {
                    //Populate the merchandise management table
                    PopulateMerchandiseManagementTable();
                });
            })
            .catch(error => {
                //Display the error to the console
                console.log(error);
            });
    }
}

var currentMerchandise;
function PopulateMerchandiseManagementTable() {
    // Set the number of items in the user's cart
    if (cart == null) {
        cart = [];
    }
    document.getElementById("cartSize").textContent = cart.length;

    //Get the table for populating
    let table = document.getElementById("merchandiseTable");
    merchandiseList.forEach(merchandiseItem => {
        //Create the row
        let newRow = document.createElement("tr");
        //Add the classes
        newRow.classList.add("bg-light", "text-black");

        //Create the name column
        let merchandiseName = document.createElement("td");
        merchandiseName.innerText = merchandiseItem.Merchandise_Name;

        //Append it
        newRow.appendChild(merchandiseName);

        //Create the price column
        let price = document.createElement("td");
        price.innerText = "$" + merchandiseItem.Price;
        //Append it
        newRow.appendChild(price);

        //Create the date column
        let dateAdded = document.createElement("td");
        dateAdded.innerText = merchandiseItem.Date_Added;
        //Append it
        newRow.appendChild(dateAdded);

        //Create the brand column
        let brand = document.createElement("td");
        brand.innerText = merchandiseItem.Brand;
        //Append it
        newRow.appendChild(brand);

        //Create the active column
        let active = document.createElement("td");
        active.innerText = merchandiseItem.Display_Active;
        //Append it
        newRow.appendChild(active);

        //Add a edit button column
        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.className = "button-green";
        editButton.addEventListener("click", () => {
            currentMerchandise = new Merchandise(merchandiseItem.Merchandise_Id, merchandiseItem.Merchandise_Name, merchandiseItem.Price, merchandiseItem.Date_Added, merchandiseItem.Brand, merchandiseItem.Display_Active);
            console.log(currentMerchandise.toString());
            //Set modal form to be viewable
            modal.style.display = "block";
            //Populate modal form with merchandiseItem data
            let nameInput = document.getElementById("editMerchandiseName");
            let priceInput = document.getElementById("editMerchandisePrice");
            let brandInput = document.getElementById("editMerchandiseBrand");
            let activeInput = document.getElementById("editActiveInd");

            nameInput.value = merchandiseItem.Merchandise_Name;
            priceInput.value = merchandiseItem.Price;
            brandInput.value = merchandiseItem.Brand;
            if (merchandiseItem.Display_Active.toLowerCase() === 'y') {
                activeInput.checked = true;
            } else {
                activeInput.checked = false;
            }
        });
        //Append the button to the row
        newRow.appendChild(editButton);
        
        //Add delete button column
        if (merchandiseItem.Display_Active === 'y') {
            let deleteButton = document.createElement("button");
            deleteButton.innerText = "Deactivate";
            deleteButton.className = "button-red";
            deleteButton.addEventListener("click", () => {
                currentMerchandise = merchandiseItem;

                //Set modal form to be viewable
                deleteModal.style.display = "block";
            });
            //Append the button to the row
            newRow.appendChild(deleteButton);
        } else {
            let reactivateButton = document.createElement("button");
            reactivateButton.innerText = "Reactivate";
            reactivateButton.className = "bg-primary";
            reactivateButton.addEventListener("click", () => {
                currentMerchandise = merchandiseItem;

                //Set modal to be visible
                reactivateModal.style.display = "block";
            });

            //Append the row
            newRow.appendChild(reactivateButton);
        }
        

        //Append the row to the table
        table.appendChild(newRow);
    });
}

//Saves the details edited in the dialog box and using the current merchandise
function saveEdit() {
    //Get the id of the current merchandise
    //Use the values in the boxes to update the values for that id (create new object of type merchandise to pass into POST)
    var toSaveMerchandise = new Merchandise(currentMerchandise.Merchandise_Id, document.getElementById("editMerchandiseName").value, document.getElementById("editMerchandisePrice").value, currentMerchandise.Date_Added, document.getElementById("editMerchandiseBrand").value, currentMerchandise.Display_Active);

    //Perform the POST using the toSaveMerchandise
    fetch('Merchandise/SaveEditMerchandise', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSaveMerchandise),
    })
        .then(response => {
            if (response.status === 200) {
                alert("Item updated successfully");
                location.reload();
            } else {
                alert("An error occurred trying to save");
            }
        })
        .catch(error => {
            console.log(error);
        });

    //Close the modal after a success or error message
    modal.style.display = "none";
}

//Close the modal on cancel
function cancelEditModal() {
    modal.style.display = "none";
}

//Sets the merchandiseItem to 'n'
function deactivateMerchandise() {
    //Get the id of the current merchandise
    //Use the values in the boxes to update the values for that id (create new object of type merchandise to pass into POST)
    var toSaveMerchandise = new Merchandise(currentMerchandise.Merchandise_Id, currentMerchandise.Merchandise_Name, currentMerchandise.Price, currentMerchandise.Date_Added, currentMerchandise.Brand, "n");

    //Perform the POST using the toSaveMerchandise
    fetch('Merchandise/SaveDeactivateMerchandise', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSaveMerchandise),
    })
        .then(response => {
            if (response.status === 200) {
                alert("Item updated successfully");
                location.reload();
            } else {
                alert("An error occurred trying to save.");
            }
        })
        .catch(error => {
            console.log(error);
        });

    //Close the modal after a success or error message
    deleteModal.style.display = "none";
}

//Close the modal on cancel
function cancelDeactivateModal() {
    deleteModal.style.display = "none";
}

//Sets the merchandiseItem to 'y'
function reactivateMerchandise() {
    //Get the id of the current merchandise
    //Use the values in the boxes to update the values for that id (create new object of type merchandise to pass into POST)
    var toSaveMerchandise = new Merchandise(currentMerchandise.Merchandise_Id, currentMerchandise.Merchandise_Name, currentMerchandise.Price, currentMerchandise.Date_Added, currentMerchandise.Brand, "y");

    //Perform the POST using the toSaveMerchandise
    fetch('Merchandise/SaveDeactivateMerchandise', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSaveMerchandise),
    })
        .then(response => {
            if (response.status === 200) {
                alert("Item updated successfully");
                location.reload();
            } else {
                alert("An error occurred trying to save.");
            }
        })
        .catch(error => {
            console.log(error);
        });

    //Close the modal after a success or error message
    reactivateModal.style.display = "none";
}

function cancelReactivateModal() {
    reactivateModal.style.display = "none";
}

//Open the new modal
function openNewItemModal() {
    newMerchandiseModal.style.display = "block";
    document.getElementById("merchandiseName").value = "";
    document.getElementById("merchandisePrice").value = "";
    document.getElementById("merchandiseBrand").value = "";
    document.getElementById("activeInd").value = "";
    document.getElementById("itemImg").value = "";
}

//Saves a new item to the database
function saveNew() {
    //For whatever reason, 1 has to be here even though it will not be that value when inserted
    var toSaveNewMerchandise = new Merchandise("1", document.getElementById("merchandiseName").value, document.getElementById("merchandisePrice").value, new Date(0), document.getElementById("merchandiseBrand").value, document.getElementById("activeInd").value);

    if (!document.getElementById("merchandiseName").value || !document.getElementById("merchandisePrice").value
        || !document.getElementById("merchandiseBrand").value || !document.getElementById("activeInd").value
        || !document.getElementById("itemImg").value) {
        alert("Please populate all of the fields");
    } else {
        //Perform the POST using the toSaveMerchandise
        fetch('Merchandise/SaveNewMerchandise', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toSaveNewMerchandise),
        })
            .then(response => {
                if (response.status === 200) {
                    var itemImage = document.getElementById("itemImg").files[0];
                    var formData = new FormData();
                    formData.append("itemImage", itemImage);
                    response.json().then(data => {
                        returnedMerchandise = new Merchandise(data.merchandise_Id, data.merchandise_Name, data.price, data.date_Added, data.brand, data.display_Active);
                        formData.append("id", returnedMerchandise.Merchandise_Id);
                        fetch('Merchandise/UploadImage', {
                            method: 'POST',
                            body: formData
                        });
                    }).then(() => {
                        alert("Item updated successfully");
                        location.reload();
                    });
                } else {
                    alert("An error occurred trying to save");
                }
            })
            .catch(error => {
                console.log(error);
            });

        newMerchandiseModal.style.display = "none";
    }
}

//Close the new merchandise modal
function cancelNewModal() {
    newMerchandiseModal.style.display = "none";
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
//#endregion Merchandise Management Screen Functions


//#region User Management Screen Functions

var userList = [];
function GetAllUsers() {
    if (user.isAdmin !== 'y') {
        document.getElementById("adminFunctions").style.display = "none";
    } else {
        fetch('UserManagement/GetAllUsers')
            .then(response => {
                response.json().then(data => {
                    data.forEach(item => {
                        //Add a merchanise object using the item's data
                        userList.push(new User(item.username, "", item.email, item.first_Name, item.last_Name, item.isAdmin));
                    });
                }).then(() => {
                    //Populate the merchandise management table
                    PopulateUserManagementTable();
                });
            })
            .catch(error => {
                //Display the error to the console
                console.log(error);
            });
    }
    
}

var currentUser;
function PopulateUserManagementTable() {
    // Set the number of items in the user's cart
    if (cart == null) {
        cart = [];
    }
    document.getElementById("cartSize").textContent = cart.length;

    //Get the table for populating
    let table = document.getElementById("userTable");
    userList.forEach(userItem => {
        //Create the row
        let newRow = document.createElement("tr");
        //Add the classes
        newRow.classList.add("bg-light", "text-black");

        //Create the name column
        let username = document.createElement("td");
        username.innerText = userItem.Username;

        //Append it
        newRow.appendChild(username);

        //Create the price column
        let email = document.createElement("td");
        email.innerText = userItem.Email;
        //Append it
        newRow.appendChild(email);

        //Create the date column
        let firstName = document.createElement("td");
        firstName.innerText = userItem.First_Name;
        //Append it
        newRow.appendChild(firstName);

        //Create the brand column
        let lastName = document.createElement("td");
        lastName.innerText = userItem.Last_Name;
        //Append it
        newRow.appendChild(lastName);

        //Create the active column
        let admin = document.createElement("td");
        admin.innerText = userItem.isAdmin;
        //Append it
        newRow.appendChild(admin);

        //Add a edit button column
        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.className = "button-green";
        editButton.addEventListener("click", () => {
            currentUser = new User(userItem.Username, "", userItem.Email, userItem.First_Name, userItem.Last_Name, userItem.isAdmin);
            //Set modal form to be viewable
            editUserModal.style.display = "block";
            //Populate modal form with merchandiseItem data
            let usernameInput = document.getElementById("username");
            let emailInput = document.getElementById("userEmail");
            let firstNameInput = document.getElementById("userFirstName");
            let lastNameInput = document.getElementById("userLastName");
            let isAdminInput = document.getElementById("isAdmin");

            usernameInput.value = userItem.Username;
            emailInput.value = userItem.Email;
            firstNameInput.value = userItem.First_Name;
            lastNameInput.value = userItem.Last_Name;

            if (userItem.isAdmin.toLowerCase() === 'y') {
                isAdminInput.checked = true;
            } else {
                isAdminInput.checked = false;
            }
        });
        //Append the button to the row
        newRow.appendChild(editButton);

        if (userItem.isAdmin.toLowerCase() !== 'y') {
            let deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.className = "button-red";
            deleteButton.addEventListener("click", () => {
                currentUser = new User(userItem.Username, "", userItem.Email, userItem.First_Name, userItem.Last_Name, userItem.isAdmin);;

                //Set modal form to be viewable
                deleteUserModal.style.display = "block";
            });

            //Append the button to the row
            newRow.appendChild(deleteButton);

            let makeAdminButton = document.createElement("button");
            makeAdminButton.innerText = "Make Admin";
            makeAdminButton.className = "bg-primary";
            makeAdminButton.addEventListener("click", () => {
                currentUser = userItem;

                //Set make admin modal to be viewable
                makeAdminModal.style.display = "block";
            });

            //Append the button
            newRow.appendChild(makeAdminButton);
        }

        //Append the row to the table
        table.appendChild(newRow);
    });
}

//Save user edit
function saveUserEdit() {
    //Get the id of the current merchandise
    //Use the values in the boxes to update the values for that id (create new object of type merchandise to pass into POST)
    var toSaveUser = new User(currentUser.Username, "", document.getElementById("userEmail").value, document.getElementById("userFirstName").value, document.getElementById("userLastName").value, currentUser.isAdmin);

    if (!document.getElementById("userEmail").value || !document.getElementById("userFirstName").value
        || !document.getElementById("userLastName").value) {
        alert("Please populate all fields");
    } else {
        //Perform the POST using the toSaveMerchandise
        fetch('UserManagement/SaveEditUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toSaveUser),
        })
            .then(response => {
                if (response.status === 200) {
                    alert("Item updated successfully");
                    location.reload();
                } else {
                    alert("An error occurred trying to save");
                }
            })
            .catch(error => {
                console.log(error);
            });

        //Close the modal after a success or error message
        editUserModal.style.display = "none";
    }

    
}

//Reset data and cancel user edit
function cancelUserEdit() {
    document.getElementById("username") = "";
    document.getElementById("userEmail") = "";
    document.getElementById("userFirstName") = "";
    document.getElementById("userLastName") = "";
    document.getElementById("isAdmin").checked = false;
    editUserModal.style.display = "none";
}

function deleteUser() {
    var toDeleteUser = new User(currentUser.Username, currentUser.User_Password, currentUser.Email, currentUser.First_Name, currentUser.Last_Name, currentUser.isAdmin);

    //Perform the POST using the toSaveMerchandise
    fetch('UserManagement/DeleteUser', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toDeleteUser),
    })
        .then(response => {
            if (response.status === 200) {
                alert("Item removed successfully");
                location.reload();
            } else {
                alert("An error occurred trying to remove user");
            }
        })
        .catch(error => {
            console.log(error);
        });

    //Close the modal after a success or error message
    deleteUserModal.style.display = "none";
}

function cancelUser() {
    deleteUserModal.style.display = "none";
}

function makeAdmin() {
    var toMakeAdminUser = new User(currentUser.Username, currentUser.User_Password, currentUser.Email, currentUser.First_Name, currentUser.Last_Name, "y");

    //Perform the POST using the toSaveMerchandise
    fetch('UserManagement/MakeAdmin', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toMakeAdminUser),
    })
        .then(response => {
            if (response.status === 200) {
                alert("User made admin successfully");
                location.reload();
            } else {
                alert("An error occurred trying to make user admin");
            }
        })
        .catch(error => {
            console.log(error);
        });

    //Close the modal after a success or error message
    deleteUserModal.style.display = "none";
}

function cancelAdmin() {
    makeAdminModal.style.display = "none";
}
//#endregion User Management Screen Functions

function GetUser() {
    console.log("Inside GetUser");

    let user = new User(document.getElementById("loginUsername").value, document.getElementById("loginPassword").value, "", "", "", "");

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
        } else {
            alert("Incorrect Credentials");
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function AddUser() {

    let user = new User(document.getElementById("signupUsername").value, document.getElementById("signupPassword").value, document.getElementById("signupEmail").value, document.getElementById("signupFirstName").value, document.getElementById("signupLastName").value, "n");
            
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

//#region Homepage Screen Functions


let merchandise = JSON.parse(sessionStorage.getItem("merchandise"));
var activeMerchandise = [];
function GetMerchandise() {
    if (user.isAdmin !== 'y') {
        document.getElementById("adminFunctions").style.display = "none";
    }

    fetch('Merchandise/GetActiveMerchandise')
        .then(response => {
            response.json().then(data => {
                data.forEach(item => {
                    //Add a merchanise object using the item's data
                    activeMerchandise.push(new Merchandise(item.merchandise_Id, item.merchandise_Name, item.price, item.date_Added, item.brand, item.display_Active));
                });
            }).then(() => {
                //Populate the merchandise management table
                PopulateHomePage();
            });
            
        })
        .catch(error => {
            //Display the error to the console
            console.log(error);
        });

}

function PopulateHomePage() {
    //Get the div for the display of all products
    let allProducts = document.getElementById("allProductsForSelection");

    activeMerchandise.forEach(item => {
        //Initialize merchandise item
        toPopulateMerchandise = new Merchandise(item.Merchandise_Id, item.Merchandise_Name, item.Price, item.Date_Added, item.Brand, item.Display_Active);
        //Get the container for the specific product
        let productContainer = document.createElement("div");
        productContainer.classList.add("col", "mb-5");

        //Create the div that contains the product info
        let productInfo = document.createElement("div");
        productInfo.classList.add("card", "h-100");
        productInfo.id = "product" + toPopulateMerchandise.Merchandise_Id;

        //Display the details in a card and open up details when it is clicked
        let productDetails = document.createElement("div");
        productDetails.id = toPopulateMerchandise.Merchandise_Id;
        productDetails.addEventListener("click", function () {
            GoToDetailedItemPage(item);
        });

        //Display an image for the item inside the card
        let image = document.createElement("img");
        image.className = "card-img-top";
        image.src = "../img/" + toPopulateMerchandise.Merchandise_Id + ".png";
        image.alt = "Image of " + toPopulateMerchandise.Merchandise_Name;

        //Container for the details div
        let detailsDiv = document.createElement("div");
        detailsDiv.classList.add("card-body", "p-4");

    // Set the number of items in the user's cart
    if (cart == null) {
        cart = [];
    }
    document.getElementById("cartSize").textContent = cart.length;
      
        //Containers to center the information
        let centerDiv = document.createElement("div");
        centerDiv.className = "text-center";

        //Contains the product title
        let productTitle = document.createElement("h5");
        productTitle.className = "fw-bolder";
        productTitle.textContent = toPopulateMerchandise.Merchandise_Name;

        //Price to be added to the center div after the product title
        let price = document.createTextNode("$ " + toPopulateMerchandise.Price);

        //Add to cart functionality
        let cartFunction = document.createElement("div");
        cartFunction.classList.add("card-footer", "p-4", "pt-0", "border-top-0", "bg-transparent");

        let cartDivButton = document.createElement("div");
        cartDivButton.className = "text-center";

        let cartLink = document.createElement("a");
        cartLink.classList.add("btn", "btn-outline-dark", "mt-auto");
        cartLink.href = "#";
        cartLink.textContent = "Add to Cart";
        cartLink.addEventListener("click", () => {
            merchandise = item;
            addItemToCart();
        });

        cartDivButton.appendChild(cartLink);
        cartFunction.appendChild(cartDivButton);

        //Build the div structure by appending items
        centerDiv.appendChild(productTitle);
        centerDiv.appendChild(price);

        detailsDiv.appendChild(centerDiv);

        productDetails.appendChild(image);
        productDetails.appendChild(detailsDiv);

        productInfo.appendChild(productDetails);
        productInfo.appendChild(cartFunction);

        productContainer.appendChild(productInfo);

        //Append the item details to the page
        allProducts.appendChild(productContainer);
    });
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
    console.log(merchandise);

    document.getElementById("image").src = "../img/" + merchandise.Merchandise_Id + "_Large.png";
    document.getElementById("name").textContent = merchandise.Merchandise_Name;
    document.getElementById("price").textContent = "$ " + merchandise.Price;
    document.getElementById("description").textContent = "Description goes here";
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

    let quantity;
    // Get the quantity to be added to the cart
    if (document.getElementById("quantity")) {
        quantity = document.getElementById("quantity").value;
    } else {
        quantity = 1;
    }
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
//#endregion Homepage Screen Functions

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

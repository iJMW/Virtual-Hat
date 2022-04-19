var deleteModal = document.getElementById("deleteOrderModal");
var spanNewClose = document.getElementById("closeIndicatorNew");
var spanDelete = document.getElementById("closeIndicatorDelete");
spanDelete.onclick = function () {
    deleteModal.style.display = "none";
}


/* Copied from w3schools https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal */
var editModal = document.getElementById("editMerchandiseModal");
var span = document.getElementById("closeIndicator");

span.onclick = function () {
    editModal.style.display = "none";
}

// Stores the receipt list
let receiptList = [];
let currentReceipt;

// Gets all the receipts
function GetReceipts() {
    if (user.isAdmin !== 'y') {
        document.getElementById("adminFunctions").style.display = "none";
        window.location.href = "homepage.html";
    } else {
        fetch('Orders/GetReceipts')
            .then(response => {
                response.json().then(data => {
                    receiptList = data;
                    PopulateOrdersPage();
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
}

// Populates the table with all the receipts
function PopulateOrdersPage() {
    // Set the number of items in the user's cart
    if (cart == null) {
        cart = [];
    }
    document.getElementById("cartSize").textContent = cart.length;
    //Get the table for populating
    let table = document.getElementById("ordersTable");
    // Iterate over each receipt
    receiptList.forEach(receipt => {

        //Create the row
        let newRow = document.createElement("tr");
        //Add the classes
        newRow.classList.add("bg-light", "text-black");

        //Create the date order column
        let dateOrdered = document.createElement("td");
        dateOrdered.innerText = receipt.date_ordered;
        //Append it
        newRow.appendChild(dateOrdered);

        //Create the placed by column
        let placed_by = document.createElement("td");
        placed_by.innerText = receipt.placed_by;
        //Append it
        newRow.appendChild(placed_by);

        //Create the shipping address column
        let shipping_address = document.createElement("td");
        shipping_address.innerText = receipt.address;
        //Append it
        newRow.appendChild(shipping_address);

        //Create the items column
        let items = document.createElement("td");
        let itemList = document.createElement("ul");
        for (let i = 0; i < receipt.orders.length; i++) {
            orderItem = document.createElement("li");
            let orderName = document.createTextNode(receipt.order_names[i]);
            orderItem.appendChild(orderName);
            if (receipt.orders[i].display_Active !== "Y") {
                orderItem.style.color = "red"
            }
            orderItem.appendChild(orderName);
            itemList.appendChild(orderItem);
        }

        //Append it
        items.appendChild(itemList);
        newRow.appendChild(items);

        //Add a edit button column
        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.className = "button-green";
        editButton.addEventListener("click", () => {
            // Set the current receipt
            currentReceipt = receipt;

            // Populate the modal form
            let dateInput = document.getElementById("dateOrdered");
            let placedByInput = document.getElementById("placedBy");
            let shippingInput = document.getElementById("shippingAddress");
            let itemList = document.getElementById("Items");
            itemList.innerHTML = "";
            let totalInput = document.getElementById("total");

            // Set the values of the modal form
            dateInput.value = currentReceipt.date_ordered;
            placedByInput.value = receipt.placed_by;
            shippingInput.value = receipt.address;

            let total = 0.0;

            // Iterate over each receipt in the order
            for (let i = 0; i < currentReceipt.orders.length; i++) {

                // Create a list item for the name of the merchandise in the order
                orderItem = document.createElement("li");
                orderItem.className = "modal-list-item";

                // Create an active check mark that will let the user activate and deactivate specific items of the order
                activeLabel = document.createElement("Label");
                activeLabel.setAttribute("for", 'checkbox');
                activeLabel.innerHTML = "Active: ";
                activeLabel.className = "active-label"
                activeCheck = document.createElement("INPUT");
                activeCheck.setAttribute("type", "checkbox");
                activeCheck.setAttribute("id", currentReceipt.orders[i].order_Id + '_active');
                if (currentReceipt.orders[i].display_Active === "Y") {
                    activeCheck.checked = true;
                    total += parseFloat(currentReceipt.orders[i].total);
                }

                // Append
                orderItem.appendChild(document.createTextNode(currentReceipt.order_names[i]));
                orderItem.appendChild(activeLabel);
                orderItem.appendChild(activeCheck);
                itemList.appendChild(orderItem);
            }

            totalInput.value = "$" + total;



            //Set modal form to be viewable
            editModal.style.display = "block";
        });

        // Append the button to the row
        newRow.appendChild(editButton);

        // Add delete button column
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.className = "button-red";
        deleteButton.addEventListener("click", () => {
            // Set the current receipt
            currentReceipt = receipt;
            // Set modal form to be viewable
            deleteModal.style.display = "block";
        });

        // Append the button to the row
        newRow.appendChild(deleteButton);
        
        // Append the row to the table
        table.appendChild(newRow);

    });
}

// Deactivates all the orders in the receipt
function deleteReceipt() {

    currentReceipt.orders.forEach(order => {
        //Perform the POST using the toSaveMerchandise
        fetch('Orders/DeactivateOrder', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order),
        })
            .then(response => {
                if (response.status === 200) {
                    location.reload();
                } else {
                    alert("An error occurred trying to save.");
                }
            })
            .catch(error => {
                console.log(error);
            });
    });

    //Close the modal after a success or error message
    deleteModal.style.display = "none";
}

// Close the modal on cancel
function cancelDeleteModal() {
    deleteModal.style.display = "none";
}

// Saves the details of the edited receipt in the dialog box
function saveEditOrder() {
   
    // Iterate over each order in the current receipt being edited
    for (let i = 0; i < currentReceipt.orders.length; i++) {

        // Create an order with the updated address and display active values
        let updatedOrder = new Order(currentReceipt.orders[i].order_Id, document.getElementById("dateOrdered").value, currentReceipt.orders[i].total,
            document.getElementById("shippingAddress").value, currentReceipt.orders[i].placed_By, currentReceipt.orders[i].merchandise_Id, "Y");

        // Update the display active value of the order
        if (!document.getElementById(currentReceipt.orders[i].order_Id + "_active").checked) {
            updatedOrder.Display_Active = "N";
        }

        //Perform the POST using the SaveEditOrder function of the OrderController
        fetch('Orders/SaveEditOrder', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOrder),
        })
            .then(response => {
                if (response.status === 200) {
                    location.reload();
                } else {
                    alert("An error occurred trying to save");
                }
            })
            .catch(error => {
                console.log(error);
            });

    }
    //Close the modal after a success or error message
    editModal.style.display = "none";
}

// Close the modal on cancel
function cancelEditOrder() {
    editModal.style.display = "none";
}

CREATE DATABASE ecommerce;

USE ecommerce;

CREATE TABLE Merchandise (
	Merchandise_Id int NOT NULL AUTO_INCREMENT,
    Merchandise_Name varchar(100) NOT NULL,
    Price float,
    Date_Added Date,
    Brand varchar(100),
    Display_Active varchar(1) NOT NULL,
    PRIMARY KEY (Merchandise_Id)
);

CREATE TABLE Users (
	Username varchar(100) BINARY NOT NULL,
    User_Password varchar(100) BINARY NOT NULL,
	Email varchar(100) BINARY NOT NULL,
    First_Name varchar(100),
    Last_Name varchar(100),
    is_admin varchar(1),
    PRIMARY KEY (Username)
);

CREATE TABLE Orders (
	Order_Id int NOT NULL auto_increment,
    Date_Ordered DateTime NOT NULL,
    Total float NOT NULL,
	Address varchar(100) NOT NULL,
    Placed_By varchar(100) BINARY NOT NULL,
    Merchandise_Id int NOT NULL,
    Display_Active varchar(1) NOT NULL,
    PRIMARY KEY (Order_Id),
    FOREIGN KEY (Placed_By) REFERENCES Users(username),
    FOREIGN KEY (Merchandise_Id) REFERENCES Merchandise(Merchandise_Id)
);

INSERT 
INTO Merchandise (Merchandise_Id, Merchandise_Name, Price, Date_Added, Brand, Display_Active)
VALUES 	(1, "Big Hat", 100.00, STR_TO_DATE('04-06-2022', '%m-%d-%Y'), "JhnBrnd", "y"),
		(2, "Cowboy Hat", 200.56, STR_TO_DATE('04-17-2022', '%m-%d-%Y'), "Rootin' Tootin'", "y"),
        (3, "Magic Hat", 56.78,  STR_TO_DATE('04-17-2022', '%m-%d-%Y'), "Magic INC", "y"),
        (4, "Spinner", 1.01, STR_TO_DATE('04-17-2022', '%m-%d-%Y'), "Spin", "y");

INSERT 
INTO Users (Username, User_Password, Email, First_Name, Last_Name, Is_Admin)
VALUES 	("admin_user", "7uDRLhEubbt4eWnJqwjmjFzcDhBCjzGu7nXaKQz/iRE=", "admin@email.com", "admin", "admin", "y");

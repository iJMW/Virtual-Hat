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
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace ISYS366Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserManagementController : ControllerBase
    {

        private readonly ILogger<UserManagementController> _logger;
        private MySqlConnection connection;

        public UserManagementController(ILogger<UserManagementController> logger)
        {
            _logger = logger;
            connection = new MySqlConnection("server=localhost;userid=root;password=root;database=ecommerce");
        }

        [HttpPost]
        [Route("MakeAdmin")]
        public void MakeAdmin([FromBody] User user)
        {
            //Open the connection to the database
            connection.Open();
            
            //Create a command
            MySqlCommand command = connection.CreateCommand();

            //Set the command text to update the merchandise item with the specific id
            command.CommandText = @"UPDATE USERS
                                    SET IS_ADMIN = @isAdmin
                                    WHERE USERNAME = @username";
            //Add the appropriate parameters
            command.Parameters.AddWithValue("@username", user.Username);
            command.Parameters.AddWithValue("@isAdmin", user.isAdmin);

            // Execute the query and determine if it was successful or unsuccessful
            if (command.ExecuteNonQuery() > 0)
            {
                System.Diagnostics.Debug.Write("Update successful");
            }
            else
            {
                System.Diagnostics.Debug.Write("Update not successful");
            }

            //Close the connection
            connection.Close();
        }

        [HttpPost]
        [Route("DeleteUser")]
        public void DeleteUser([FromBody] User user)
        {
            //Open the connection to the database
            connection.Open();

            //Create a command
            MySqlCommand command = connection.CreateCommand();

            //Set the command text to update the merchandise item with the specific id
            command.CommandText = @"DELETE 
                                    FROM USERS
                                    WHERE USERNAME = @username";
            //Add the appropriate parameters
            command.Parameters.AddWithValue("@username", user.Username);

            // Execute the query and determine if it was successful or unsuccessful
            if (command.ExecuteNonQuery() > 0)
            {
                System.Diagnostics.Debug.Write("Removal successful");
            }
            else
            {
                System.Diagnostics.Debug.Write("Removal not successful");
            }

            //Close the connection
            connection.Close();
        }

        [HttpPost]
        [Route("SaveEditUser")]
        public void SaveEditUser([FromBody] User user)
        {
            //Open the connection to the database
            connection.Open();

            //Create a command
            MySqlCommand command = connection.CreateCommand();

            //Set the command text to update the merchandise item with the specific id
            command.CommandText = @"UPDATE USERS
                                    SET EMAIL = @email, FIRST_NAME = @firstName, LAST_NAME = @lastName
                                    WHERE USERNAME = @username";
            //Add the appropriate parameters
            command.Parameters.AddWithValue("@username", user.Username);
            command.Parameters.AddWithValue("@email", user.Email);
            command.Parameters.AddWithValue("@firstName", user.First_Name);
            command.Parameters.AddWithValue("@lastName", user.Last_Name);

            // Execute the query and determine if it was successful or unsuccessful
            if (command.ExecuteNonQuery() > 0)
            {
                System.Diagnostics.Debug.Write("Insert successful");
            }
            else
            {
                System.Diagnostics.Debug.Write("Insert not successful");
            }

            //Close the connection
            connection.Close();
        }

        [HttpGet]
        [Route("GetAllUsers")]
        public List<User> GetAllUsers()
        {
            //Initialize the list of items to be returned
            List<User> allUsers = new List<User>();

            //Open the database connection
            connection.Open();

            //Create a command
            MySqlCommand command = connection.CreateCommand();
            //Select all items in the table that are active
            command.CommandText = @"SELECT *
                                    FROM USERS users";

            //Create a reader
            MySqlDataReader reader = command.ExecuteReader();
            //iterate until results are finished
            while (reader.Read())
            {
                //Create a new merchandise variable
                User item = new User();

                //Get the username
                item.Username = reader.GetString(0);
                //Return an empty password
                item.User_Password = "";
                //Get the email
                item.Email = reader.GetString(2);
                //Get the price of the item
                item.First_Name = reader.GetString(3);
                //Get the date added of the item
                item.Last_Name = reader.GetString(4);
                //Get the brand of the item
                item.isAdmin = reader.GetString(5);

                //Add the item to the list to be returned
                allUsers.Add(item);
            }

            //Close the connection
            connection.Close();

            //Return the list of items
            return allUsers;
        }

        // IEnumerable<User>
        //Get a specific user to verify credentials
        [HttpPost]
        [Route("GetUser")]
        public User GetUser([FromBody]User user)
        {
            //Open the database connection
            connection.Open();
            //Create a new MySQL command
            MySqlCommand command = connection.CreateCommand();
            //Add the parameters to the command
            command.Parameters.AddWithValue("@username", user.Username);
            command.Parameters.AddWithValue("@password", user.User_Password);
            //The query/action to be performed
            command.CommandText = @"SELECT *
                                    FROM USERS
                                    WHERE USERNAME = @username AND USER_PASSWORD = @password;";
            
            //Create a reader to execute the query
            var reader = command.ExecuteReader();
            //Initialize a new user to be returned
            User returnedUser = new User();
            //Iterate over the returned result set
            while (reader.Read()){
                //Username is first
                returnedUser.Username = reader.GetString(0);
                //Password is second
                returnedUser.User_Password = reader.GetString(1);
                //Email is third
                returnedUser.Email = reader.GetString(2);
                //First Name is fourth
                returnedUser.First_Name = reader.GetString(3);
                //Last Name is fifth
                returnedUser.Last_Name = reader.GetString(4);


                return returnedUser;
            }

            //Close the connection
            connection.Close();
            //Return the user
            return null;
        }

        // Adds a user to the Users table
        [HttpPost]
        [Route("AddUser")]
        public void addUser([FromBody]User user){
            // Open the connection to the database
            connection.Open();
            // Create the MySQL command to be executed
            MySqlCommand command = connection.CreateCommand();
            // Add the parameters to the command
            command.Parameters.AddWithValue("@username", user.Username);
            command.Parameters.AddWithValue("@password", user.User_Password);
            command.Parameters.AddWithValue("@email", user.Email);
            command.Parameters.AddWithValue("@first", user.First_Name);
            command.Parameters.AddWithValue("@last", user.Last_Name);
            // Set the command text
            command.CommandText = @"INSERT INTO Users (username, user_password, email, first_name, last_name, is_Admin)
                                    VALUES (@username, @password, @email, @first, @last, 'n');";
            // Execute the query and determine if it was successful or unsuccessful
            if(command.ExecuteNonQuery() > 0){
                System.Diagnostics.Debug.Write("Insert successful");
            }else{
                System.Diagnostics.Debug.Write("Insert not successful");
            }
            // Close the connection
            connection.Close();
        }
    }   
}
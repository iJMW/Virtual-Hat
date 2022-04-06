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
            command.CommandText = @"INSERT INTO Users (username, user_password, email, first_name, last_name)
                                    VALUES (@username, @password, @email, @first, @last);";
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
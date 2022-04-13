using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace ISYS366Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MerchandiseController : ControllerBase
    {
        private readonly ILogger<MerchandiseController> _logger;
        private MySqlConnection connection;

        public MerchandiseController(ILogger<MerchandiseController> logger)
        {
            _logger = logger;
            connection = new MySqlConnection("server=localhost;userid=root;password=root;database=ecommerce");
        }

        //Gets a list of all items in the merchandise table
        [HttpGet]
        [Route("GetAllMerchandise")]
        public List<Merchandise> GetAllMerchandise()
        {
            //Initialize the list of items to be returned
            List<Merchandise> allMerchandise = new List<Merchandise>();

            //Open the database connection
            connection.Open();

            //Create a command
            MySqlCommand command = connection.CreateCommand();
            //Select all items in the table that are active
            command.CommandText = @"SELECT *
                                    FROM MERCHANDISE merch";

            //Create a reader
            MySqlDataReader reader = command.ExecuteReader();
            //iterate until results are finished
            while (reader.Read())
            {
                //Create a new merchandise variable
                Merchandise item = new Merchandise();

                //Get the id of the item
                item.Merchandise_Id = Int32.Parse(reader.GetString(0));
                //Get the name of the item
                item.Merchandise_Name = reader.GetString(1);
                //Get the price of the item
                item.Price = float.Parse(reader.GetString(2));
                //Get the date added of the item
                item.Date_Added = DateTime.Parse(reader.GetString(3)).ToShortDateString();
                //Get the brand of the item
                item.Brand = reader.GetString(4);
                //Get the active status of the item
                item.Display_Active = reader.GetString(5);

                //Add the item to the list to be returned
                allMerchandise.Add(item);
            }

            //Close the connection
            connection.Close();

            //Return the list of items
            return allMerchandise;
        }

        //Save the changes to the edited row
        [HttpPost]
        [Route("SaveEditMerchandise")]
        public void SaveEditMerchandise([FromBody]Merchandise item)
        {
            //Open the connection to the database
            connection.Open();

            //Create a command
            MySqlCommand command = connection.CreateCommand();

            //Set the command text to update the merchandise item with the specific id
            command.CommandText = @"UPDATE MERCHANDISE
                                    SET MERCHANDISE_NAME = @name, PRICE = @price, BRAND = @brand
                                    WHERE MERCHANDISE_ID = @merchandiseId";
            //Add the appropriate parameters
            command.Parameters.AddWithValue("@name", item.Merchandise_Name);
            command.Parameters.AddWithValue("@price", item.Price);
            command.Parameters.AddWithValue("@brand", item.Brand);
            command.Parameters.AddWithValue("@merchandiseId", item.Merchandise_Id);

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

        //Save the changes to the new row
        [HttpPost]
        [Route("SaveNewMerchandise")]
        public void SaveNewMerchandise([FromBody] Merchandise item)
        {
            //Open the connection to the database
            connection.Open();

            //Create a command
            MySqlCommand command = connection.CreateCommand();

            //Set the command text to insert the merchandise item
            command.CommandText = @"INSERT 
                                    INTO MERCHANDISE(MERCHANDISE_NAME, PRICE, DATE_ADDED, BRAND, DISPLAY_ACTIVE)
                                    VALUES(@name, @price, CURDATE(), @brand, @active)";
            //Add the appropriate parameters
            command.Parameters.AddWithValue("@name", item.Merchandise_Name);
            command.Parameters.AddWithValue("@price", item.Price);
            command.Parameters.AddWithValue("@brand", item.Brand);
            command.Parameters.AddWithValue("@active", item.Display_Active);

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

        //Save the changes to the edited row
        [HttpPost]
        [Route("SaveDeactivateMerchandise")]
        public void SaveDeactivateMerchandise([FromBody] Merchandise item)
        {
            //Open the connection to the database
            connection.Open();

            //Create a command
            MySqlCommand command = connection.CreateCommand();

            //Set the command text to update the merchandise item with the specific id
            command.CommandText = @"UPDATE MERCHANDISE
                                    SET DISPLAY_ACTIVE = @active
                                    WHERE MERCHANDISE_ID = @merchandiseId";
            //Add the appropriate parameters
            command.Parameters.AddWithValue("@active", item.Display_Active);
            command.Parameters.AddWithValue("@merchandiseId", item.Merchandise_Id);

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

        // IEnumerable<User>
        //Get a specific user to verify credentials
        [HttpGet]
        [Route("GetMerchandise")]
        public Merchandise GetMerchandise()
        {
            //Open the database connection
            connection.Open();
            //Create a new MySQL command
            MySqlCommand command = connection.CreateCommand();
            //The query/action to be performed
            command.CommandText = @"SELECT *
                                    FROM MERCHANDISE
                                    WHERE lower(DISPLAY_ACTIVE)='y';";

            //Create a reader to execute the query
            var reader = command.ExecuteReader();
            //Initialize a new user to be returned
            Merchandise returnedMerchandise = new Merchandise();
            //Iterate over the returned result set
            while (reader.Read())
            {
                //Username is first
                returnedMerchandise.Merchandise_Id = Int32.Parse(reader.GetString(0));
                //Password is second
                returnedMerchandise.Merchandise_Name = reader.GetString(1);
                //Email is third
                returnedMerchandise.Price = float.Parse(reader.GetString(2));
                //First Name is fourth
                returnedMerchandise.Date_Added = DateTime.Parse(reader.GetString(3)).ToShortDateString();
                //Last Name is fifth
                returnedMerchandise.Brand = reader.GetString(4);
                //Last Name is fifth
                returnedMerchandise.Display_Active = reader.GetString(4);

                return returnedMerchandise;
            }

            //Close the connection
            connection.Close();
            //Return the user
            return null;
        }

    }
}
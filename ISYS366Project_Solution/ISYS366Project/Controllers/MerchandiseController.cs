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
                                    FROM MERCHANDISE merch
                                    WHERE lower(merch.DISPLAY_ACTIVE) = 'y'";

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
                item.Date_Added = DateTime.Parse(reader.GetString(3));
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
                returnedMerchandise.Date_Added = DateTime.Parse(reader.GetString(3));
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
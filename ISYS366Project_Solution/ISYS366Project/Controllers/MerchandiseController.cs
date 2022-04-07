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
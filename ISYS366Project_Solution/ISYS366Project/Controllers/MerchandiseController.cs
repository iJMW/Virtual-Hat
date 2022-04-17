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
        public List<Merchandise> GetMerchandise()
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
            var returnedMerchandiseList = new List<Merchandise>();
            
            Merchandise temp;   
            //Iterate over the returned result set
            while (reader.Read())
            {
                temp = new Merchandise();
                //Username is first
                temp.Merchandise_Id  = Convert.ToInt32(reader["Merchandise_Id"].ToString());
                //Password is second
                temp.Merchandise_Name = reader["Merchandise_Name"].ToString();
                //Email is third
                temp.Price = float.Parse(reader["Price"].ToString());
                //First Name is fourth
                temp.Date_Added = reader["Date_Added"].ToString();
                //Last Name is fifth
                temp.Brand = reader["Brand"].ToString();
                //Last Name is fifth
                temp.Display_Active = reader["Display_Active"].ToString();

                returnedMerchandiseList.Add(temp);

                
            }

            return returnedMerchandiseList;

            //Close the connection
            connection.Close();
            //Return the user
            return null;
        }

    }
}
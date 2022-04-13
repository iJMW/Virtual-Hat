using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Drawing;
using System.Drawing.Imaging;

namespace ISYS366Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MerchandiseController : ControllerBase
    {
        private readonly ILogger<MerchandiseController> _logger;
        private MySqlConnection connection;
        private IWebHostEnvironment _hostingEnvironment;

        public MerchandiseController(ILogger<MerchandiseController> logger, IWebHostEnvironment environment)
        {
            _logger = logger;
            connection = new MySqlConnection("server=localhost;userid=root;password=root;database=ecommerce");
            _hostingEnvironment = environment;
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
        public Merchandise SaveNewMerchandise([FromBody] Merchandise item)
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

                command = connection.CreateCommand();
                command.CommandText = @"SELECT MAX(MERCHANDISE_ID)
                                        FROM MERCHANDISE";
                //Create a reader to execute the query
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    item.Merchandise_Id = Int32.Parse(reader.GetString(0));
                }
            }
            else
            {
                System.Diagnostics.Debug.Write("Insert not successful");
            }

            //Close the connection
            connection.Close();

            return item;
        }

        //Save the image for the item added in the images folder
        [HttpPost]
        [Route("UploadImage")]
        public void uploadImage()
        {
            var id = Request.Form["id"];

            IFormFile file = Request.Form.Files[0];
            var filePath = _hostingEnvironment.WebRootPath + "\\img\\" + id + "_toEdit.png";
            Stream fileStream = new FileStream(filePath, FileMode.Create);
            file.CopyToAsync(fileStream);
            fileStream.Close();

            //Resize the image
            /*
            Image image = Image.FromStream(fileStream);

            var destRect = new Rectangle(0, 0, 450, 300);
            var destImage = new Bitmap(450, 300);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceCopy;
                graphics.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(System.Drawing.Drawing2D.WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            fileStream.Close();
            filePath = _hostingEnvironment.WebRootPath + "\\img\\" + id + ".png";
            fileStream = new FileStream(filePath, FileMode.Create);
            Image newImage = (Image)destImage;
            newImage.Save(filePath);

            fileStream.Close();
            */
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
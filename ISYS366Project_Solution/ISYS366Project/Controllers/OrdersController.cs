using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace ISYS366Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {

        private readonly ILogger<OrdersController> _logger;
        private MySqlConnection connection;

        public OrdersController(ILogger<OrdersController> logger)
        {
            _logger = logger;
            connection = new MySqlConnection("server=localhost;userid=root;password=root;database=ecommerce");
        }

        // Adds a user to the Users table
        [HttpPost]
        [Route("AddOrder")]
        public void addOrder([FromBody]Order order)
        {
            // Open the connection to the database
            connection.Open();
            // Create the MySQL command to be executed
            MySqlCommand command = connection.CreateCommand();
            // Add the parameters to the command
            // command.Parameters.AddWithValue("@orderId", order.Order_Id);
            // command.Parameters.AddWithValue("@dateOrdered", order.Date_Ordered);
            command.Parameters.AddWithValue("@total", order.Total);
            command.Parameters.AddWithValue("@address", order.Address);
            command.Parameters.AddWithValue("@placedBy", order.Placed_By);
            command.Parameters.AddWithValue("@merchandiseId", order.Merchandise_Id);
            // Set the command text
            command.CommandText = @"INSERT INTO Orders (date_ordered, total, address, placed_by, merchandise_id, display_active)
                                    VALUES (now(), @total, @address, @placedBy, @merchandiseId, 'Y');";
            // Execute the query and determine if it was successful or unsuccessful
            if (command.ExecuteNonQuery() > 0)
            {
                System.Diagnostics.Debug.Write("Insert successful");
            }
            else
            {
                System.Diagnostics.Debug.Write("Insert not successful");
            }
            // Close the connection
            connection.Close();
        }

        [HttpGet]
        [Route("GetReceipts")]
        public List<Receipt> getReceipts()
        {
            //Open the database connection
            connection.Open();
            //Create a new MySQL command
            MySqlCommand command = connection.CreateCommand();
            //The query/action to be performed and Orders.Display_Active = 'Y'
            command.CommandText = @"SELECT Orders.Order_Id, Orders.Date_Ordered, Orders.Total, Orders.Address, Orders.Placed_By, Orders.Merchandise_Id, Merchandise.Merchandise_Name, Merchandise.Price, Orders.Display_Active
                                    FROM Orders
                                    INNER JOIN Merchandise on Orders.Merchandise_Id=Merchandise.Merchandise_Id
                                    ORDER BY Orders.Date_Ordered, Orders.Placed_By";
            //Create a reader to execute the query
            var reader = command.ExecuteReader();
            //Initialize a new list of receipts to be returned
            List<Receipt> receipts = new List<Receipt>();

            // Stores the username and the date of the receipt
            String username = "";
            DateTime date = new DateTime();
            Receipt currentReceipt = new Receipt();
            currentReceipt.orders = new List<Order>();
            var previousRow = reader;
       
            // Counts the total number of receipts
            int total = 0;
            //Iterate over the returned result set
            while (reader.Read())
            {   
                // For the first receipt
                if (total == 0)
                {
                    currentReceipt.orders = new List<Order>();
                    currentReceipt.date_ordered = DateTime.Parse(reader.GetString(1));
                    currentReceipt.placed_by = reader.GetString(4);
                    currentReceipt.address = reader.GetString(3);
                    currentReceipt.order_names = new List<String>();
                }

                // Create the order
                Order order = new Order();
                order.Order_Id = Int32.Parse(reader.GetString(0));
                order.Date_Ordered = DateTime.Parse(reader.GetString(1));
                order.Total = float.Parse(reader.GetString(2));
                order.Address = reader.GetString(3);
                order.Placed_By = reader.GetString(4);
                order.Merchandise_Id = Int32.Parse(reader.GetString(5));
                order.Display_Active = reader.GetString(8);

                // Check if the individual who placed the order is the same as the individual on the current receipt
                // Check if the date of the order is the same as the date on the current receipt
                if (order.Placed_By.Equals(currentReceipt.placed_by) && order.Date_Ordered.Equals(currentReceipt.date_ordered))
                {
                    // Add the order to the current receipt
                    currentReceipt.orders.Add(order);
                    currentReceipt.order_names.Add(reader.GetString(6));
                    currentReceipt.total += order.Total;
                } 
                else
                {
                    // Add the receipt to the list receipt
                    receipts.Add(currentReceipt);
                    
                    // Create a new receipt for the current data
                    currentReceipt = new Receipt();
                    currentReceipt.date_ordered = DateTime.Parse(reader.GetString(1));
                    currentReceipt.placed_by = reader.GetString(4);
                    currentReceipt.address = previousRow.GetString(3);
                    currentReceipt.orders = new List<Order>();
                    currentReceipt.orders.Add(order);
                    currentReceipt.order_names = new List<String>();
                    currentReceipt.order_names.Add(reader.GetString(6));
                    currentReceipt.total += order.Total;
                }
                
                // Stores the previous row
                previousRow = reader;

                // Increase the total amount of receipts
                total++;
            }

            // Add the last receipt
            if (currentReceipt.orders.Count != 0)
            {
                currentReceipt.date_ordered = DateTime.Parse(previousRow.GetString(1));
                currentReceipt.placed_by = previousRow.GetString(4);
                currentReceipt.address = previousRow.GetString(3);
                receipts.Add(currentReceipt);
            }

            // Close the connection
            connection.Close();
            
            // Return the user
            return receipts;
        }

        [HttpPost]
        [Route("DeactivateOrder")]
        public void DeactivateOrder([FromBody] Order order)
        {
            //Open the connection to the database
            connection.Open();

            //Create a command
            MySqlCommand command = connection.CreateCommand();

            //Set the command text to update the merchandise item with the specific id
            command.CommandText = @"UPDATE Orders
                                    SET DISPLAY_ACTIVE = 'N'
                                    WHERE ORDER_ID = @orderId";
            //Add the appropriate parameters
            command.Parameters.AddWithValue("@orderId", order.Order_Id);
            // Execute the query and determine if it was successful or unsuccessful
            if (command.ExecuteNonQuery() > 0)
            {
                System.Diagnostics.Debug.Write("Order " + order.Order_Id + " was deactivated");
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
        [Route("SaveEditOrder")]
        public void SaveEditOrder([FromBody] Order order)
        {
            //Open the connection to the database
            connection.Open();

            //Create a command
            MySqlCommand command = connection.CreateCommand();

            //Set the command text to update the merchandise item with the specific id
            command.CommandText = @"UPDATE ORDERS
                                    SET ADDRESS = @address, DISPLAY_ACTIVE = @displayActive
                                    WHERE ORDER_ID = @orderId";
            //Add the appropriate parameters
            command.Parameters.AddWithValue("@orderId", order.Order_Id);
            command.Parameters.AddWithValue("@address", order.Address);
            command.Parameters.AddWithValue("@displayActive", order.Display_Active);

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

    }
}

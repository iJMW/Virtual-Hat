namespace ISYS366Project
{
    public class Order
    {

        public int Order_Id { get; set; }

        public DateTime Date_Ordered { get; set; }

        public float Total { get; set; }

        public String Address { get; set; }

        public String Placed_By { get; set; }

        public int Merchandise_Id { get; set; }

        public String Display_Active { get; set; }
    }
}

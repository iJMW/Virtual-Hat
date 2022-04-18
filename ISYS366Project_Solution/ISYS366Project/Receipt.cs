namespace ISYS366Project
{
    public class Receipt
    {
        public string id { get; set; }
        public DateTime date_ordered { get; set; }
        public float total { get; set; }
        public string address { get; set; }
        public string placed_by { get; set; }
        public List<Order> orders { get; set; }
        public List<String> order_names { get; set; }
    }
}

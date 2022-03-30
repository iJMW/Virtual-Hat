using Microsoft.AspNetCore.Mvc;

namespace ISYS366Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {

        private readonly ILogger<OrdersController> _logger;
        
        public OrdersController(ILogger<OrdersController> logger)
        {
            _logger = logger;
        }


    }
}
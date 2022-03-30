using Microsoft.AspNetCore.Mvc;

namespace ISYS366Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MerchandiseController : ControllerBase
    {
        private readonly ILogger<MerchandiseController> _logger;

        public MerchandiseController(ILogger<MerchandiseController> logger)
        {
            _logger = logger;
        }


    }
}
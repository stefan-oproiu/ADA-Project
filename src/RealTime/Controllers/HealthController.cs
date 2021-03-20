using Microsoft.AspNetCore.Mvc;

namespace RealTime.Controllers
{
    [Route("api/real-time/health")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetHealth()
        {
            return Ok("real-time helth");
        }
    }
}

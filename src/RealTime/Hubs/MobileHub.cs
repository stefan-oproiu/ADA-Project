using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace RealTime.Hubs
{
    public class MobileHub : Hub<IMobileClient>
    {
        private ILogger<MobileHub> logger;

        public MobileHub(ILogger<MobileHub> logger)
        {
            this.logger = logger;
        }
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }
    }
}

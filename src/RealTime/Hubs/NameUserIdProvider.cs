using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Security.Claims;

namespace RealTime.Hubs
{
    public class NameUserIdProvider : IUserIdProvider
    {
        private ILogger logger;
        public NameUserIdProvider(ILoggerFactory loggerFactory)
        {
            logger = loggerFactory.CreateLogger<NameUserIdProvider>();
        }
        public string GetUserId(HubConnectionContext connection)
        {
            logger.LogInformation(string.Join("\n", connection.User.Claims.Select(c => $"{c.Type}: {c.Value}")));
            return connection.User?.Claims?.FirstOrDefault(c => c.Type == "sub")?.Value;
        }
    }
}

using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
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
            var context = connection.GetHttpContext();
            var bearer = context.Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(bearer))
            {
                return null;
            }
            var token = bearer.Split(' ')[1];
            var handler = new JwtSecurityTokenHandler();
            var tokenS = handler.ReadToken(token) as JwtSecurityToken;
            var sub = tokenS.Claims.FirstOrDefault(c => c.Type == "sub").Value;
            return sub;
        }
    }
}

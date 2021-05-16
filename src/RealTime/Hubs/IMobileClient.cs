using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealTime.Hubs
{
    public interface IMobileClient
    {
        Task MoneyReceived(string serializedMessage);
        Task MoneySent(string serializedMessage);
    }
}

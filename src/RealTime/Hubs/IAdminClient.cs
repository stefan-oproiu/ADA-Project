using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RealTime.Hubs
{
    public interface IAdminClient
    {
        Task TransactionCompleted(string serializedTransaction);
    }
}

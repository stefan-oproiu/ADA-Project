using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.Exceptions;
using RealTime.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace RealTime
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IHubContext<AdminHub, IAdminClient> adminHub;
        private readonly IHubContext<MobileHub, IMobileClient> mobileHub;
        private ConnectionFactory _connectionFactory;
        private IConnection _connection;
        private IModel _channel;
        private const string QueueName = "transactions";

        public Worker(
            ILogger<Worker> logger,
            IHubContext<AdminHub, IAdminClient> adminHub,
            IHubContext<MobileHub, IMobileClient> mobileHub)
        {
            _logger = logger;
            this.adminHub = adminHub;
            this.mobileHub = mobileHub;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            _connectionFactory = new ConnectionFactory
            {
                UserName = "guest",
                Password = "guest",
                HostName = "rabbit",
                Port = 5672,
                DispatchConsumersAsync = true
            };
            _connection = _connectionFactory.CreateConnection();
            _channel = _connection.CreateModel();
            _channel.QueueDeclarePassive(QueueName);
            _channel.BasicQos(0, 1, false);
            _logger.LogInformation($"Queue [{QueueName}] is waiting for messages.");

            return base.StartAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            stoppingToken.ThrowIfCancellationRequested();

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.Received += async (bc, ea) =>
            {
                var message = Encoding.UTF8.GetString(ea.Body.ToArray());
                _logger.LogInformation($"Processing msg: '{message}'.");
                try
                {
                    Dictionary<string, object> dict = JsonConvert.DeserializeObject<Dictionary<string, object>>(message);

                    await this.adminHub.Clients.All.TransactionCompleted(message);

                    if (!dict["sourceId"].Equals("SYSTEM"))
                    {
                        _logger.LogInformation($"Sent money to: {dict["sourceId"]}");
                        await this.mobileHub.Clients.User(dict["sourceId"].ToString()).MoneySent(message);
                    }

                    _logger.LogInformation($"Received money from: {dict["targetId"]}");
                    await this.mobileHub.Clients.User(dict["targetId"].ToString()).MoneyReceived(message);
                }
                catch (AlreadyClosedException)
                {
                    _logger.LogInformation("RabbitMQ is closed!");
                }
                catch (Exception e)
                {
                    _logger.LogError(default, e, e.Message);
                }
            };

            _channel.BasicConsume(queue: QueueName, autoAck: true, consumer);

            await Task.CompletedTask;
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            await base.StopAsync(cancellationToken);
            _connection.Close();
            _logger.LogInformation("RabbitMQ connection is closed.");
        }
    }
}

// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using IdentityModel;
using IdentityServer.Data;
using IdentityServer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using RabbitMQ.Client;
using Serilog;

namespace IdentityServer
{
    public class SeedData
    {
        public static void EnsureSeedData(string connectionString)
        {
            var services = new ServiceCollection();
            services.AddLogging();
            services.AddDbContext<ApplicationDbContext>(options =>
               options.UseSqlServer(connectionString));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            using (var serviceProvider = services.BuildServiceProvider())
            {
                using (var scope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                {
                    var context = scope.ServiceProvider.GetService<ApplicationDbContext>();
                    context.Database.Migrate();

                    var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                    var alice = userMgr.FindByNameAsync("alice").Result;

                    var factory = new ConnectionFactory() { HostName = "rabbit", Port = 5672 };
                    using (var connection = factory.CreateConnection())
                    using (var channel = connection.CreateModel())
                    {
                        channel.QueueDeclare(queue: "users",
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);
                        if (alice == null)
                        {
                            alice = new ApplicationUser
                            {
                                UserName = "alice",
                                Email = "AliceSmith@email.com",
                                EmailConfirmed = true,
                            };
                            var result = userMgr.CreateAsync(alice, "Pass123$").Result;
                            if (!result.Succeeded)
                            {
                                throw new Exception(result.Errors.First().Description);
                            }

                            result = userMgr.AddClaimsAsync(alice, new Claim[]{
                            new Claim(JwtClaimTypes.Name, "Alice Smith"),
                            new Claim(JwtClaimTypes.GivenName, "Alice"),
                            new Claim(JwtClaimTypes.FamilyName, "Smith"),
                            new Claim(JwtClaimTypes.WebSite, "http://alice.com"),
                        }).Result;
                            if (!result.Succeeded)
                            {
                                throw new Exception(result.Errors.First().Description);
                            }

                            var user = new
                            {
                                id = alice.Id,
                                fullName = alice.NormalizedUserName,
                                balance = 1000,
                                transactions = new List<object>()
                            };

                            var json = JsonConvert.SerializeObject(user);
                            var body = Encoding.UTF8.GetBytes(json);

                            channel.BasicPublish(exchange: "",
                                 routingKey: "users",
                                 basicProperties: null,
                                 body: body);

                            Log.Debug("alice created");
                        }
                        else
                        {
                            Log.Debug("alice already exists");
                        }

                        var bob = userMgr.FindByNameAsync("bob").Result;
                        if (bob == null)
                        {
                            bob = new ApplicationUser
                            {
                                UserName = "bob",
                                Email = "BobSmith@email.com",
                                EmailConfirmed = true
                            };
                            var result = userMgr.CreateAsync(bob, "Pass123$").Result;
                            if (!result.Succeeded)
                            {
                                throw new Exception(result.Errors.First().Description);
                            }

                            result = userMgr.AddClaimsAsync(bob, new Claim[]{
                            new Claim(JwtClaimTypes.Name, "Bob Smith"),
                            new Claim(JwtClaimTypes.GivenName, "Bob"),
                            new Claim(JwtClaimTypes.FamilyName, "Smith"),
                            new Claim(JwtClaimTypes.WebSite, "http://bob.com"),
                            new Claim("location", "somewhere")
                        }).Result;
                            if (!result.Succeeded)
                            {
                                throw new Exception(result.Errors.First().Description);
                            }

                            var user = new
                            {
                                id = bob.Id,
                                fullName = bob.NormalizedUserName,
                                balance = 1000,
                                transactions = new List<object>()
                            };

                            var json = JsonConvert.SerializeObject(user);
                            var body = Encoding.UTF8.GetBytes(json);

                            channel.BasicPublish(exchange: "",
                                 routingKey: "users",
                                 basicProperties: null,
                                 body: body);

                            Log.Debug("bob created");
                        }
                        else
                        {
                            Log.Debug("bob already exists");
                        }

                        var charlie = userMgr.FindByNameAsync("charlie").Result;
                        if (charlie == null)
                        {
                            charlie = new ApplicationUser
                            {
                                UserName = "charlie",
                                Email = "CharlieSmith@email.com",
                                EmailConfirmed = true
                            };
                            var result = userMgr.CreateAsync(charlie, "Pass123$").Result;
                            if (!result.Succeeded)
                            {
                                throw new Exception(result.Errors.First().Description);
                            }

                            result = userMgr.AddClaimsAsync(charlie, new Claim[]{
                            new Claim(JwtClaimTypes.Name, "Charlie Smith"),
                            new Claim(JwtClaimTypes.GivenName, "Charlie"),
                            new Claim(JwtClaimTypes.FamilyName, "Smith"),
                            new Claim(JwtClaimTypes.WebSite, "http://charlie.com"),
                            new Claim("location", "somewhere")
                        }).Result;
                            if (!result.Succeeded)
                            {
                                throw new Exception(result.Errors.First().Description);
                            }

                            var user = new
                            {
                                id = charlie.Id,
                                fullName = charlie.NormalizedUserName,
                                balance = 1000,
                                transactions = new List<object>()
                            };

                            var json = JsonConvert.SerializeObject(user);
                            var body = Encoding.UTF8.GetBytes(json);

                            channel.BasicPublish(exchange: "",
                                 routingKey: "users",
                                 basicProperties: null,
                                 body: body);

                            Log.Debug("charlie created");
                        }
                        else
                        {
                            Log.Debug("charlie already exists");
                        }
                    }
                }
            }
        }
    }
}

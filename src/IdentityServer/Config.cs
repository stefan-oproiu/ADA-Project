// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4;
using IdentityServer4.Models;
using System.Collections.Generic;

namespace IdentityServer
{
    public static class Config
    {
        public static IEnumerable<IdentityResource> IdentityResources =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
            };

        public static IEnumerable<ApiScope> ApiScopes =>
            new ApiScope[]
            {
                new ApiScope("admin"),
                new ApiScope("mobile"),
            };

        public static IEnumerable<Client> Clients =>
            new Client[]
            {
                // m2m client credentials flow client
                new Client
                {
                    ClientId = "m2m.client",
                    ClientName = "Client Credentials Client",

                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    ClientSecrets = { new Secret("511536EF-F270-4058-80CA-1C89C192F69A".Sha256()) },

                    AllowedScopes = { "admin", "mobile" }
                },

                // interactive client using code flow + pkce
                new Client
                {
                    ClientId = "mobile-client",
                    ClientSecrets = { new Secret("49C1A7E1-0C79-4A89-A3D6-A37998FB86B0".Sha256()) },

                    AllowedGrantTypes = GrantTypes.Code,

                    RedirectUris = { "https://localhost:44300/signin-oidc" },
                    FrontChannelLogoutUri = "https://localhost:44300/signout-oidc",
                    PostLogoutRedirectUris = { "https://localhost:44300/signout-callback-oidc" },

                    AllowOfflineAccess = true,
                    AllowedScopes = { "openid", "profile", "mobile" }
                },

                new Client
                {
                    ClientId = "admin-client",
                    ClientName = "Admin Client",
                    AllowedGrantTypes = GrantTypes.Code,
                    RequireClientSecret = false,
                    RequireConsent = false,
                    AccessTokenLifetime = 600,
                    RequirePkce = true,

                    RedirectUris = new List<string> { 
                        "http://192.168.100.8:4200/signin-callback",
                        "https://192.168.100.8:4200/signin-callback",
                        "http://localhost:4200/signin-callback",
                        "https://localhost:4200/signin-callback",
                    },
                    PostLogoutRedirectUris = new List<string> { 
                        "http://192.168.100.8:4200/logout-callback",
                        "https://192.168.100.8:4200/logout-callback",
                        "http://localhost:4200/logout-callback",
                        "https://localhost:4200/logout-callback"
                    },
                    AllowedCorsOrigins = new List<string> { 
                        "http://192.168.100.8:4200",
                        "http://192.168.100.8:5000",
                        "https://192.168.100.8:4200",
                        "http://localhost:4200",
                        "https://localhost:4200"
                    },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "admin"
                    }
                }
            };
    }
}
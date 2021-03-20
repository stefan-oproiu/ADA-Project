FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 5001

ENV ASPNETCORE_URLS=http://*:5001
ENV ASPNETCORE_ENVIRONMENT=PRODUCTION

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["RealTime.csproj", "./"]
RUN dotnet restore "RealTime.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "RealTime.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RealTime.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RealTime.dll"]

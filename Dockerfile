# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 1. Copia SOLO el archivo del proyecto principal 
COPY ["backend/ProductService/ProductService.csproj", "backend/ProductService/"]

# 2. Restauramos las dependencias solo para ese proyecto
RUN dotnet restore "backend/ProductService/ProductService.csproj"

# 3. Copiamos el resto del código
COPY . .

# 4. Compilamos
WORKDIR "/src/backend/ProductService"
RUN dotnet build "ProductService.csproj" -c Release -o /app/build

# 5. Publicamos
FROM build AS publish
RUN dotnet publish "ProductService.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "ProductService.dll"]
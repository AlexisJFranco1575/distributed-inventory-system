# Distributed Inventory System

[![.NET Backend CI](https://github.com/AlexisJFranco1575/distributed-inventory-system/actions/workflows/dotnet-ci.yml/badge.svg)](https://github.com/AlexisJFranco1575/distributed-inventory-system/actions/workflows/dotnet-ci.yml)

Sistema de inventario distribuido desarrollado en .NET 8.
## 🏗️ Architecture

```mermaid
graph TD
    Client["👤 User / Browser"] -->|HTTP Request| Frontend["⚛️ React Frontend (Vite)"]
    
    subgraph "Docker Host (Your PC)"
        Frontend -->|"Fetch API :8080"| Backend["⚙️ .NET 8 API Container"]
        Backend -->|"SQL Protocol :1433"| Database[("🗄️ SQL Server Container")]
    end

    subgraph "CI/CD Pipeline"
        GitHub["🐙 GitHub Repo"] -->|Push| Actions["🚀 GitHub Actions"]
        Actions -->|"Build & Test"| Backend
    end

    style Frontend fill:#61dafb,stroke:#333,stroke-width:2px,color:black
    style Backend fill:#512bd4,stroke:#333,stroke-width:2px,color:white
    style Database fill:#cc2927,stroke:#333,stroke-width:2px,color:white
    style Actions fill:#2088ff,stroke:#333,stroke-width:2px,color:white
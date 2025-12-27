using Xunit;
using Moq; // Importamos la librería de "actuación"
using ProductService.controllers;
using ProductService.Models;
using ProductService.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ProductService.Tests
{
    public class ProductsControllerTests
    {
        private readonly Mock<IProductRepository> _mockRepo;
        private readonly ProductsController _controller;

        public ProductsControllerTests()
        {
            _mockRepo = new Mock<IProductRepository>();
            
            _controller = new ProductsController(_mockRepo.Object);
        }

        [Fact]
        public async Task GetProducts_ShouldReturnList_WhenProductsExist()
        {
            // --- ARRANGE ---
            var fakeProducts = new List<Product>
            {
                new Product { Id = 1, Name = "Laptop Gamer", Price = 1500, Stock = 5 },
                new Product { Id = 2, Name = "Mouse RGB", Price = 50, Stock = 20 }
            };

            _mockRepo.Setup(repo => repo.GetAllAsync())
                     .ReturnsAsync(fakeProducts);

            // --- ACT ---
            var result = await _controller.GetProducts();

            // --- ASSERT ---
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            
            var returnProducts = Assert.IsType<List<Product>>(okResult.Value);
            
            Assert.Equal(2, returnProducts.Count);
        }

        [Fact]
        public async Task CreateProduct_ShouldCallRepository_AndReturnCreated()
        {
            // --- ARRANGE ---
            var newProduct = new Product { Name = "Teclado Mecánico", Price = 100, Stock = 10 };

            // Mock
            _mockRepo.Setup(repo => repo.CreateAsync(newProduct))
                     .Returns(Task.CompletedTask);

            // --- ACT ---
            var result = await _controller.CreateProduct(newProduct);

            // --- ASSERT ---

            var createdResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(201, createdResult.StatusCode);


            _mockRepo.Verify(repo => repo.CreateAsync(newProduct), Times.Once);
        }
    }
}
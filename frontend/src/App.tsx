import { useEffect, useState } from 'react';
import { 
  ChakraProvider, Box, Heading, Text, SimpleGrid, Badge, Container, 
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, 
  ModalCloseButton, ModalFooter, Input, VStack, useDisclosure, useToast 
} from '@chakra-ui/react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Controla la ventana modal
  const toast = useToast(); // Para notificaciones bonitas

  // Estado para el nuevo producto
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });

  // 1. Cargar productos (READ)
  const fetchProducts = () => {
    fetch('http://localhost:5004/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Guardar producto (CREATE)
  const handleSave = () => {
    const productToSend = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock)
    };

    fetch('http://localhost:5004/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productToSend)
    })
    .then(res => {
      if (res.ok) {
        toast({ title: 'Producto creado.', status: 'success', duration: 3000, isClosable: true });
        fetchProducts(); // Recargar la lista
        onClose(); // Cerrar modal
        setNewProduct({ name: '', price: '', stock: '' }); // Limpiar formulario
      }
    });
  };

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={10}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={10}>
          <Heading color="teal.500">📦 Inventario Distribuido</Heading>
          <Button colorScheme="teal" onClick={onOpen}>+ Agregar Producto</Button>
        </Box>
        
        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
          {products.map((product) => (
            <Box key={product.id} borderWidth="1px" borderRadius="lg" p={5} shadow="md" _hover={{ shadow: 'xl' }}>
              <Badge borderRadius="full" px="2" colorScheme="teal" mb={2}>ID: {product.id}</Badge>
              <Heading size="md">{product.name}</Heading>
              <Text fontSize="2xl" mt={2}>${product.price.toFixed(2)}</Text>
              <Text color={product.stock > 0 ? "green.500" : "red.500"} fontWeight="bold">
                Stock: {product.stock}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Ventana Modal para crear producto */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nuevo Producto</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input placeholder="Nombre del producto" 
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                />
                <Input placeholder="Precio" type="number" 
                  value={newProduct.price} 
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
                />
                <Input placeholder="Stock Inicial" type="number" 
                  value={newProduct.stock} 
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} 
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSave}>Guardar</Button>
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </Container>
    </ChakraProvider>
  );
}

export default App;
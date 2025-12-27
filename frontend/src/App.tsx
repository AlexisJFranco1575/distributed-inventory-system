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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Product state
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });

  // 1. Load products (READ)
  const fetchProducts = () => {
    fetch('http://localhost:5004/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Save product (CREATE)
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
        toast({ title: 'Product created.', status: 'success', duration: 3000, isClosable: true });
        fetchProducts(); // Reload List
        onClose(); // Close modal
        setNewProduct({ name: '', price: '', stock: '' }); // Clear form
      }
    });
  };

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={10}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={10}>
          <Heading color="teal.500">📦 Distributed Inventory</Heading>
          <Button colorScheme="teal" onClick={onOpen}>+ Add Product</Button>
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

        {/* Modal window to create product */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input placeholder="Product Name" 
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                />
                <Input placeholder="Price" type="number" 
                  value={newProduct.price} 
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
                />
                <Input placeholder="Initial Stock" type="number" 
                  value={newProduct.stock} 
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} 
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSave}>Save</Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </Container>
    </ChakraProvider>
  );
}

export default App;
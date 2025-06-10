import { ChakraProvider, Container, Heading, VStack } from '@chakra-ui/react'
import Calculator from './components/Calculator'

function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Heading>Web Calculator</Heading>
          <Calculator />
        </VStack>
      </Container>
    </ChakraProvider>
  )
}

export default App

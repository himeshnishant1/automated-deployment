import { ChakraProvider, Container, Heading, VStack } from '@chakra-ui/react'
import Calculator from './components/Calculator'

function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <VStack gap={8}>
          <Heading>Calculator</Heading>
          <Calculator />
        </VStack>
      </Container>
    </ChakraProvider>
  )
}

export default App

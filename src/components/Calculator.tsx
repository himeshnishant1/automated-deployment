import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  Input,
  VStack,
} from '@chakra-ui/react';

interface CalculatorState {
  display: string;
  memory: number;
  operation: string | null;
  firstOperand: number | null;
  waitingForSecondOperand: boolean;
}

const Calculator = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    memory: 0,
    operation: null,
    firstOperand: null,
    waitingForSecondOperand: false,
  });

  const handleNumber = (number: string) => {
    const { display, waitingForSecondOperand } = state;

    if (waitingForSecondOperand) {
      setState({
        ...state,
        display: number,
        waitingForSecondOperand: false,
      });
    } else {
      setState({
        ...state,
        display: display === '0' ? number : display + number,
      });
    }
  };

  const handleDecimal = () => {
    const { display, waitingForSecondOperand } = state;

    if (waitingForSecondOperand) {
      setState({
        ...state,
        display: '0.',
        waitingForSecondOperand: false,
      });
    } else if (display.indexOf('.') === -1) {
      setState({
        ...state,
        display: display + '.',
      });
    }
  };

  const handleOperator = (nextOperator: string) => {
    const { display, firstOperand, operation } = state;
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setState({
        ...state,
        firstOperand: inputValue,
        waitingForSecondOperand: true,
        operation: nextOperator,
      });
    } else if (operation) {
      const result = performCalculation();
      setState({
        ...state,
        display: String(result),
        firstOperand: result,
        waitingForSecondOperand: true,
        operation: nextOperator,
      });
    }
  };

  const performCalculation = () => {
    const { firstOperand, operation, display } = state;
    const inputValue = parseFloat(display);

    if (operation === '+') {
      return firstOperand! + inputValue;
    } else if (operation === '-') {
      return firstOperand! - inputValue;
    } else if (operation === '×') {
      return firstOperand! * inputValue;
    } else if (operation === '÷') {
      return firstOperand! / inputValue;
    }

    return inputValue;
  };

  const handleEqual = () => {
    const { firstOperand, operation } = state;

    if (!firstOperand || !operation) return;

    const result = performCalculation();
    setState({
      ...state,
      display: String(result),
      firstOperand: null,
      waitingForSecondOperand: true,
      operation: null,
    });
  };

  const handleClear = () => {
    setState({
      display: '0',
      memory: 0,
      operation: null,
      firstOperand: null,
      waitingForSecondOperand: false,
    });
  };

  const handleMemoryAdd = () => {
    setState({
      ...state,
      memory: state.memory + parseFloat(state.display),
    });
  };

  const handleMemorySubtract = () => {
    setState({
      ...state,
      memory: state.memory - parseFloat(state.display),
    });
  };

  const handleMemoryRecall = () => {
    setState({
      ...state,
      display: String(state.memory),
    });
  };

  const handleMemoryClear = () => {
    setState({
      ...state,
      memory: 0,
    });
  };

  const handlePercentage = () => {
    const currentValue = parseFloat(state.display);
    setState({
      ...state,
      display: String(currentValue / 100),
    });
  };

  const handleSquareRoot = () => {
    const currentValue = parseFloat(state.display);
    if (currentValue >= 0) {
      setState({
        ...state,
        display: String(Math.sqrt(currentValue)),
      });
    }
  };

  const handleToggleSign = () => {
    setState({
      ...state,
      display: String(-parseFloat(state.display)),
    });
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (/[0-9]/.test(event.key)) {
      handleNumber(event.key);
    } else if (event.key === '.') {
      handleDecimal();
    } else if (event.key === '+') {
      handleOperator('+');
    } else if (event.key === '-') {
      handleOperator('-');
    } else if (event.key === '*') {
      handleOperator('×');
    } else if (event.key === '/') {
      handleOperator('÷');
    } else if (event.key === 'Enter' || event.key === '=') {
      handleEqual();
    } else if (event.key === 'Escape') {
      handleClear();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [state]);

  return (
    <Box
      maxW="400px"
      mx="auto"
      p={4}
      borderRadius="lg"
      boxShadow="xl"
      bg="white"
    >
      <VStack gap={4}>
        <Input
          value={state.display}
          readOnly
          size="lg"
          textAlign="right"
          fontSize="2xl"
          mb={4}
        />

        <Grid templateColumns="repeat(4, 1fr)" gap={2} w="100%">
          <Button onClick={handleMemoryClear}>MC</Button>
          <Button onClick={handleMemoryRecall}>MR</Button>
          <Button onClick={handleMemoryAdd}>M+</Button>
          <Button onClick={handleMemorySubtract}>M-</Button>

          <Button onClick={handleSquareRoot}>√</Button>
          <Button onClick={handlePercentage}>%</Button>
          <Button onClick={handleToggleSign}>+/-</Button>
          <Button onClick={handleClear}>AC</Button>

          <Button onClick={() => handleNumber('7')}>7</Button>
          <Button onClick={() => handleNumber('8')}>8</Button>
          <Button onClick={() => handleNumber('9')}>9</Button>
          <Button onClick={() => handleOperator('÷')}>÷</Button>

          <Button onClick={() => handleNumber('4')}>4</Button>
          <Button onClick={() => handleNumber('5')}>5</Button>
          <Button onClick={() => handleNumber('6')}>6</Button>
          <Button onClick={() => handleOperator('×')}>×</Button>

          <Button onClick={() => handleNumber('1')}>1</Button>
          <Button onClick={() => handleNumber('2')}>2</Button>
          <Button onClick={() => handleNumber('3')}>3</Button>
          <Button onClick={() => handleOperator('-')}>-</Button>

          <Button onClick={() => handleNumber('0')}>0</Button>
          <Button onClick={handleDecimal}>.</Button>
          <Button onClick={handleEqual}>=</Button>
          <Button onClick={() => handleOperator('+')}>+</Button>
        </Grid>
      </VStack>
    </Box>
  );
};

export default Calculator; 
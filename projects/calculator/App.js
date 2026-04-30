// Calculator with intentional bugs for QA testing
const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const warningText = document.querySelector('.warning');

let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;

// Language support
let currentLang = localStorage.getItem('lang') || 'en';
updateLanguage(currentLang);

// Listen for language changes from the main page
window.addEventListener('storage', (e) => {
  if (e.key === 'lang') {
    currentLang = e.newValue || 'en';
    updateLanguage(currentLang);
  }
});

function updateLanguage(lang) {
  if (typeof translations !== 'undefined' && translations[lang] && translations[lang].calcWarning) {
    warningText.textContent = translations[lang].calcWarning;
  }
}

function updateDisplay() {
  display.value = currentValue;
}

function handleNumber(num) {
  if (shouldResetDisplay) {
    currentValue = num;
    shouldResetDisplay = false;
  } else {
    if (num === '0' && currentValue === '0') return;
    if (currentValue === '0' && num !== '.') {
      currentValue = num;
    } else {
      // BUG: Can add multiple decimal points - this is obvious and wrong!
      if (num === '.' && currentValue.includes('.')) return;
      currentValue += num;
    }
  }
  updateDisplay();
}

function handleOperator(op) {
  // BUG: Can set operator without entering a number first
  if (operator && !shouldResetDisplay) {
    calculate();
  }
  
  previousValue = currentValue;
  operator = op;
  shouldResetDisplay = true;
}

function calculate() {
  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);
  
  if (isNaN(prev) || isNaN(current)) return;
  
  let result;
  let hasFloatingPointError = false;
  
  switch (operator) {
    case '+':
      result = prev + current;
      // BUG: Show floating point errors for common cases
      if ((prev === 0.1 && current === 0.2) || (prev === 0.2 && current === 0.1)) {
        hasFloatingPointError = true;
      }
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      // BUG: Division by zero shows Infinity instead of error
      result = prev / current;
      break;
    default:
      return;
  }
  
  // BUG: Floating point precision errors visible to users!
  if (hasFloatingPointError) {
    // Show the error with a warning in the display
    currentValue = result.toString() + ' ⚠️';
  } else {
    currentValue = result.toString();
  }
  
  operator = null;
  previousValue = '';
  shouldResetDisplay = true;
  updateDisplay();
}

function clearDisplay() {
  currentValue = '0';
  previousValue = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLastChar() {
  // BUG: Doesn't handle negative numbers correctly - removes the minus sign first!
  if (currentValue.length === 1 || (currentValue.length === 2 && currentValue.startsWith('-'))) {
    currentValue = '0';
  } else {
    // BUG: If number is negative and we're at position 2, remove the minus instead of digit!
    if (currentValue.startsWith('-') && currentValue.length > 2) {
      currentValue = currentValue.slice(0, -1);
    } else {
      currentValue = currentValue.slice(0, -1);
    }
  }
  updateDisplay();
}

function toggleNegate() {
  // BUG: Can create double negatives and weird states
  if (currentValue.startsWith('-')) {
    currentValue = currentValue.slice(1);
  } else {
    currentValue = '-' + currentValue;
  }
  updateDisplay();
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;
    
    switch (action) {
      case 'number':
        handleNumber(value);
        break;
      case 'operator':
        handleOperator(value);
        break;
      case 'equals':
        calculate();
        break;
      case 'clear':
        clearDisplay();
        break;
      case 'delete':
        deleteLastChar();
        break;
      case 'decimal':
        handleNumber('.');
        break;
      case 'negate':
        toggleNegate();
        break;
    }
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
  if (e.key === '.') handleNumber('.');
  if (e.key === '+') handleOperator('+');
  if (e.key === '-') handleOperator('-');
  if (e.key === '*') handleOperator('*');
  if (e.key === '/') handleOperator('/');
  if (e.key === 'Enter' || e.key === '=') calculate();
  if (e.key === 'Escape') clearDisplay();
  if (e.key === 'Backspace') deleteLastChar();
});

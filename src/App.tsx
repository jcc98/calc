import { useReducer } from "react"
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css"
import './App.css';

interface IACTIONS {
  ADD_DIGIT: string,
  CLEAR: string,
  DELETE_DIGIT: string,
  CHOOSE_OPERATION: string,
  EVALUATE: string
}

export const ACTIONS:IACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate"
}



interface IType {
  
  overwrite: boolean,
  currentOperand: string,
  previousOperand: string,
  operation: string,
  type: string
  payload: {
    digit: string,
    operation: string,
  }
}


function reducer(state:IType, action:any):any {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: action.payload.digit,
          overwrite: false,
        }
      }
      if (action.payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (action.payload.digit === "." && state.currentOperand?.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload.operation,
        currentOperand: null,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
  }
}

function evaluate( {currentOperand, previousOperand, operation}:{currentOperand:string, previousOperand:string, operation:string}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) { return ""}
  let computation:number = parseInt("")
  switch (operation) {
    case "+":
      computation = prev + current 
      break
    case "-":
      computation = prev - current 
      break
    case "*": 
      computation = prev * current 
      break 
    case "÷":
      computation = prev / current 
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER  = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand:string) {
  //compile error:any temporary fix
  if (operand == null) return 
    const [integer, decimal]:any = operand.split(".")
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`

  } 

function App() {


  const [state, dispatch] = useReducer(reducer, {})
  

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(state.previousOperand)} {state.operation}</div>
        <div className="current-operand">{formatOperand(state.currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
          =
      </button>
      </div>
  );
}

export default App;

/**
 * Created by mvill on 1/31/2017.
 */

var states;
var transitions;

function transitionFunction(initialState, testString) {
   var testChar  = testString.charAt(0);
   var newTestString = testString.slice(1,testString.length);
   var lastState;

   if(testString.length > 1)
       lastState = extendedFunctionTransition(transitionFunction(initialState, newTestString), testChar);
    else
        lastState =extendedFunctionTransition(initialState, newTestString);

    return lastState.stateType == "F" || lastState.stateType == "IF";
}

function getState(stateName) {
    var state;
    for(state in states) {
        if(state.stateName == stateName){
            return state;
        }
    }

    return null;
}

function extendedFunctionTransition(state, testChar) {
    var nextState = state.getNextState(testChar);
    return nextState[0];
}

function createTransition(transitionChar, originState, nextState) {
    var transition = new Transition(transitionChar, originState, nextState);
    transitions.push(transition);
}

function createState(stateName, stateType) {
    var state = new State(stateName, stateType);
    states.push(state)
}
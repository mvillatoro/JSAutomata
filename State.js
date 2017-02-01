/**
 * Created by mvill on 1/27/2017.
 */

var transitions;

function State(stateName, stateType) {
    this.stateName = stateName;
    this.stateType = stateType;
}

function getNextState(transitionChar) {
    var transition;
    var states = [];
    for (transition in transitions){
        if(transition.transitionChar == transitionChar){
            states.push(transition.nextState);
        }
    }

    return states;
}
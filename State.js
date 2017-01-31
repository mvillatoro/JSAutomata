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

    for (transition in transitions)
        if(transition.transitionChar)
            transition.push(transition.nextState);
}
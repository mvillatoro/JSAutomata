function PdaTransition(originState, input, pop, pushString, nextState, tText) {
    this.origin = originState;
    this.input = input;
    this.pop = pop;
    this.pushString = pushString;
    this.next = nextState;
    this.tText = tText;
    this.transitionId;
}


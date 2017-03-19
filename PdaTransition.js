function PdaTransition(originState, input, pop, pushString, nextState) {
    this.origin = originState;
    this.input = input;
    this.pop = pop;
    this.pushString = pushString;
    this.next = nextState;
}


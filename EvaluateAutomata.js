/**
 * Created by mvill on 2/8/2017.
 */

function evaluateDFA(testString, automata) {
    var currentNode = getInitialNode(automata.stateList);

    for(var i = 0; i < testString.length; i++){
        currentNode = getNextState(currentNode, testString.charAt(i), automata.transitionList);
        if(currentNode == null)
            return false;
    }
    return currentNode.accepted;
}

function evaluateNFA(testString, automata) {

    var currentList = getInitialNodes(automata.stateList);

    for(var  i = 0; i < testString.length; i++){
        var tempList = [];
        for(var j = 0; j < currentList.length; j++){
            var states = getNextStates(currentList[j], testString.charAt(i), automata.transitionList);
            tempList.push.apply(tempList, states);
        }

        currentList.length = 0;

        for(var l = 0; l < tempList.length; l++)
            currentList.push(tempList[l]);
    }

    for(var k = 0; k < currentList.length; k++)
        if(currentList[k].accepted)
            return true;

    return false;

}

function nfaToDfa(automata){
        
    return transitionTable(automata);

}

function evaluateNFAE(testString, automata){
    
    var currentList = [];
    currentList = getInitialNodes(automata.stateList);

    for(var  i = 0; i < testString.length; i++){
        var tempList = [];
        for(var j = 0; j < currentList.length; j++){
            var states = getNextStates(currentList[j], testString.charAt(i), automata.transitionList);
            
            var closuredStates = [];

            var nuNextStates = closure(states, automata.transitionList);


            for(var n = 0; n < nuNextStates.length; n++){
                closuredStates.push(nuNextStates[n]);
                i--;       
            }
            
            tempList.push.apply(tempList, closuredStates);
        }

        currentList.length = 0;



        for(var l = 0; l < tempList.length; l++){
            //console.log(tempList[l]);
            currentList.push(tempList[l]);
        }
            
            console.log(currentList);
    }

    for(var k = 0; k < currentList.length; k++)
        if(currentList[k].accepted)
            return true;

    return false;

}

function evaluateNFAE(str, automata) {
    var current = getInitialNodes(automata.stateList);
    current = clausura(current, automata.transitionList);

    for(c of str) {
        
        if(!current)
            return false;

        var next = [];

        for(state of current){
            var nextStates = getNextStates(state,c,automata.transitionList);
            for(ns of nextStates){
                next.push(ns);
            }
        }

        current =next;
             


        current = clausura(current, automata.transitionList);
    }

    for(state of current)
        if(state.accepted)
            return true;
            
    return false;
}

function doUnion(automataA, automataB){
    var automata = new Automata("dfa");

   return mixStates(automata, automataA, automataB);
}

function doIntersection(automataA, automataB){
    var automata = new Automata("dfa");

    return mixStates2(automata, automataA, automataB);
}

function evaluateTuring(testString, turingTape, automata){

    var breakloop = 0;

    var arrayTape = testString.split("");
    arrayTape.push("B");
    arrayTape.unshift("B");
    var newTuple = [];

    if(turingTape.length != 0 )
        var arrayTape = turingTape.split("");

    console.log("before");
    console.log(arrayTape);

    var currentState = getInitialNode(automata.stateList);

    var i = 1;

    var loop = true;
    while(loop){
        newTuple = getNextTuringState(currentState, arrayTape[i], automata.transitionList);
        
        if(newTuple != undefined){
            if(i == 0)
                arrayTape.unshift("B");
            if(i = turingTape.length)
                arrayTape.push("B");

            arrayTape[i] = newTuple[0];
            currentState = newTuple[1];

            if(newTuple[2] == 1)
                i++;
            else
                i--;

            if(currentState.accepted){
                loop = false;
            }
                

        }

        breakloop++;

        if(breakloop == 500){
            loop = false;
            alert("Loops infinitely");
        }
            
    }
    console.log("after");
    console.log(arrayTape);

    return arrayTape;

}

function doCompliment(automata){
    
    var nuAutomata = new Automata("dfa");

    toggleState(automata.stateList, nuAutomata);
    chkTransitions(automata, nuAutomata);

    return nuAutomata;
}
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

function makeMinimization(automata){

    _buildEquivalenceTable(automata);

}

function _buildEquivalenceTable(automata) {
        const equivalenceTable = {};

        const states = new Map(automata.stateList);

        const getEquivalenceSymbol = (xState, yState) => {

            var transitionX = [];
            var transitionY = [];

            for(var i = 0; i < automata.transitionList.length; i++){
                if(automata.transitionList[i].originState.stateName == xState)
                    transitionX.push(automata.transitionList[i]);
                else if (automata.transitionList[i].originState.stateName == yState)
                    transitionY.push(automata.transitionList[i]);
            }

            console.log(transitionX);
            console.log(transitionY);

            if(transitionX.length != transitionY.length){
                return "x";
            }

            for(x of transitionX){
                if(!contains(x, transitionY)) return "x";

                console.log(transitionY.nextState.stateName);

                if(x.nextState != transitionY.nextState){
                    if(equivalenceTable[x.stateName][transitionY.nextState.stateName] == "x") return "x";
                    else if(equivalenceTable[x.stateName][transitionY.nextState.stateName] == " ") return " ";
                }
            }

            return "o";
        };

    for (x of automata.stateList) {
        equivalenceTable[x.stateName] = {};
        for (y of automata.stateList) {     
            if (x.accepted || y.accepted) {
                equivalenceTable[x.stateName][y.stateName] = "x";
            } else {
                equivalenceTable[x.stateName][y.stateName] = " ";    
            }
        }
    }

    while (hasEmptySpace(equivalenceTable, automata)) {
        for (x of automata.stateList) {
            for (y of automata.stateList) {
                if (equivalenceTable[x.stateName][y.stateName] !== " ") continue;

                equivalenceTable[x.stateName][y.stateName] = getEquivalenceSymbol(x.stateName, y.stateName);
            }
        }
    }

    console.log(equivalenceTable);

}

function hasEmptySpace(equivalenceTable, automata){

    for(x of automata.stateList){
        for(y of automata.stateList){
            if(equivalenceTable[x.stateName][y.stateName] === " "){
                return true;
            }
        }
    }

    return false;

}

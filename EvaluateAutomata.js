/**
 * Created by mvill on 2/8/2017.
 */

function evaluateDFA(testString, automata) {
    var currentNode = getInitialNode(automata.stateList);

    for(var i = 0; i < testString.length; i++){
        currentNode = getNextState(currentNode, testString.charAt(i), automata.transitionList);
        if(currentNode == null)
            return false
    }
    return currentNode.accepted;
}

function evaluateNFA(testString, automata) {
    var currentList = getInitialNodes(automata.stateList);

    for(var  i = 0; i < testString.length; i++){
        var tempList = [];
        for(var j = 0; j < currentList.length; j++){
            var states = getNextStates(currentList[j], testString.charAt(i), automata.transitionList)
            tempList.push.apply(tempList, states);
        }

        currentList.length = 0;
        for(var l = 0; l < tempList.length; l++){
            currentList.push(tempList[l]);
        }
    }

    for(var k = 0; k < currentList.length; k++){

        if(currentList[k].accepted){
            return true;
        }
    }

    return false;

}

function nfaToDfa(automata){
    var alphabet = getAlphabet(automata);
    var newEdges = [];
    var nodes = [getInitialNode(automata.stateList)];

    var i = 0;

    while (i < nodes.length){
        for(var a = 0; a < alphabet.length; a++){
            var tempList = [];
            for(var it = 0; i < nodes[i].length; it++){
                var nextNodes = getNextStates(nodes[i][it], alphabet[a], automata.transitionList);
                for(var nn = 0; nn < nextNodes.length; nn++){
                    if(checkIfNodeExists(tempList, nextNodes[nn]))
                        tempList.push(nextNodes[nn]);
                }
            }

            var temp2 = checkIfListExistsAux(nodes, tempList)
            if(tempList == null && tempList.length != 0)
                nodes.push(tempList);

            var tempAuxEdges = new auxEdge();

            tempAuxEdges.transitionChar = alphabet[a];

            for(var z = 0; z <  nodes[i].length; z++)
                tempAuxEdges.originState.push(nodes[i][z]);

            if(temp2 != null)
                for(var x = 0; x < temp2.length; x++)
                    tempAuxEdges.nextState.push(temp2);
            else
                for(var y = 0; y <  tempList.length; y++)
                    tempAuxEdges.nextState.push(tempList[y]);

            if(tempAuxEdges.nextState.length != 0)
                newEdges.push(tempAuxEdges);
        }
        i++;
    }

    var returnAutomata = new Automata("dfa");
    var statesToAdd = getNewNodes(nodes, returnAutomata);
    var transitionToAdd = getNewTransitions(statesToAdd, newEdges, returnAutomata);

    for(var w = 0; w < statesToAdd.length; w++)
        returnAutomata.stateList.push(statesToAdd);

    for(var v = 0; v < transitionToAdd.length; v++)
        returnAutomata.transitionList.push(transitionToAdd);

    return returnAutomata;

}

function closure(state, transitionList){

    var closureStates = [];

    closureStates.push(state);

    for(var i = 0; i < transitionList.length; i++){
        if(transitionList[i].originState == state)
            if(transitionList[i].transitionChar == "e")
                closureStates.push(transitionList[i].nextState);
    }

    return closureStates;

}

function evaluateNFAE(testString, automata){
    
    var closureStates;
    var testState = [];
    testState.push(getInitialNode(automata.stateList));
    var nextState = [];
    //closureStates = closure(state, automata.transitionList);

    for(var i = 0; i < testString.length; i++){
        
        for(var j = 0 ; j < testState.length; j++){
            
            }
        }



        testState.length = 0;
    }

}
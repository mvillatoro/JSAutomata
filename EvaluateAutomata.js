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

function doUnion(automataA, automataB){

    var automata = new Automata("dfa");

    for(var i = 0; i < automataA.stateList.length; i++)
        for(var j = 0; j < automataB.stateList.length; j++)
            mixStates(automataA.stateList[i], automataB.stateList[j], automata);   

    



}
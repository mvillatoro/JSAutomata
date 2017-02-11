/**
 * Created by mvill on 2/8/2017.
 */

function evaluateDFA(testString, automata) {
    var currentNode = getInitialNode(automata.stateList);

    console.log("test string: " + testString);

    for(var i = 0; i < testString.length; i++){
        currentNode = getNextState(currentNode, testString.charAt(i), automata.transitionList);
        if(currentNode == null)
            return false
    }
    return currentNode.accepted;
}

function evaluateNFA(testString, automata) {
    var currentList = getInitialNode(automata.stateList);

    for(var  i = 0; i < testString.length; i++){
        var tempList = [];
        for(var j = 0; j < currentList.length; j++){
            tempList.push(getNextStates(currentList[i], testString.charAt(i), automata.transitionList));
        }
        currentList.length = 0;

        console.log(tempList);

        currentList = tempList;
    }
    for(var k = 0; k < currentList.length; k++)
        if(currentList[i].accepted)
            return true;


    return false;

}


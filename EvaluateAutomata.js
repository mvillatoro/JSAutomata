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

   return mixStates(automata, automataA, automataB);


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
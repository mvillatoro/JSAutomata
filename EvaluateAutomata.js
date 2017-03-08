/**
 * Created by mvill on 2/8/2017.
 */

function evaluateDFA(testString, automata) {
    var currentNode = getInitialNode(automata.stateList);

    for(var i = 0; i < testString.length; i++){
        currentNode = getNextState(currentNode, testString.charAt(i), automata.transitionList);
        console.log(currentNode);
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

    var transitionTable = [];
    var states = [];

    for(var i = 0; i < automata.transitionList.length; i++){
        var tr = new transitionRow();
        tr.originStateT.push(automata.transitionList[i].originState);
        tr.transitionCharT = automata.transitionList[i].transitionChar;
        tr.nextStateT.push(automata.transitionList[i].nextState);
        
        transitionTable.push(tr);
    }    


    for(var j = 0; j < automata.stateList.length; j++)
        states.push(automata.stateList[j].stateName);

    combination(states);
        
    getAlphabet(automata.transitionList);

}

function evaluateNFAE(testString, automata){

    var currentList = [];
    currentList.push(getInitialNode(automata.stateList));

    for(var i = 0; i < testString.length; i++){

        var closure = [];
        for(var j = 0; j < currentList.length; j++){
            closure.push(currentList[j]);
            closure.push.apply(closure, getClosure(currentList[j], automata.transitionList));
        }

        var tempList = [];
        for(var k = 0; k < closure.length; k++)
            tempList.push.apply(tempList, getNextStates(closure[k], testString.charAt(i), automata.transitionList));

        currentList.length = 0;
        currentList.push.apply(currentList, tempList);
    }

    for(var l = 0; l < closure.length; l++)
        if(closure[l].accepted)
            return true;

    return false;

}

function transitionRow(){
    this.originStateT = [];
    this.transitionCharT = "";
    this.nextStateT = [];
}

function combination(stateArray){
    var combi = [];
    var temp= "";
    var letLen = Math.pow(2, stateArray.length);

    for (var i = 0; i < letLen ; i++){
        temp= "";
        for (var j=0;j<stateArray.length;j++) {
            if ((i & Math.pow(2,j))){ 
                temp += stateArray[j]
            }
        }
        if (temp !== "") {
            combi.push(temp);
        }
    }

    console.log(combi.join("\n"));
}
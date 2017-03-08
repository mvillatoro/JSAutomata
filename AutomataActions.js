/**
 * Created by mvill on 2/8/2017.
 */

function getInitialNode(nodeList) {
    for(var i = 0; i < nodeList.length; i++)
        if(nodeList[i].isInitial)
            return nodeList[i];
}

function getNextState(origin, transitionChar, transitionList) {
    for(var i = 0; i < transitionList.length; i++)
        if(transitionList[i].originState.stateName == origin.stateName && transitionList[i].transitionChar == transitionChar )
            return transitionList[i].nextState;

    return null;
}

function getInitialNodes(nodeList) {
    var returnList = [];

    for(var i = 0; i < nodeList.length; i++)
        if (nodeList[i].isInitial)
            returnList.push(nodeList[i]);

    return returnList;
}

function getNextStates(origin, transitionChar, transitionList) {
    var listToReturn = [];

    for(var i = 0; i < transitionList.length; i++)
        if(transitionList[i].originState.stateName == origin.stateName && transitionList[i].transitionChar == transitionChar)
            listToReturn.push(transitionList[i].nextState);
    
    return listToReturn;
}

function getAlphabet(transitionList){

    var alphabet = [];

    for(var i = 0; i < transitionList.length; i++){
        if(!symbolExists(alphabet, transitionList[i].transitionChar))
            alphabet.push(transitionList[i].transitionChar);
    }

    console.log(alphabet);

    return alphabet;

}

function symbolExists(array, symbol){
    for(var i = 0; i < array.length; i++)
        if(array[i] == symbol)
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













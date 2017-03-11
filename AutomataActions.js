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

    return alphabet;

}

function symbolExists(array, symbol){
    for(var i = 0; i < array.length; i++)
        if(array[i] == symbol)
            return true;

    return false; 
}

function combination(stateArray){
    var combi = [];
    var temp= "";
    var letLen = Math.pow(2, stateArray.length);

    for (var i = 0; i < letLen ; i++){
        temp= "";
        for (var j=0;j<stateArray.length;j++)
            if ((i & Math.pow(2,j))) 
                temp += stateArray[j].stateName + ",";
    
        if (temp !== "")
            combi.push(temp);
    }
    return combi;
}

function transitionTable(automata){
    var newDfaAutomata = new Automata("dfa");
    var automataTable = [];
    var dfaTable = [];
    var alphabet = getAlphabet(automata.transitionList);

    for (var i = 0; i < automata.stateList.length; i++)
        automataTable.push(new DataTable(automata.stateList[i]));

    for(var j = 0; j < automataTable.length; j++)
        for(var k = 0; k < alphabet.length; k++)
            automataTable[j].tableStates.push(getNextStates(automataTable[j].tableStates[0], alphabet[k], automata.transitionList));   

    var stateCombinations = combination(automata.stateList);

    for(var l = 0; l < stateCombinations.length; l++){

        var newNode;
        var newEdge;
        var stateName = stateCombinations[l];
        stateName = stateName.slice(0,-1);
        var type = "N";
        var color = "#808080";
        var stateData = stateCombinations[l];
        var stateDataArray = stateData.split(",");

        for(var m = 0; m < stateDataArray.length; m++){
            if(stateDataArray[m] != ""){
                
                newNode = getNode(stateDataArray[m], automata);

                if(newNode.isInitial && newNode.accepted && (type == "F" || type == "I" || type == "N" ) && newNode.stateName == stateDataArray[0]){
                    type = "IF";
                    color = "#ccff66";
                }
                else if(newNode.accepted && type == "N"){
                    type = "F";
                    color = "#00ff99";
                }
                else if(newNode.isInitial && type == "N" && newNode.stateName == stateDataArray[0]){
                    type = "I";
                    color = "#66a3ff";
                }
            }
        }
        auxCreateState(newDfaAutomata, stateName, type, color);

    }
    
    console.log(stateCombinations);

    for(var n = 0; n < stateCombinations.length; n++){
        var rawStatesArray = [];
        var combinedStates = [];
        rawStates = stateCombinations[n];
        var nextCombinedStates = [];

        for(var o = 0; o < rawStates.length; o++){
            var nuState = getNode(rawStates[o], automata);
            if(nuState != null){
                rawStatesArray.push(nuState);
            }
        }

        //debugger;

        for(var p = 0; p < alphabet.length; p++){
            console.log(alphabet[p]);
            console.log(rawStatesArray);

            var mergedNextStates = [];

            for(var q = 0; q < rawStatesArray.length; q++){
                var nextStatesNames = "";
                console.log(rawStatesArray[q]);
                var nuNodes = getNode(rawStatesArray[q].stateName, newDfaAutomata);
                
                var ns = getNextStates(nuNodes, alphabet[p], automata.transitionList);
                console.log("nextStates");
                
                for(var r = 0; r < ns.length; r++)
                    nextStatesNames +=  ns[r].stateName + ",";

                mergedNextStates.push(getNode(nextStatesNames.slice(0,-1), newDfaAutomata));
            }

            //arr.push(arr.splice(arr.indexOf(6), 1)[0]);

            //mergedNextStates.push(mergedNextStates.splice(mergedNextStates.indexOf(), 1)[0]);

            console.log(mergedNextStates);

            console.log("******************************");


        }
    }

    return newDfaAutomata;
}

function DataTable(tableData){
    this.tableStates = [];
    this.tableStates.push(tableData);
}








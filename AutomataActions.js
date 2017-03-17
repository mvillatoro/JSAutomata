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

    stateCombinations = sortStateArray(stateCombinations);

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

                if(newNode.isInitial && newNode.accepted && (type == "F" || type == "I" || type == "N" ) && newNode.stateName == stateDataArray[0])
                    type = "IF";
                else if(newNode.accepted && type == "N")
                    type = "F";
                else if(newNode.isInitial && type == "N" && newNode.stateName == stateDataArray[0])
                    type = "I"; 
            }
        }
        auxCreateState(newDfaAutomata, stateName, type, color);

    }
    
    console.log(stateCombinations);

    for(var n = 0; n < stateCombinations.length; n++){

        console.log(stateCombinations[n]);

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
            var mergedNextStates = [];
            for(var q = 0; q < rawStatesArray.length; q++){
                var nextStatesNames = "";
                var nuNodes = getNode(rawStatesArray[q].stateName, newDfaAutomata);
                
                var ns = getNextStates(nuNodes, alphabet[p], automata.transitionList);
                
                for(var r = 0; r < ns.length; r++)
                    nextStatesNames +=  ns[r].stateName + ",";

                var nonRepeat = nextStatesNames.split(",");



                var stateName =  sortStateName(nextStatesNames);
                var nuState = getNode(stateName, newDfaAutomata);

                if(nuState != undefined)
                    mergedNextStates.push(nuState);
    
            }

            var tempName = "";

            for(var s = 0; s < mergedNextStates.length; s++){
                tempName += mergedNextStates[s].stateName + "," ;
            }

            tempName = sortStateName(tempName);


            //var lol = tempName;
            //var lel = removeDuplicate(lol);
            //console.log(lel);

            var fuckingFinally = removeDuplicate(tempName);

            console.log("next State");
            var trueNode = getNode(fuckingFinally, newDfaAutomata);

            var trueOriginNode =  getNode(sortStateName(stateCombinations[n]), newDfaAutomata);



            console.log(trueOriginNode);
            console.log(alphabet[p]);
            console.log(trueNode);

            if(trueOriginNode != undefined && trueNode != undefined){
                 auxCreateEdge(newDfaAutomata, alphabet[p], trueOriginNode.stateName,trueNode.stateName);
            }

           
            //auxCreateEdge(automata, transitionChar, originState, nextState)
            console.log("******************************");


        }
    }

    return newDfaAutomata;
}

function DataTable(tableData){
    this.tableStates = [];
    this.tableStates.push(tableData);
}

function sortStateArray(stateCombinations){

    var nuCombinations = [];

        for(var i = 0; i < stateCombinations.length; i++){
        var joinedStates = [];
        var stateBulk = stateCombinations[i];
        joinedStates = stateBulk.split(",");
        joinedStates.sort();
        nuCombinations[i] = joinedStates.reverse().toString();
    }

    return nuCombinations;
}

function sortStateName(stateName){

    var namesArray = [];
    var joinedNames;
    var names = stateName.slice(0,-1);
    namesArray = names.split(",");
    namesArray.sort();
    namesArray.reverse();
    joinedNames = namesArray.join();
    return joinedNames;

}

function removeDuplicate(stringArray){
    var data = stringArray.split(",");

    var unique = new Set(data);

    var unique2 = Array.from(unique);

    var auxUnique2 = unique2.join();

    var newUnique = sortStateArray(auxUnique2);
    
    console.log("fuck");
    console.log(auxUnique2);


    return auxUnique2;

}

function mixStates(automata, automataA, automataB){

    var newType;
    var newName; //stateA.stateName + stateB.stateName;



    var alphabetA = getAlphabet(automataA.transitionList);
    var alphabetB = getAlphabet(automataB.transitionList);
    
    for (var i = 0; i < automataA.stateList.length; i++){
        for (var j = 0; j < automataB.stateList.length; j++){
            
            newName = [];
            newType = "N";
            
            var nextState = [];
            var stateA = automataA.stateList[i];
            var stateB = automataB.stateList[j];

            var transitionResult = [];

            newName.push(stateA.stateName);
            newName.push(stateB.stateName); 

            //newname = newName.sort();
            newName = newName.join("");
            if(stateA.isInitial && stateB.isInitial)
                newType = "I";

            if(stateA.accepted || stateB.accepted)
                newType = "F";

            if((stateA.isInitial && stateB.isInitial) && (stateA.accepted || stateB.accepted))
                newType = "IF";

            auxCreateState(automata, newName, newType);

        }
    }

    for (var l = 0; l < automataA.stateList.length; l++){
        for (var m = 0; m < automataB.stateList.length; m++){
            
            var stateA = automataA.stateList[l];
            var stateB = automataB.stateList[m];
            
            var lol = stateA.stateName + stateB.stateName;

            var fuck = getNode(lol, automata);

            
            for(var k = 0; k < alphabetA.length; k++){
                var nextA =  getNextState(stateA, alphabetA[k], automataA.transitionList);
                var nextB =  getNextState(stateB, alphabetA[k], automataB.transitionList);
                
                var next = fuseStates(nextA, nextB, automata)
                
                console.log(stateA);
                console.log(stateB);
                
                console.log(nextA);
                console.log(nextB);
                console.log(alphabetA[k]);
                console.log(fuseStates(nextA, nextB, automata));
                console.log("*******************");
            
        //automata, transitionChar, originState, nextState
                auxCreateEdge(automata,alphabetA[k], fuck.stateName, next.stateName);
            }

            

        }
    }

    return automata;

}

function fuseStates(stateA, stateB, automata){
    var newName = []
    newName.push(stateA.stateName);
    newName.push(stateB.stateName);

    //newname = newName.sort();
    newName = newName.join("");


    console.log(newName);
    var lol = getNode(newName, automata);
    return lol;

}

function getNextTuringState(currentState, tape, transitionList){

    var newTuple = [];

    for(var i = 0; i < transitionList.length; i++){
        if(transitionList[i].origin == currentState && transitionList[i].tape == tape){
            newTuple.push(transitionList[i].newTape);
            newTuple.push(transitionList[i].next);
            if(transitionList[i].direction == "R")
                newTuple.push(1);
            else
                newTuple.push(0);
            return newTuple;
        }
    }
}

function mixStates2(automata, automataA, automataB){

    var newType;
    var newName; //stateA.stateName + stateB.stateName;



    var alphabetA = getAlphabet(automataA.transitionList);
    var alphabetB = getAlphabet(automataB.transitionList);
    
    for (var i = 0; i < automataA.stateList.length; i++){
        for (var j = 0; j < automataB.stateList.length; j++){
            
            newName = [];
            newType = "N";
            
            var nextState = [];
            var stateA = automataA.stateList[i];
            var stateB = automataB.stateList[j];

            var transitionResult = [];

            newName.push(stateA.stateName);
            newName.push(stateB.stateName); 

            //newname = newName.sort();
            newName = newName.join("");
            if(stateA.isInitial && stateB.isInitial)
                newType = "I";

            if(stateA.accepted && stateB.accepted)
                newType = "F";

            if((stateA.isInitial && stateB.isInitial) && (stateA.accepted || stateB.accepted))
                newType = "IF";

            auxCreateState(automata, newName, newType);

        }
    }

    for (var l = 0; l < automataA.stateList.length; l++){
        for (var m = 0; m < automataB.stateList.length; m++){
            
            var stateA = automataA.stateList[l];
            var stateB = automataB.stateList[m];
            
            var lol = stateA.stateName + stateB.stateName;

            var fuck = getNode(lol, automata);

            
            for(var k = 0; k < alphabetA.length; k++){
                var nextA =  getNextState(stateA, alphabetA[k], automataA.transitionList);
                var nextB =  getNextState(stateB, alphabetA[k], automataB.transitionList);
                
                var next = fuseStates(nextA, nextB, automata)
                
                console.log(stateA);
                console.log(stateB);
                
                console.log(nextA);
                console.log(nextB);
                console.log(alphabetA[k]);
                console.log(fuseStates(nextA, nextB, automata));
                console.log("*******************");
            
        //automata, transitionChar, originState, nextState
                auxCreateEdge(automata,alphabetA[k], fuck.stateName, next.stateName);
            }

            

        }
    }

    return automata;

}


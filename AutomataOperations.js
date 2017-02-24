/**
 * Created by mvill on 2/8/2017.
 */

function getInitialNode(nodeList) {
    for(var i = 0; i < nodeList.length; i++)
        if(nodeList[i].isInitial)
            return nodeList[i];

}

function getInitialNodes(nodeList) {
    var returnList = [];

    for(var i = 0; i < nodeList.length; i++)
        if (nodeList[i].isInitial)
            returnList.push(nodeList[i]);

    return returnList;
}

function getNextState(origin, transitionChar, transitionList) {
    for(var i = 0; i < transitionList.length; i++)
        if(transitionList[i].originState.stateName == origin.stateName && transitionList[i].transitionChar == transitionChar )
            return transitionList[i].nextState;

    return null;
}

function getNextStates(origin, transitionChar, transitionList) {
    var listToReturn = [];

    for(var i = 0; i < transitionList.length; i++)
        if(transitionList[i].originState.stateName == origin.stateName && transitionList[i].transitionChar == transitionChar)
            listToReturn.push(transitionList[i].nextState);
    return listToReturn;
}

function getAlphabet(automata) {
    var alphabetList = [];

    for(var i = 0; i < automata.transitionList.length; i++){
        if(isInArray(automata.transitionList[i].transitionChar, automata.transitionList) && automata.transitionList[i] != "e"){
            alphabetList.push(automata.transitionList[i].transitionChar);
        }
    }

    return alphabetList;

}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function checkIfNodeExists(list, state) {
    for(var  i = 0; i < list.length; i++)
        if(list[i].stateName == state.stateName)
            return true;

    return false;
}

function checkIfListExistsAux(list, state) {
    for(var i = 0; i < list.length; i++)
        if(checkIfListsAreEquals(list[i], state))
            return list[i];

    return null;
}

function checkIfListsAreEquals(list, state) {
    for(var i = 0; i < list.length; i++)
        if(!checkIfNodeExists(list, list[i]))
            return false;

    for(var j = 0; j < list.length; j++)
        if(!checkIfNodeExists(state, list[j]))
            return false

    return true;

}

function getNewNodes(stateList,automata) {

    var returnList = [];

    for(var i = 0; i < stateList.length; i++){
        var stateName = getNewNodeName(stateList[i]);
        var isInitial = false;
        var isFinal = false;

        isInitial = checkIfInitial(stateList[i]);

        isFinal = checkIfAccepted(stateList[i]);

        if(isInitial && isFinal)
            createState(automata, stateName, "IF", "#00ff99", "nfaDiagram");
        else if(isInitial)
            createState(automata, stateName, "I", "#66a3ff", "nfaDiagram");
        else if(isFinal)
            createState(automata, stateName, "F", "#00ff99", "nfaDiagram");
        else
            createState(automata, stateName, "N", "#808080", "nfaDiagram")

        var node = getNode(stateName, automata);

        returnList.push(node);
    }

    return returnList;
}

function getNewNodeName(list) {
    var returnName = "";

    for(var  i = 0; i < list.length; i++){
        returnName = returnName + list[i].stateName;
        if(i < list.length-1)
            returnName = returnName + ", ";
    }

    return returnName;
}

function checkIfAccepted(list) {
    for(var i = 0; i < list.length; i++)
        if(list[i].accepted)
            return true

    return false;
}

function checkIfInitial(list) {
    for(var i = 0; i < list.length; i++)
        if(list[i].isInitial)
            return true

    return false;
}

function getNewTransitions(states, transitions, automata) {

    var returnList = [];

    var tc;
    var os;
    var ns;

    for(var i = 0; i < transitions.length; i++){
        tc = transitions[i].transitionChar;
        os = getNodeByName(getNewNodeName(transitions[i].originState), states);
        ns = getNodeByName(getNewNodeName(transitions[i].nextState), states);

        createEdge(automata, tc, os, ns, "nfaDiagram")

        var newEdge = getTransition(automata, tc, os, ns);

        if( newEdge != null)
            returnList.push(newEdge);
    }

    return returnList;
}

function getTransition(automata, tc, os, ns) {

    for(var i = 0; i < automata.transitionList.length; i++){
        if(automata.transitionList[i].transitionChar == tc
            && automata.transitionList[i].originState == os
              && automata.transitionList[i].nextState == ns)
            return automata.transitionList[i];
    }

    return null;

}

function getNodeByName(name, nodes) {
    for(var i = 0; i < nodes.length; i++)
        if(nodes[i].stateName == name)
            return nodes[i];

    return null;
}

function getClosure(state, transitionList, closureList) {

    var nextStates = getNextStates(state, "e", transitionList);
    var newList = [];

    for(var j = 0; j < closureList.length; j++){
        console.log(closureList[j]);
        newList.push(closureList[j]);
    }
/*
    for(var i = 0; i < nextStates.length; i++){
        if(!checkIfNodeExists(newList, nextStates[i])){
            newList.push(nextStates[i]);

            var newNewList = [];
            newNewList = getClosure(nextStates[i], transitionList, newList);

            for(var k = 0; k < newNewList.length; k++)
                newList.push(newNewList[k]);
        }
    }
*/
    console.log("********************");
    return newList;

}
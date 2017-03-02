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
            return false;

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


}

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

function combineAlphabet(automataA, automataB) {

    var toReturn = [];
    var alphabetA = getAlphabet(automataA);
    var alphabetB = getAlphabet(automataB);

    for(var i = 0; i < alphabetA.length; i++)
        if(!contains.call(toReturn, alphabetA[i]))
            toReturn.push(alphabetA[i]);

    for(var j = 0; j < alphabetB.length; j++)
        if(!contains.call(toReturn, alphabetB[j]))
            toReturn.push(alphabetB[j]);

    return toReturn;

}

function newSimpleStates(nodes, operation, automata,divId) {

    var returnList = [];

    for(var i = 0; i < nodes.length; i++){

        var newName = getNewNodeName(nodes[i]);
        var initial;
        var accept;

        if(nodes[i].side == 2)
            if(nodes[0].isInitial && nodes[nodes.length-1].isInitial)
                initial = true;

        if(operation =="Union"){
            for(var j = 0; j < nodes[i].length; j++){
                if(nodes[i][j].accepted)
                    accept = true;
            }
        }else if(operation == "Intersection"){
            nodes[i].accepted = true;

            for(var k = 0; k < nodes[i].length; k++){
                if(!nodes[i][k].accepted)
                    accept = false;
            }
        }
        else if(operation == "Complement"){
            if(nodes[i].size == 2){
                if(nodes[0].accepted && !nodes[nodes.length-1].accepted)
                    accept = false;
            }
        }
        autoState(automata, newName, initial,accept, divId);
    }

    return returnList;

}

function autoState(automata, stateName, initial, accept, divId) {

    if(accept)
        createState(automata, stateName,"F", "#00ff99", divId); //FINAL
    else if(initial)
        createState(automata, stateName,"I", "#66a3ff", divId); //INITIAL
    else
        createState(automata, stateName,"N", "#808080", divId); //NORMAL
}

function newSimpleEdges(nodes, edges, automata, divId) {

    for(var i = 0; i < edges.length; i++){
        var transitionChar = edges[i].transitionChar;
        var origin = getNodeByName(getNewNodeName(edges[i].originState, nodes));
        var next = getNodeByName(getNewNodeName(edges[i].nextState, nodes));

        createEdge(automata, transitionChar, origin, next, divId);
    }
}

function index(el) {
    var children = el.parentNode.childNodes,
        i = 0;
    for (; i < children.length; i++) {
        if (children[i] == el) {
            return i;
        }
    }
    return -1;
}


/*
function automataOperation(automataA, automataB, operation, divId) {

    var initialNodeA = getInitialNode(automataA.stateList);
    var initialNodeB = getInitialNode(automataB.stateList);
    var alphabet = combineAlphabet(automataA,automataB);

    var nodes = [];
    nodes.push(initialNodeA);
    nodes.push(initialNodeB);

    var newEdges = [];

    for(var i = 0; i < nodes.size; i++){
        for(var j = 0; j < alphabet.size; j++){
            var tempList = [];
            for(var k = 0; k < nodes[i].length;k++){
                var nextNode;
                if(index(nodes[i][k]) % 2 == 0)
                    nextNode = getNextState(nodes[i][k], alphabet[j], automataA.transitionList);
                else
                    nextNode = getNextState(nodes[i][k], alphabet[j], automataB.transitionList);
            }

            if(nextNode!= null)
                tempList.push(nextNode);
        }

        var temp2 = checkIfListExistsAux(nodes, tempList);
        if(temp2 == null && tempList.length != 0)
            nodes.push(tempList);

        var transitionChar = alphabet[j];
        var originNodes  = nodes[i];
        var nextNodes;

        if(temp2 != null)
            nextNodes = temp2;
        else
            nextNodes = tempList;

        var newEdge = new Transition(originNodes, nextNodes, transitionChar);
        newEdges.push(newEdge);

    }

    var newAutomata = new Automata("dfa");

    var autoNodes = newSimpleStates(nodes, operation, newAutomata, divId);
    var autoEdges = newSimpleEdges(autoNodes, newEdges, newAutomata, divId);

    return newAutomata;
    
}
*/





















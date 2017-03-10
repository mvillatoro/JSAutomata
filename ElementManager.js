/**
 * Created by mvill on 2/9/2017.
 */

function auxCreateState(defineAutomata, stateName, type, color){
    createState(defineAutomata, stateName, type, color);
}

function createState(automata, stateName, stateType, color) {

    var stateId = (Math.random() * 1e7).toString(32);

    if(stateType == "IF")
        craftNode(stateName, stateId, color, automata, true, true);
    else if(stateType == "I")
        craftNode(stateName, stateId, color, automata, true, false);
    else if(stateType == "N")
        craftNode(stateName, stateId, color, automata, false, false);
    else if(stateType == "F")
            craftNode(stateName, stateId, color, automata, false, true);

}

function craftNode(stateName, stateId, color, automata, isInitial, isFinal) {
    var newState;
    if(!stateExist(stateName, automata)){
        newState = new State(stateName, isInitial, isFinal, stateId);
        automata.stateList.push(newState);

        addNode(stateId, stateName, color, automata);

        callSnackbar("State " + newState.stateName + " created");
    }else
        callSnackbar("State " + stateName + " already exists...");
}

function addNode(stateId, stateName, color, automata) {

    automata.nodes.add({id:stateId, label:stateName, color: {background:color, border:'black'}});
    automata.nodeIds.push(stateId);

    init(automata);
}

function auxCreateEdge(automata, transitionChar, originState, nextState){
    createEdge(automata, transitionChar, originState, nextState);
}

function createEdge(automata, transitionChar, originState, nextState) {
    var transitionId = (Math.random() * 1e7).toString(32);

    var origin = getNode(originState, automata);
    var next = getNode(nextState, automata);

    if(origin != null && next != null){

        if(document.getElementsByName('automataR')[0].checked){
            if(!edgeExists(origin, next, transitionChar, automata) && !dfaTransitionChar(origin, transitionChar, automata))
                craftEdge(automata, transitionId, origin, next, transitionChar);
            else
                callSnackbar("Transition already exists.");
        }

    else if(document.getElementsByName('automataR')[1].checked){
        if(!edgeExists(origin, next, transitionChar, automata))
            craftEdge(automata, transitionId, origin, next, transitionChar);
        else
            callSnackbar("Transition already exists.");
    }

    }else
        alert("State does not exists");
}

function craftEdge(automata, transitionId, originState, nextState, transitionChar) {
    var newEdge;

    newEdge = new Transition(originState, nextState, transitionChar);
    automata.transitionList.push(newEdge);
    addNewEdge(automata, transitionId, originState, nextState, transitionChar);
    callSnackbar("Transition " + transitionChar + ", " + originState.stateName, + ", " + nextState.stateName)

}
    
function addNewEdge(automata, transitionId, originState, nextState, transitionChar) {   
    automata.edges.push({
        id: transitionId,
        from: originState.stateId,
        to: nextState.stateId,
        label: transitionChar,
        color:{color:'rgba(30,30,30,0.2)', highlight:'blue'},
        arrows:'to'
    });
    init(automata);
}

function init(automata) {
    
    var container = document.getElementById('automataDiagram');
           
    var data = {
        nodes: automata.nodes,
        edges: automata.edges
    };
    var options = {};
    automata.network = new vis.Network(container, data, options);
}

function stateExist(stateName, automata) {
    for(var i = 0; i < automata.stateList.length; i++){
        if(automata.stateList[i].stateName == stateName){
            return true;
        }
    }
    return false;
}

function edgeExists(originState, nextState, transitionChar, automata) {
    for(var i = 0; i < automata.transitionList.length; i++)
        if(automata.transitionList[i].originState == originState && automata.transitionList[i].nextState == nextState && automata.transitionList[i].transitionChar == transitionChar)
            return true;

    return false;
}

function dfaTransitionChar(originState, transitionChar, automata) {
    for(var i = 0; i < automata.transitionList.length; i++)
        if(automata.transitionList[i].originState == originState  && automata.transitionList[i].transitionChar == transitionChar)
            return true;

    return false;
}

function getNode(nodeName, automata) {
    for(var i = 0; i< automata.stateList.length; i++)
        if(automata.stateList[i].stateName == nodeName)
            return automata.stateList[i];
}
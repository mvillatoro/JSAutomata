/**
 * Created by mvill on 2/9/2017.
 */

function createState(automata, stateName, stateType, color, divId) {

    var stateId = (Math.random() * 1e7).toString(32);

    if(stateType == "IF")
        craftNode(stateName, stateId, color, automata, divId, true, true);
    else if(stateType == "I")
        craftNode(stateName, stateId, color, automata, divId, true, false);
    else if(stateType == "N")
        craftNode(stateName, stateId, color, automata, divId, false, false);
    else if(stateType == "F")
            craftNode(stateName, stateId, color, automata, divId, false, true);

    }

function createEdge(automata, transitionChar, originState, nextState, divId) {
    var transitionId = (Math.random() * 1e7).toString(32);

    var origin = getNode(originState, automata);
    var next = getNode(nextState, automata);


    if(origin != null && next != null){
        if(divId == "dfaDiagram"){
            if(!edgeExists(origin, next, transitionChar, automata) && !dfaTransitionChar(origin, transitionChar, automata)){
                craftEdge(automata, transitionId, origin, next, transitionChar, divId);
            }else
                callSnackbar("Transition already exists.");
        }else if(divId == "nfaDiagram"){
            if(!edgeExists(origin, next, transitionChar, automata))
                craftEdge(automata, transitionId, origin, next, transitionChar, divId);
            else
                callSnackbar("Transition already exists.");
        }
    }
}    
    
function craftNode(stateName, stateId, color, automata, divId, isInitial, isFinal) {
    var newState;
    if(!stateExist(stateName, automata)){
        newState = new State(stateName, isInitial, isFinal, stateId);
        automata.stateList.push(newState);

        addNode(stateId, stateName, color, automata, divId);

        callSnackbar("State " + newState.stateName + " created");
    } else
        callSnackbar("State " + stateName + " already exists...");
}

function craftEdge(automata, transitionId, originState, nextState, transitionChar, divId) {
    var newEdge;

    newEdge = new Transition(originState, nextState, transitionChar);
    automata.transitionList.push(newEdge);
    addEde(automata, transitionId, originState, nextState, transitionChar, divId);
    callSnackbar("Transition " + transitionChar + ", " + originState.stateName, + ", " + nextState.stateName)

}

function addNode(stateId, stateName, color, automata, divId) {
    automata.nodes.add({id:stateId, label:stateName, color: {background:color, border:'black'}});
    automata.nodeIds.push(stateId);

    init(divId,automata);
}

function addEde(automata, transitionId, originState, nextState, transitionChar, divId) {
    automata.edges.push({
        id: transitionId,
        from: originState.stateId,
        to: nextState.stateId,
        label: transitionChar,
        color:{color:'rgba(30,30,30,0.2)', highlight:'blue'},
        arrows:'to'
    });
    init(divId,automata);
}

function init(divId, automata) {
    var container;

    switch(divId) {
        case "dfaDiagram":
            container = document.getElementById('dfaDiagram');
            break;
        case "nfaDiagram":
            container = document.getElementById('nfaDiagram');
            break;
        default:
            console.log("no pos guau...");
    }
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
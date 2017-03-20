/**
 * Created by mvill on 2/9/2017.
 */

function auxCreateState(automata, stateName, type){

    if(type == "IF")
        createState(automata, stateName, type, "#ccff66");
    else if(type == "F")
        createState(automata, stateName, type, "#00ff99");
    else if(type == "I")
        createState(automata, stateName, type, "#66a3ff");
    else if(type == "N")
        createState(automata, stateName, type, "#808080");

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

function createTuringEdge(originState, tape, newTape, direction, nextState, automata){
    //"Origin, Tape, New Tape, Direction, Next"
    var transitionId = (Math.random() * 1e7).toString(32);
    var origin = getNode(originState, automata);
    var next = getNode(nextState, automata);

    if(origin != null && next != null){
        if(!turingEdgeExists(origin, tape, newTape, direction, next, automata))
            craftTuringEdge(origin, tape, newTape, direction, next, automata, transitionId);
        else
            callSnackbar("Transition already exists.");
    }else
        alert("State does not exists");

}

function createPdaEdge(originState, input, pop, push, nextState, automata){
    var origin = getNode(originState, automata);
    var next = getNode(nextState, automata);
    var pushString = push.split("");
    var tText = input + "," + pop + "/" +  push; 
    var newEdge = new PdaTransition(origin, input, pop, pushString, next, tText);

    if(origin != null && next != null){
        if(!pdaEdgeExists(newEdge, automata))
            craftPdaEdge(newEdge, automata);
        else
            callSnackbar("Transition already exists.");
    }else
        alert("State does not exists");
}

function craftPdaEdge(newEdge, automata){

    var transitionId = (Math.random() * 1e7).toString(32);
    newEdge.transitionId = transitionId;            

    automata.transitionList.push(newEdge);

    addNewPdaEdge(newEdge, automata);
    callSnackbar("Transition " + newEdge.tText + "," + newEdge.origin.stateName + ", " + newEdge.next.stateName);

}

function compareEnds(edgeA, edgeB){
    if( edgeA.from == edgeB.origin.stateId)
        if(edgeA.to == edgeB.next.stateId)
            return true;
    
    return false;
}

function craftTuringEdge(originState, tape, newTape, direction, nextState, automata, transitionId){
    var newEdge;
    newEdge = new TuringTransition(originState, tape, newTape, direction, nextState);
    automata.transitionList.push(newEdge);

    var arrow;

    if(direction == "R")
        arrow = "→";
    else if(direction == "L")
        arrow = "←";

    var transitionText = tape + " /" + newTape + "," + arrow;
    addNewTuringEdge(automata, transitionId, originState, nextState, transitionText);
    callSnackbar("Transition " + transitionText + "," + originState.stateName + ", " + nextState.stateName);

}

function addNewPdaEdge(newEdge, automata){

    automata.edges.push({
        id: newEdge.transitionId, 
        from: newEdge.origin.stateId,
        to: newEdge.next.stateId,
        title: newEdge.tText,
        color:{color:'rgba(30,30,30,0.2)', highlight:'blue'},
        arrows:'to'         
        });

    init(automata);
}

function addNewTuringEdge(automata, transitionId, originState, nextState, transitionText){
    automata.edges.push({
        id: transitionId,
        from: originState.stateId,
        to: nextState.stateId,
        label: transitionText,
        color:{color:'rgba(30,30,30,0.2)', highlight:'blue'},
        arrows:'to' 
    });

    init(automata);
}

function turingEdgeExists(origin, tape, newTape, direction, next, automata){
    
    var newEdge = new TuringTransition(origin, tape, newTape, direction, next);

    for(var i = 0; i < automata.transitionList.length; i++)
        if(newEdge === automata.transitionList[i])
            return true;

    return false;
}

function pdaEdgeExists(newEdge, automata){
    if(automata.transitionList.length == 0)
        return false;
    else
        for(var i = 0; i < automata.transitionList.length; i++)
            if(comparePdaEdges(newEdge, automata.transitionList[i]) == true)
                return true;
        
    return false;
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
    callSnackbar("Transition " + transitionChar + ", " + originState.stateName + ", " + nextState.stateName)

}
    
function addNewEdge(automata, transitionId, originState, nextState, transitionChar) {   
    automata.edges.push({
        id: transitionId,
        from: originState.stateId,
        to: nextState.stateId,
        label: transitionChar,
        font: {align: 'top'},
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

function getPdaEdge(newEdge, automata){
    var edge = new PdaTransition(originState, input, pop, pushString, nextState, tText);

    for(var i = 0; i < automata.transitionList.length; i++)
        if(edge == automata.transitionList[i])
            return automata.transitionList[i];

    return null;
}

function comparePdaEdges(edgeA, edgeB){ 
    if(edgeA.origin.stateName == edgeB.origin.stateName)
        if(edgeA.input == edgeB.input)
            if(edgeA.pop == edgeB.pop)
                if(compareArrays(edgeA.pushString, edgeB.pushString))
                    if(edgeA.next.stateName == edgeB.next.stateName)
                        return true;

    return false;


}

function compareArrays(array1, array2){

    if(array1.length != array2.length)
        return false;

    for(var i = 0; i < array1.length; i++)
            if(array1[i] != array2[i])
                return false;   

    return true;
}

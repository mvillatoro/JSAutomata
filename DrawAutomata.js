/**
 * Created by mvill on 1/27/2017.
 */

var states = [10];
var transitions = [10];

//region Objects

function State(name, type) {
    this.stateName = name;
    this.stateType = type;
}

function Transition(transitionChar, originState, nextState) {
    this.transitionChar = transitionChar;
    this.originState = originState;
    this.nextState = nextState;
}

//endregion

//region Create functions

function createNewState(stateName) {
    var initial = document.getElementById("initial").checked;
    var final = document.getElementById("final").checked;
    var normal = document.getElementById("normal").checked;

    if(initial && final){
        createState(stateName,"IF");
    }
    else if(final){
        createState(stateName,"F");
    }
    else if(initial){
        createState(stateName,"I");
    }
    else if(normal){
        createState(stateName,"N");
    }
}

function createState(stateName, stateType) {
    var newState = new State(stateName, stateType);
    var text = "State " + stateName + " created";

    if(!stateExist(stateName)){
        states.push(newState);
        callSnackbar(text);
    }else
        callSnackbar("State " + stateName + " already exists...");
}

function createNewTransition(transitionData) {

    var dataArray = transitionData.split(",");
    var originState = getState(dataArray[1]);

    var nextState = getState(dataArray[2]);

    createTransition(dataArray[0], originState, nextState)

}

function createTransition(transitionChar, originState, nextState)   {
    if(originState != null &&  nextState != null){
        if(stateExist(originState.stateName) && stateExist(nextState.stateName)){
            var transition = new Transition(transitionChar, originState, nextState);
            transitions.push(transition);
            callSnackbar("Char: " + transitionChar + " Origin: " + originState.stateName + " Next: " + nextState.stateName);
        }
    }else{
        callSnackbar("Invalid input");
    }
}

//endregion



function transitionFunction(initialState, testString) {
    var testChar = testString.charAt(0);
    var lastState;

    if (testString.length > 1) {
        var newTestString =  testString.slice(1,testString.length);
        lastState = extendedFunctionTransition(transitionFunction(initialState, newTestString), testChar);
    }else
    {
        lastState =extendedFunctionTransition(initialState, testChar);
    }

    if(lastState != null)
        return lastState.stateType == "F" || lastState.stateType == "IF";
    else
        return false;
}

function extendedFunctionTransition(state, testChar) {
    var nextState = getNextState(state, testChar);

    console.log(nextState);

    if(nextState!= null)
        return nextState[1];
    else
        return null;
}




function getState(stateName) {
    for(var i = 1; i < states.length; i++)
        if(states[i].stateName == stateName)
            return states[i];
}

function getNextState(state, transitionChar) {
    var nextStates = [];

    for(var i = 1; i< transitions.length; i++){
         if(transitions[i].originState.stateName == state.stateName && transitions[i].transitionChar == transitionChar){
             if(transitions[i].nextState != null)
                nextStates.push(transitions[i].nextState);
         }
    }

    console.log(nextStates);

    return nextStates;
}

function acceptsString(testString) {
    var accept = transitionFunction(states[1], testString);

    if(accept)
        alert("String was accepted :D");
    else
        alert("The string was NOT accepted :(")
}


/*
function drawState(color) {
    var $ = go.GraphObject.make;

    myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
            {
                initialContentAlignment: go.Spot.LeftCenter,
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                "clickCreatingTool.archetypeNodeData": { text: "node" },
                "clickCreatingTool.isDoubleClick": false,
                "undoManager.isEnabled": true
            });

    // define the Node template
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            new go.Binding("location", "loc", go
                .Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, "Circle",
                {
                    parameter1: 20,  // the corner has a large radius
                    fill: $(go.Brush, "Linear", { 0: color, 1: "rgb(255, 255, 255)" }),
                    portId: "",  // this Shape is the Node's port, not the whole Node
                    fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: false,
                    toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: false,
                    cursor: "pointer"
                }),
            $(go.TextBlock,
                {
                    font: "bold 15pt helvetica, bold arial, sans-serif",
                    editable: true  // editing the text automatically updates the model data
                },
                new go.Binding("text").makeTwoWay())
        );


    // unlike the normal selection Adornment, this one includes a Button
    myDiagram.nodeTemplate.selectionAdornmentTemplate =

        // replace the default Link template in the linkTemplateMap
        myDiagram.linkTemplate =
            $(go.Link,  // the whole link panel
                {
                    curve: go.Link.Bezier, adjusting: go.Link.Stretch,
                    reshapable: true, relinkableFrom: true, relinkableTo: true,
                    toShortLength: 3
                },
                new go.Binding("points").makeTwoWay(),
                new go.Binding("curviness"),
                $(go.Shape,  // the link shape
                    { strokeWidth: 1.5 }),
                $(go.Shape,  // the arrowhead
                    { toArrow: "standard", stroke: null }),
                $(go.Panel, "Auto",
                    $(go.Shape,  // the label background, which becomes transparent around the edges
                        {
                            fill: $(go.Brush, "Radial",
                                { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
                            stroke: null
                        }),
                    $(go.TextBlock, "X",  // the label text
                        {
                            textAlign: "center",
                            font: "20pt helvetica, arial, sans-serif",
                            margin: 4,
                            editable: true  // enable in-place editing
                        },
                        // editing the text automatically updates the model data
                        new go.Binding("text").makeTwoWay())
                )
            );
}
*/

function callSnackbar(displayText) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    document.getElementById("snackbar").innerHTML = displayText;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function load(evt) {
    //myDiagram.model = go.Model.fromJson(document.getElementById("jsonFile").value);
}

function save(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function stateExist(stateName) {
    for(var i = 1; i < states.length; i++)
        if(states[i].stateName == stateName)
            return true;

    return false;
}


function printStates() {

    for (var i = 1; i < states.length; i++) {
        console.log(states[i].stateName);
        console.log(states[i].stateType);
    }
}


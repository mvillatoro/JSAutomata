/**
 * Created by mvill on 1/27/2017.
 */

    var automata;

function createNewState(stateName) {
    var initial = document.getElementById("initial").checked;
    var final = document.getElementById("final").checked;
    var normal = document.getElementById("normal").checked;

    if(initial && final){
        automata.createState(stateName,"IF");
        alert("state name: " + stateName + "-IF")
    }
    else if(final){
        automata.createState(stateName,"F");
        alert("state name: " + stateName + "-IF")
    }
    else if(initial){
        automata.createState(stateName,"I");
        alert("state name: " + stateName + "-IF")
    }
    else if(normal){
        automata.createState(stateName,"N");
        alert("state name: " + stateName + "-IF")
    }
}

function createNewTransition(transitionData) {
    var dataArray = transitionData.split(",");

    var originState = automata.getState(dataArray[1]);
    var nextState = automata.getState(dataArray[2]);

    automata.createTransition(dataArray[0, originState, nextState])
}

function acceptsString(testString) {
    var accept = transitionFunction(automata.states[0], testString);

    if(accept)
        alert("String was accepted :D");
    else
        alert("The string was NOT accepted :(")
}

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

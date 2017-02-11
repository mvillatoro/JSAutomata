/**
 * Created by mvill on 2/8/2017.
 */



function Automata(type) {
    this.nodes = new vis.DataSet();
    this.transitionList = [];
    this.stateList = [];
    this.network = null;
    this.nodeIds = [];
    this.edges = [];
    this.type = type;
}

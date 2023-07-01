import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { DijkstraSnippet } from "../algorithms/dijkstras snippet";

import "../Components/visualizer.css";

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      isStartNodeSelected: false,
      isFinishNodeSelected: false,
      isDraggingStartNode: false,
      isModalOpen: false,
    };
  }

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const { grid, isStartNodeSelected, isFinishNodeSelected } = this.state;
    const newGrid = grid.slice();

    if (isStartNodeSelected) {
      this.resetStartNode(newGrid);
      this.setStartNode(newGrid, row, col);
      this.setState({
        grid: newGrid,
        isStartNodeSelected: false,
        isDraggingStartNode: true,
      });
    } else if (isFinishNodeSelected) {
      this.resetFinishNode(newGrid);
      this.setFinishNode(newGrid, row, col);
      this.setState({ grid: newGrid, isFinishNodeSelected: false });
    } else {
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isWall: !node.isWall,
      };
      newGrid[row][col] = newNode;
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const {
      grid,
      isStartNodeSelected,
      isFinishNodeSelected,
      isDraggingStartNode,
    } = this.state;
    const newGrid = grid.slice();

    if (isStartNodeSelected) {
      this.resetStartNode(newGrid);
      this.setStartNode(newGrid, row, col);
      this.setState({ grid: newGrid });
    } else if (isFinishNodeSelected) {
      this.resetFinishNode(newGrid);
      this.setFinishNode(newGrid, row, col);
      this.setState({ grid: newGrid });
    } else if (isDraggingStartNode) {
      this.resetStartNode(newGrid);
      this.setStartNode(newGrid, row, col);
      this.setState({ grid: newGrid });
    } else {
      const node = newGrid[row][col];
      const newNode = {
        ...node,
        isWall: !node.isWall,
      };
      newGrid[row][col] = newNode;
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false, isDraggingStartNode: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = this.getStartNode(grid);
    const finishNode = this.getFinishNode(grid);

    if (!finishNode) {
      alert("Finish node is not set.");
      return;
    }

    // maze generation

    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);

    if (!visitedNodesInOrder.includes(finishNode)) {
      alert("Finish node is not reachable.");
      return;
    }

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  resetGrid() {
    const grid = this.state.grid.slice();
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const node = grid[row][col];
        const resetNode = {
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          isWall: false,
        };

        if (node.isStart) {
          resetNode.isStart = true;
        }

        if (node.isFinish) {
          resetNode.isFinish = true;
        }

        grid[row][col] = resetNode;
        const nodeElement = document.getElementById(`node-${row}-${col}`);
        nodeElement.className = "node";
      }
    }
    this.setState({ grid });
  }

  createStartNode() {
    this.setState({ isStartNodeSelected: true });
  }

  createFinishNode() {
    this.setState({ isFinishNodeSelected: true });
  }

  setStartNode(grid, row, col) {
    const node = grid[row][col];
    const newNode = {
      ...node,
      isStart: true,
    };
    grid[row][col] = newNode;
  }

  resetStartNode(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const node = grid[row][col];
        if (node.isStart) {
          const resetNode = {
            ...node,
            isStart: false,
          };
          grid[row][col] = resetNode;
          return;
        }
      }
    }
  }

  generateMaze() {
    const { grid } = this.state;
    const newGrid = grid.slice();
    const walls = getMazeWalls(newGrid);
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      const { row, col } = wall;
      newGrid[row][col].isWall = true;
    }
    this.setState({ grid: newGrid });
  }

  getStartNode(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const node = grid[row][col];
        if (node.isStart) {
          return node;
        }
      }
    }
    return null;
  }

  setFinishNode(grid, row, col) {
    const node = grid[row][col];
    const newNode = {
      ...node,
      isFinish: true,
    };
    grid[row][col] = newNode;
  }

  resetFinishNode(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const node = grid[row][col];
        if (node.isFinish) {
          const resetNode = {
            ...node,
            isFinish: false,
          };
          grid[row][col] = resetNode;
          return;
        }
      }
    }
  }

  getFinishNode(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const node = grid[row][col];
        if (node.isFinish) {
          return node;
        }
      }
    }
    return null;
  }

 
  

  render() {
    const { grid, mouseIsPressed} = this.state;

    return (
      <>
        <nav
          className="navbar bg-dark border-bottom border-bottom-dark"
          data-bs-theme="dark"
        >
          <div className="container-md">
            <a className="navbar-brand" href="/" aria-disabled>
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <span className="h3">Pathfinder </span>
                    <span className="h5">- using Dijkstra's algorith</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </nav>

        <ul className="nav justify-content-center mt-4 mb-5">
          <li className="nav-item">
            <button
              className="btn btn-sm btn-outline-light mx-2"
              onClick={() => this.resetGrid()}
            >
              Clear Grid
            </button>
          </li>
          
          <li className="nav-item">
            <button
              className="btn btn btn-outline-light mx-2"
              onClick={() => this.createStartNode()}
            >
              Select Start Node
            </button>
          </li>
          <li className="nav-item">
            
            <button
              className="btn btn btn-outline-light mx-2"
              onClick={() => this.visualizeDijkstra()}
            >
              Visualize Dijkstra's Algorithm
            </button>
          </li>
          <li className="nav-item">
            <button
              className="btn btn btn-outline-light mx-2"
              onClick={() => this.createFinishNode()}
            >
              Select Finish Node
            </button>
          </li>
          <li className="nav-item">
          <button
              className="btn btn-sm btn-outline-light mx-2"
              onClick={() => this.generateMaze()}
            >
              Generate Maze
            </button>
          </li>
          
          
        </ul>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;

                  // Add "node-start" class to the start node
                  const nodeClassName = `node ${isStart ? "node-start" : ""} ${
                    isFinish ? "node-finish" : ""
                  } ${isWall ? "node-wall" : ""}`;

                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                      className={nodeClassName}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}

        {/* Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header dark-body">
                <h5 className="modal-title text-light" id="exampleModalLabel">
                  Dijkstra's algorithm
                </h5>
                <button
                  type="button"
                  className="btn-close btn btn-dark"
                  data-bs-dismiss="modal"
                  aria-label="Close"

                ></button>
              </div>
              <div className="modal-body dark-body text-light">
                Dijkstra's algorithm, named after Dutch computer scientist
                Edsger W. Dijkstra, is a popular and efficient algorithm for
                finding the shortest path between nodes in a graph. It operates
                by maintaining a priority queue of nodes and iteratively
                exploring the nodes with the lowest distances. Starting from a
                source node, it gradually expands its search to neighboring
                nodes, updating their distances if a shorter path is found. This
                process continues until the algorithm reaches the destination
                node or has explored all reachable nodes. With its ability to
                handle non-negative edge weights and guarantee the shortest
                path, Dijkstra's algorithm finds extensive applications in
                various domains such as network routing, GPS navigation, and
                resource allocation. Its elegant design and effectiveness make
                it a fundamental tool in graph theory and algorithmic
                problem-solving.
              </div>
              <div className="modal-footer dark-body">
                <button
                  className="btn btn-dark"
                  data-bs-target="#exampleModalToggle2"
                  data-bs-toggle="modal"
                >
                  Implementation
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="exampleModalToggle2"
          tabIndex="-1"
          aria-labelledby="exampleModalLabelToggle2"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-left">
            <div className="modal-content dark-body">
              <div className="modal-header dark-body">
                <h5 className="modal-title text-light" id="exampleModalLabelToggle2">
                  Implementaion
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-left text-danger ">
                <code>
                  <DijkstraSnippet />
                </code>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-dark"
                  data-bs-target="#exampleModal"
                  data-bs-toggle="modal"
                >
                  Dijkstra's algorithm
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          className="btn btn-lg btn-outline-secondary mt-4"
          data-bs-target="#exampleModal"
          data-bs-toggle="modal"
        >
          About Dijkstra's algorithm
        </button>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 80; row++) {
    const currentRow = [];
    for (let col = 0; col < 30; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === 25 && col === 14,
    isFinish: row === 55 && col === 14,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
const getAllNodes = (grid) => {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

const getMazeWalls = (grid) => {
  const walls = [];
  const nodes = getAllNodes(grid);

  // Example: Custom maze walls
  const mazeWalls = [
    // Vertical walls

    { startRow: 1, startCol: 4, endRow: 9, endCol: 4 },
    { startRow: 10, startCol: 4, endRow: 16, endCol: 4 },
    { startRow: 18, startCol: 4, endRow: 27, endCol: 4 },
    { startRow: 29, startCol: 4, endRow: 38, endCol: 4 },
    { startRow: 39, startCol: 4, endRow: 47, endCol: 4 },
    { startRow: 49, startCol: 4, endRow: 58, endCol: 4 },
    { startRow: 59, startCol: 4, endRow: 67, endCol: 4 },
    { startRow: 69, startCol: 4, endRow: 78, endCol: 4 },

    { startRow: 1, startCol: 9, endRow: 8, endCol: 9 },
    { startRow: 10, startCol: 9, endRow: 17, endCol: 9 },
    { startRow: 18, startCol: 9, endRow: 28, endCol: 9 },
    { startRow: 29, startCol: 9, endRow: 37, endCol: 9 },
    { startRow: 39, startCol: 9, endRow: 48, endCol: 9 },
    { startRow: 49, startCol: 9, endRow: 57, endCol: 9 },
    { startRow: 59, startCol: 9, endRow: 68, endCol: 9 },
    { startRow: 69, startCol: 9, endRow: 77, endCol: 9 },

    { startRow: 1, startCol: 15, endRow: 8, endCol: 15 },
    { startRow: 10, startCol: 15, endRow: 16, endCol: 15 },
    { startRow: 18, startCol: 15, endRow: 27, endCol: 15 },
    { startRow: 29, startCol: 15, endRow: 37, endCol: 15 },
    { startRow: 39, startCol: 15, endRow: 47, endCol: 15 },
    { startRow: 49, startCol: 15, endRow: 58, endCol: 15 },
    { startRow: 59, startCol: 15, endRow: 67, endCol: 15 },
    { startRow: 69, startCol: 15, endRow: 77, endCol: 15 },

    { startRow: 1, startCol: 20, endRow: 8, endCol: 20 },
    { startRow: 10, startCol: 20, endRow: 17, endCol: 20 },
    { startRow: 18, startCol: 20, endRow: 28, endCol: 20 },
    { startRow: 29, startCol: 20, endRow: 37, endCol: 20 },
    { startRow: 39, startCol: 20, endRow: 47, endCol: 20 },
    { startRow: 49, startCol: 20, endRow: 57, endCol: 20 },
    { startRow: 59, startCol: 20, endRow: 69, endCol: 20 },
    { startRow: 69, startCol: 20, endRow: 77, endCol: 20 },

    { startRow: 1, startCol: 25, endRow: 9, endCol: 25 },
    { startRow: 10, startCol: 25, endRow: 16, endCol: 25 },
    { startRow: 18, startCol: 25, endRow: 27, endCol: 25 },
    { startRow: 29, startCol: 25, endRow: 38, endCol: 25 },
    { startRow: 39, startCol: 25, endRow: 47, endCol: 25 },
    { startRow: 49, startCol: 25, endRow: 57, endCol: 25 },
    { startRow: 59, startCol: 25, endRow: 67, endCol: 25 },
    { startRow: 69, startCol: 25, endRow: 77, endCol: 25 },

    // Horizontal walls

    { startRow: 4, startCol: 1, endRow: 4, endCol: 5 },
    { startRow: 4, startCol: 7, endRow: 4, endCol: 12 },
    { startRow: 4, startCol: 13, endRow: 4, endCol: 17 },
    { startRow: 4, startCol: 19, endRow: 4, endCol: 21 },
    { startRow: 4, startCol: 23, endRow: 4, endCol: 29 },

    { startRow: 11, startCol: 0, endRow: 11, endCol: 5 },
    { startRow: 11, startCol: 7, endRow: 11, endCol: 11 },
    { startRow: 11, startCol: 13, endRow: 11, endCol: 18 },
    { startRow: 11, startCol: 19, endRow: 11, endCol: 21 },
    { startRow: 11, startCol: 23, endRow: 11, endCol: 28 },

    { startRow: 21, startCol: 0, endRow: 21, endCol: 2 },
    { startRow: 21, startCol: 5, endRow: 21, endCol: 11 },
    { startRow: 21, startCol: 13, endRow: 21, endCol: 17 },
    { startRow: 21, startCol: 19, endRow: 21, endCol: 22 },
    { startRow: 21, startCol: 23, endRow: 21, endCol: 28 },

    { startRow: 33, startCol: 1, endRow: 33, endCol: 6 },
    { startRow: 33, startCol: 7, endRow: 33, endCol: 11 },
    { startRow: 33, startCol: 13, endRow: 33, endCol: 17 },
    { startRow: 33, startCol: 19, endRow: 33, endCol: 21 },
    { startRow: 33, startCol: 23, endRow: 33, endCol: 28 },

    { startRow: 41, startCol: 1, endRow: 41, endCol: 5 },
    { startRow: 41, startCol: 7, endRow: 41, endCol: 12 },
    { startRow: 41, startCol: 13, endRow: 41, endCol: 17 },
    { startRow: 41, startCol: 19, endRow: 41, endCol: 21 },
    { startRow: 41, startCol: 23, endRow: 41, endCol: 29 },

    { startRow: 53, startCol: 0, endRow: 53, endCol: 5 },
    { startRow: 53, startCol: 7, endRow: 53, endCol: 11 },
    { startRow: 53, startCol: 13, endRow: 53, endCol: 18 },
    { startRow: 53, startCol: 19, endRow: 53, endCol: 21 },
    { startRow: 53, startCol: 23, endRow: 53, endCol: 28 },

    { startRow: 64, startCol: 1, endRow: 64, endCol: 5 },
    { startRow: 64, startCol: 7, endRow: 64, endCol: 11 },
    { startRow: 64, startCol: 12, endRow: 64, endCol: 17 },
    { startRow: 64, startCol: 19, endRow: 64, endCol: 21 },
    { startRow: 64, startCol: 23, endRow: 64, endCol: 28 },

    { startRow: 70, startCol: 1, endRow: 70, endCol: 6 },
    { startRow: 70, startCol: 7, endRow: 70, endCol: 11 },
    { startRow: 70, startCol: 13, endRow: 70, endCol: 17 },
    { startRow: 70, startCol: 18, endRow: 70, endCol: 21 },
    { startRow: 70, startCol: 23, endRow: 70, endCol: 29 },

    { startRow: 75, startCol: 1, endRow: 75, endCol: 5 },
    { startRow: 75, startCol: 7, endRow: 75, endCol: 12 },
    { startRow: 75, startCol: 13, endRow: 75, endCol: 17 },
    { startRow: 75, startCol: 19, endRow: 75, endCol: 21 },
    { startRow: 75, startCol: 22, endRow: 75, endCol: 28 },
    10,
  ];

  for (const node of nodes) {
    if (node.isStart || node.isFinish) {
      continue; // Skip start and finish nodes
    }

    // Check if the node is part of any maze wall
    for (const mazeWall of mazeWalls) {
      const { startRow, startCol, endRow, endCol } = mazeWall;
      if (
        node.row >= startRow &&
        node.row <= endRow &&
        node.col >= startCol &&
        node.col <= endCol
      ) {
        walls.push(node);
        node.isWall = true; // Set the isWall property to true
        break;
      }
    }
  }

  return walls;
};

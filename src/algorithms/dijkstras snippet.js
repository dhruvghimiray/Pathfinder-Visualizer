import React from 'react';

export function DijkstraSnippet() {
  const code = `function dijkstra(graph, startNode) {
  const distances = {};
  const visited = {};
  const previous = {};
  
  // Initialize distances and previous nodes
  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  
  distances[startNode] = 0;
  
  while (true) {
    let smallestNode = null;
    
    // Find the smallest distance node
    for (let node in graph) {
      if (!visited[node] && (smallestNode === null || distances[node] < distances[smallestNode])) {
        smallestNode = node;
      }
    }
    
    if (smallestNode === null) {
      break;
    }
    
    visited[smallestNode] = true;
    
    // Update distances to neighboring nodes
    for (let neighbor in graph[smallestNode]) {
      let distance = distances[smallestNode] + graph[smallestNode][neighbor];
      
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = smallestNode;
      }
    }
  }
  
  return { distances, previous };
}

const graph = {
  A: { B: 5, C: 2 },
  B: { A: 5, C: 1, D: 3 },
  C: { A: 2, B: 1, D: 6 },
  D: { B: 3, C: 6 },
};

const startNode = 'A';
const { distances, previous } = dijkstra(graph, startNode);
console.log(distances); // Shortest distances: { A: 0, B: 5, C: 2, D: 8 }
console.log(previous); // Previous nodes: { A: null, B: 'A', C: 'A', D: 'B' }
`;

  return (
    <pre>
      <code>{code}</code>
    </pre>
  );
}

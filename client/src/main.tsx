import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const origRemoveChild = Node.prototype.removeChild;
Node.prototype.removeChild = function <T extends Node>(child: T): T {
  if (child.parentNode !== this) {
    if (console && console.warn) {
      console.warn("Cannot remove a child from a different parent", child, this);
    }
    return child;
  }
  return origRemoveChild.call(this, child) as T;
};

const origInsertBefore = Node.prototype.insertBefore;
Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
  if (referenceNode && referenceNode.parentNode !== this) {
    if (console && console.warn) {
      console.warn("Cannot insert before a reference node from a different parent", referenceNode, this);
    }
    return newNode;
  }
  return origInsertBefore.call(this, newNode, referenceNode) as T;
};

createRoot(document.getElementById("root")!).render(<App />);

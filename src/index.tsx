import { createRoot } from "react-dom/client";
import PharmRef from "./App";
import { ErrorBoundary } from "./components";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <PharmRef />
  </ErrorBoundary>,
);

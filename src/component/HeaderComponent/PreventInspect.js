import { useEffect } from "react";

const PreventInspect = () => {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    // Disable specific key combinations
    const handleKeyDown = (event) => {
      // Prevent F12
      if (event.key === "F12") {
        event.preventDefault();
      }

      // Prevent Ctrl+Shift+I (Inspect)
      if (event.ctrlKey && event.shiftKey && event.key === "I") {
        event.preventDefault();
      }

      // Prevent Ctrl+Shift+C (Inspect)
      if (event.ctrlKey && event.shiftKey && event.key === "C") {
        event.preventDefault();
      }

      // Prevent Ctrl+Shift+J (Console)
      if (event.ctrlKey && event.shiftKey && event.key === "J") {
        event.preventDefault();
      }

      // Prevent Ctrl+U (View Source)
      if (event.ctrlKey && event.key === "U") {
        event.preventDefault();
      }
    };

    // Prevent dragging for img, canvas, and svg
    const handleDragStart = (event) => {
      const target = event.target;
      if (
        target.tagName === "IMG" ||
        target.tagName === "CANVAS" ||
        target.tagName === "SVG"
      ) {
        event.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PreventInspect;

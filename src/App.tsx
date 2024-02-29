import { useEffect, useRef, useState } from "react";
import "./App.css";
import WebViewer from "@pdftron/webviewer";

function App() {
  const viewerDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    WebViewer(
      {
        path: "lib",
        initialDoc: "blank-Pdf.pdf",
        licenseKey:
          "demo:1708915436701:7f5048510300000000b3048899a6ad6f12681330b31c25e4316c754802",
      },
      viewerDiv.current as HTMLDivElement
    ).then((instance) => {
      // Enable the tools to edit the PDF content
      instance.UI.enableFeatures([instance.UI.Feature.ContentEdit]);
    });
  }, []);

  return (
    <>
      <div className="w-full h-screen" ref={viewerDiv}></div>
    </>
  );
}

export default App;

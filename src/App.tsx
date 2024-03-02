import { useEffect, useRef, useState } from "react";
import "./App.css";
import WebViewer from "@pdftron/webviewer";
import * as PDFNet from "@pdftron/pdfnet-node";

function App() {
  const viewerDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    WebViewer(
      {
        path: "lib",
        initialDoc: "blank-Pdf.pdf",
        licenseKey:
          "demo:1708915436701:7f5048510300000000b3048899a6ad6f12681330b31c25e4316c754802",
        fullAPI: true,
      },
      viewerDiv.current as HTMLDivElement,
    ).then((instance) => {
      // Move the enableFeatures call inside the then block
      instance.UI.enableFeatures([instance.UI.Feature.ContentEdit]);

      const { documentViewer, annotationManager } = instance.Core;

      documentViewer.addEventListener("documentLoaded", async () => {
        const doc = documentViewer.getDocument();
        const xfdfString = await annotationManager.exportAnnotations();
        const options = { xfdfString };
        const data = await doc.getFileData(options);
        const arr = new Uint8Array(data);
        const blob = new Blob([arr], { type: "application/pdf" });

        // Convert the Blob to a FormData object
        const formData = new FormData();
        // Change "pdf" to "file" to match the expected key on the server
        formData.append("file", blob, "filename.pdf");

        fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.blob())
          .then((blob) => {
            // Create a URL for the blob
            const url = URL.createObjectURL(blob);
            // Load the URL into the WebViewer
            instance.UI.loadDocument(url, {extension: 'pdf'});
          })
          .catch((error) => {
            console.error("Error sending PDF:", error);
          });
      });
    });
  }, []);

  return (
    <>
      <div className="w-full h-screen" ref={viewerDiv}></div>
    </>
  );
}

export default App;

import { useEffect, useRef } from "react";
import "./App.css";
import WebViewer from "@pdftron/webviewer";

function Summary({ summary }) {
  return (
    <div className="summary p-4 rounded shadow flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Summary</h2>
      <div className="w-full bg-gray-200 rounded p-4">{summary}</div>
    </div>
  );
}
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
      instance.UI.enableFeatures([instance.UI.Feature.ContentEdit]);

      const { documentViewer } = instance.Core;

      const handleDocumentLoaded = async () => {
        const { annotationManager } = instance.Core;
        const doc = documentViewer.getDocument();
        const xfdfString = await annotationManager.exportAnnotations();
        const options = { xfdfString };
        const data = await doc.getFileData(options);
        const arr = new Uint8Array(data);
        const blob = new Blob([arr], { type: "application/pdf" });

        const formData = new FormData();
        formData.append("file", blob, "filename.pdf");

        fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            instance.UI.loadDocument(url, { extension: "pdf" });
          })
          .catch((error) => {
            console.error("Error sending PDF:", error);
          });

        instance.Core.documentViewer.removeEventListener(
          "documentLoaded",
          handleDocumentLoaded,
        );
      };

      documentViewer.addEventListener("documentLoaded", handleDocumentLoaded);

      return () => {
        instance.Core.documentViewer.removeEventListener(
          "documentLoaded",
          handleDocumentLoaded,
        );
      };
    });
  }, []);

  let summary = "hello there";

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow" ref={viewerDiv}></div>
      <Summary summary={summary} />
    </div>
  );
}

export default App;

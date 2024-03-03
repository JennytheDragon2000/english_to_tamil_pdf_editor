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

function removeWatermark(data) {}

function App() {
  const viewerDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    WebViewer(
      {
        path: "lib",
        initialDoc: "blank-Pdf.pdf",
        licenseKey: "LYH6Q-RNN9O-KW676-KTZ7H-RTXUH",
        fullAPI: true,
      },
      viewerDiv.current as HTMLDivElement,
    ).then((instance) => {
      instance.UI.enableFeatures([instance.UI.Feature.SideBySideView]);
      instance.UI.enableElements(["multiViewerSaveDocumentButton"]);
      instance.UI.enableFeatures([instance.UI.Feature.ContentEdit]);
      instance.UI.enableFeatures([instance.UI.Feature.FilePicker]);
      instance.Core.annotationManager.enableRedaction();

      instance.UI.setHeaderItems((header) => {
        header.push({
          type: "actionButton",
          img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
          onClick: async () => {
            // Get the current document
            const doc = instance.Core.documentViewer.getDocument();
            // Get the document data as an ArrayBuffer
            const data = await doc.getFileData();

            // Convert the ArrayBuffer to a Blob
            const blob = new Blob([data], { type: "application/pdf" });

            // Create form data and append the blob
            const formData = new FormData();
            formData.append("pdf", blob, "filename.pdf");

            // Send the PDF to the server
            fetch("http://127.0.0.1:5000/remove-watermark", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.blob())
              .then((blob) => {
                // Create an object URL for the Blob
                const url = URL.createObjectURL(blob);
                // Create a temporary anchor element
                const link = document.createElement("a");
                link.href = url;
                link.download = "no_watermark.pdf"; // Set the desired filename
                // Append the anchor element to the body
                document.body.appendChild(link);
                // Programmatically click the anchor element to start the download
                link.click();
                // Remove the anchor element from the body
                document.body.removeChild(link);
              })
              .catch((error) => console.error("Error:", error));
          },
        });
      });

      const { documentViewer } = instance.Core;

      // const handleDocumentLoaded = async () => {
      //   const { annotationManager } = instance.Core;
      //   const doc = documentViewer.getDocument();
      //   const xfdfString = await annotationManager.exportAnnotations();
      //   const options = { xfdfString };
      //   const data = await doc.getFileData(options);
      //   const arr = new Uint8Array(data);
      //   const blob = new Blob([arr], { type: "application/pdf" });
      //
      //   const formData = new FormData();
      //   formData.append("file", blob, "filename.pdf");
      //
      //   fetch("http://127.0.0.1:5000/upload", {
      //     method: "POST",
      //     body: formData,
      //   })
      //     .then((response) => response.blob())
      //     .then((blob) => {
      //       const url = URL.createObjectURL(blob);
      //       instance.UI.loadDocument(url, { extension: "pdf" });
      //     })
      //     .catch((error) => {
      //       console.error("Error sending PDF:", error);
      //     });
      //
      //   instance.Core.documentViewer.removeEventListener(
      //     "documentLoaded",
      //     handleDocumentLoaded,
      //   );
      // };
      //
      // documentViewer.addEventListener("documentLoaded", handleDocumentLoaded);

      // return () => {
      //   instance.Core.documentViewer.removeEventListener(
      //     "documentLoaded",
      //     handleDocumentLoaded,
      //   );
      // };
    });
  }, []);

  let summary = "hello there";

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow " ref={viewerDiv}></div>
      <Summary summary={summary} />
    </div>
  );
}

export default App;

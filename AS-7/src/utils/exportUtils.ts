import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';

export function exportToZip(codeMap: Record<string, string>) {
  const zip = new JSZip();
  
  Object.entries(codeMap).forEach(([filename, code]) => {
    zip.file(filename, code);
  });

  zip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, 'uml-java-src.zip');
  });
}

export function exportToPng(element: HTMLElement) {
  toPng(element, { backgroundColor: '#0f172a' })
    .then((dataUrl) => {
      saveAs(dataUrl, 'uml-diagram.png');
    })
    .catch((err) => {
      console.error('Failed to export PNG', err);
    });
}

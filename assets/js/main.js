const form = document.getElementById('offer-form');
const titleInput = document.getElementById('offer-title');
const recipientInput = document.getElementById('offer-recipient');
const textInput = document.getElementById('offer-text');
const imageInput = document.getElementById('offer-image');
const generateButton = document.getElementById('generate-pdf');
const downloadLink = document.getElementById('download-link');
const statusNode = document.getElementById('status');
const previewBox = document.getElementById('preview-box');

let imageDataUrl = '';
let generatedBlobUrl = '';

const setStatus = (message, isError = false) => {
  statusNode.textContent = message;
  statusNode.style.color = isError ? '#b42318' : '#1344a2';
};

const setDownloadState = (enabled) => {
  downloadLink.classList.toggle('disabled', !enabled);
  downloadLink.setAttribute('aria-disabled', String(!enabled));
};

const sanitizeFilename = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'oferta';

imageInput.addEventListener('change', () => {
  const [file] = imageInput.files || [];

  if (!file) {
    imageDataUrl = '';
    previewBox.innerHTML = '<p>Po dodaniu pliku zobaczysz tutaj podgląd.</p>';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    imageDataUrl = String(reader.result || '');
    previewBox.innerHTML = `<img src="${imageDataUrl}" alt="Podgląd wybranego obrazka" />`;
  };
  reader.readAsDataURL(file);
});

generateButton.addEventListener('click', async () => {
  if (!form.reportValidity()) {
    setStatus('Uzupełnij wymagane pola przed wygenerowaniem PDF.', true);
    return;
  }

  if (!window.jspdf?.jsPDF) {
    setStatus('Nie udało się załadować biblioteki PDF. Odśwież stronę i spróbuj ponownie.', true);
    return;
  }

  try {
    setStatus('Trwa generowanie PDF...');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    let y = margin;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(titleInput.value.trim(), margin, y);
    y += 10;

    if (recipientInput.value.trim()) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Dla: ${recipientInput.value.trim()}`, margin, y);
      y += 8;
    }

    doc.setDrawColor(220, 228, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(11);
    const textLines = doc.splitTextToSize(textInput.value.trim(), pageWidth - margin * 2);

    textLines.forEach((line) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 6;
    });

    if (imageDataUrl) {
      const imageProps = doc.getImageProperties(imageDataUrl);
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = 80;
      const ratio = Math.min(maxWidth / imageProps.width, maxHeight / imageProps.height);
      const renderWidth = imageProps.width * ratio;
      const renderHeight = imageProps.height * ratio;

      if (y + renderHeight + 6 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.text('Załączony obrazek:', margin, y);
      y += 4;
      doc.addImage(imageDataUrl, imageProps.fileType || 'JPEG', margin, y, renderWidth, renderHeight);
    }

    const blob = doc.output('blob');

    if (generatedBlobUrl) {
      URL.revokeObjectURL(generatedBlobUrl);
    }

    generatedBlobUrl = URL.createObjectURL(blob);
    const filename = `${sanitizeFilename(titleInput.value)}.pdf`;
    downloadLink.href = generatedBlobUrl;
    downloadLink.download = filename;
    setDownloadState(true);
    setStatus(`PDF gotowy. Kliknij „Pobierz PDF”, aby zapisać plik ${filename}.`);
  } catch (error) {
    console.error(error);
    setDownloadState(false);
    setStatus('Wystąpił błąd podczas tworzenia PDF.', true);
  }
});

setDownloadState(false);

import html2canvas from 'html2canvas';

export async function captureAndDownload(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${filename}.png`;
    link.click();
  } catch (err) {
    console.error('Failed to capture image', err);
  }
}

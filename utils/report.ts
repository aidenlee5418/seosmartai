
export function openReportPDF(payload: any) {
  try {
    localStorage.setItem('seo-agent-report', JSON.stringify(payload || {}));
    const w = window.open('/utils/export-report.html', '_blank');
    if (!w) alert('Please allow popups to view report.');
  } catch (e) {
    console.error(e);
  }
}

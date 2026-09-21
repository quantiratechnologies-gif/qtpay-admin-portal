export interface CsvColumn<T> {
  label: string;
  value: (row: T) => string | number | undefined | null;
}

export function exportCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]): boolean {
  try {
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      columns.map((c) => esc(c.label)).join(","),
      ...rows.map((r) => columns.map((c) => esc(c.value(r))).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (err) {
    console.error("Export CSV error:", err);
    return false;
  }
}

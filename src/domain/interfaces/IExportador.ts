export interface IExportador<T> {
  exportar(datos: T[]): string;
  readonly extension: string;
  readonly mimeType: string;
}
export default function convertBytesToGb(bytes: number) {
  if (bytes === 0) return 0;
  return Math.floor(bytes / (1024 * 1024 * 1024));
}

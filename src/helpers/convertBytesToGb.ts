export default function convertBytesToGb(bytes: number) {
  return Math.floor(bytes / (1024 * 1024 * 1024));
}

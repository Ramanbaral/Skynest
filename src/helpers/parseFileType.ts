export default function parseFileType(fileType: string): string {
  let type = "Unknown";
  if (fileType.startsWith("image")) {
    type = "Image";
  } else if (fileType.endsWith("pdf")) {
    type = "PDF";
  } else if (fileType === "folder") {
    type = "Folder";
  }
  return type;
}

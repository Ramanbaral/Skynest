import { Progress } from "@/components/ui/progress";

export default function StorageInfo() {
  return (
    <div className="fixed bottom-1 mx-10 mt-2 bg-accent p-2 rounded-md">
      <p className="m-1 text-sm">Storage (33% full)</p>
      <Progress value={33} />
      <p className="text-[12px] text-secondary-foreground">
        300 MB of 1 GB used
      </p>
    </div>
  );
}

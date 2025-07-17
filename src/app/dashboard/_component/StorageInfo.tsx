"use client";

import { Progress } from "@/components/ui/progress";
import convertBytesToGb from "@/helpers/convertBytesToGb";
import convertBytesToMb from "@/helpers/convertBytesToMb";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function StorageInfo() {
  const { userId } = useAuth();

  const [fetchingStorageInfo, setFetchingStorageInfo] = useState(true);
  const [storageUsedPercentage, setStorageUsedPercentage] = useState(0);
  const [storageUsedInMB, setStorageUsedInMB] = useState("0");
  const [storageCapacityInGB, setStorageCapacityInGB] = useState("0");

  const fetchUserStorageInfo = async () => {
    try {
      setFetchingStorageInfo(true);
      const storageInfo = await axios.get<{
        storageInfo: {
          id: string;
          userId: string;
          storageUsed: number;
          storageCapacity: number;
          storageUsedPercentage: number;
        };
      }>(`/api/storage-info/${userId}`);
      setStorageUsedPercentage(storageInfo.data.storageInfo.storageUsedPercentage);
      setStorageUsedInMB(convertBytesToMb(storageInfo.data.storageInfo.storageUsed));
      setStorageCapacityInGB(
        convertBytesToGb(storageInfo.data.storageInfo.storageCapacity).toString(),
      );
      console.log(storageInfo.data.storageInfo.storageUsed);
      setFetchingStorageInfo(false);
    } catch {
      toast.error("Something Went Wrong!");
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchUserStorageInfo();
  }, [userId]);
  return (
    <div
      className={`fixed bottom-1 mx-10 mt-2 bg-accent p-2 rounded-md ${fetchingStorageInfo ? "hidden" : ""}`}
    >
      <p className="m-1 text-sm">Storage ({storageUsedPercentage}% Used)</p>
      <Progress value={storageUsedPercentage} />
      <p className="text-[12px] text-secondary-foreground">
        {storageUsedInMB} MB of {storageCapacityInGB} GB used
      </p>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FloorFilterProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  buildingId?: string;
  onBuildingChange: (value: string | undefined) => void;
}

export function FloorFilter({
  keyword,
  onKeywordChange,
  buildingId,
  onBuildingChange,
}: FloorFilterProps) {
  return (
    <div className="flex flex-1 items-center gap-4">
      <div className="relative max-w-sm w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm tầng..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={buildingId || "all"} onValueChange={(val) => onBuildingChange(val === "all" || !val ? undefined : val)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tất cả tòa nhà">
            {buildingId === "1" ? "PBMS Landmark 81" : buildingId === "2" ? "PBMS Bitexco" : "Tất cả tòa nhà"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả tòa nhà</SelectItem>
          {/* Mock data for now, ideally fetched from API */}
          <SelectItem value="1">PBMS Landmark 81</SelectItem>
          <SelectItem value="2">PBMS Bitexco</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

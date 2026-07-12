import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth.store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ROLE_LABELS, Role } from "@/constants/role";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDialog({ isOpen, onClose }: ProfileDialogProps) {
  const { user } = useAuthStore();

  const getRoleLabel = (role: string | undefined) => {
    if (!role) return "";
    return ROLE_LABELS[role as Role] || role;
  };

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return "";
    return status === "ACTIVE" ? "Hoạt động" : "Bị khóa";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hồ sơ cá nhân</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input id="username" value={user?.username || ""} readOnly disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input id="fullName" value={user?.fullName || ""} readOnly disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input id="phoneNumber" value={user?.phoneNumber || ""} readOnly disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Vai trò</Label>
            <Input id="role" value={getRoleLabel(user?.role)} readOnly disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Input id="status" value={getStatusLabel(user?.status)} readOnly disabled />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// components/forms/floor-form.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { floorSchema, type FloorFormValues } from "@/schemas/floor.schema";
import { floorService } from "@/services/floor.service";
import type { Floor } from "@/features/floors/types/floor.type";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface FloorFormProps {
    isOpen: boolean;
    onClose: () => void;
    floorData?: Floor | null;
}

export function FloorForm({ isOpen, onClose, floorData }: FloorFormProps) {
    const queryClient = useQueryClient();
    const isEdit = !!floorData;

    const form = useForm<FloorFormValues>({
        resolver: zodResolver(floorSchema),
        defaultValues: {
            floorName: "",
            floorLevel: 0,
            capacity: 0,
            buildingId: 0,
            vehicleTypeId: 0,
        },
    });

    // Tự động điền dữ liệu khi mở form ở chế độ Sửa
    useEffect(() => {
        if (floorData) {
            form.reset({
                floorName: floorData.floorName,
                floorLevel: floorData.floorLevel,
                capacity: floorData.capacity,
                buildingId: floorData.buildingId,
                vehicleTypeId: floorData.vehicleTypeId,
            });
        } else {
            form.reset({ floorName: "", floorLevel: 0, capacity: 0, buildingId: 0, vehicleTypeId: 0 });
        }
    }, [floorData, form, isOpen]);

    const mutation = useMutation({
        mutationFn: (data: FloorFormValues) => {
            return isEdit
                ? floorService.update(floorData.id, data)
                : floorService.create(data);
        },
        onSuccess: () => {
            toast.success(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
            queryClient.invalidateQueries({ queryKey: ["floors"] });
            onClose();
        },
        onError: (error) => {
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối.");
            console.error(error);
        },
    });

    const onSubmit = (data: FloorFormValues) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Cập nhật thông tin tầng" : "Thêm tầng mới"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="floorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên tầng</FormLabel>
                                    <FormControl><Input placeholder="VD: Tầng hầm B1" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="floorLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cấp độ (Level)</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sức chứa</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="buildingId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ID Tòa nhà</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vehicleTypeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ID Loại xe</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Đang xử lý..." : "Lưu thay đổi"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
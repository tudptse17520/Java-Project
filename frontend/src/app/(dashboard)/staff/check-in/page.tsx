"use client";

import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { CheckInForm } from '@/features/sessions/components/check-in-form';
import { Car, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckInPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Check-in Xe vào bãi" 
        description="Ghi nhận thông tin xe vào cổng và tạo lượt gửi xe mới." 
      />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Car className="h-5 w-5 text-emerald-600" />
                Thông tin xe vào
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <CheckInForm />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Vị trí trống (Gợi ý)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {Array.from({ length: 24 }).map((_, i) => {
                  const isOccupied = Math.random() > 0.6;
                  if (isOccupied) return null;
                  return (
                    <div 
                      key={i} 
                      className="flex flex-col items-center justify-center p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400 cursor-pointer hover:bg-emerald-100 transition-colors"
                      title="Nhấn để điền vào form"
                    >
                      <span className="text-xs font-bold">A-{i + 1}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                * Đây là danh sách các vị trí đang trống tại Tầng 1. Bạn có thể hướng dẫn khách hàng di chuyển đến các vị trí này.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

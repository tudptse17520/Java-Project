import { Metadata } from "next";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { CheckOutForm } from "@/features/sessions/components/check-out-form";

export const metadata: Metadata = {
  title: "Check-out Xe Ra | PBMS",
  description: "Xử lý xe ra bãi và thanh toán",
};

export default function CheckOutPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Quản lý Check-out"
        description="Tra cứu lượt gửi xe, xác thực biển số và thanh toán phí trước khi xe ra bãi."
      />
      <div className="mt-6">
        <CheckOutForm />
      </div>
    </PageContainer>
  );
}

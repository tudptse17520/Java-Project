import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { CheckInForm } from '@/features/sessions/components/check-in-form';

export default function CheckInPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Check-in Xe vào bãi" 
        description="Ghi nhận thông tin xe nhập cảnh để tạo lượt gửi xe mới." 
      />
      <div className="max-w-2xl mt-6">
        <CheckInForm onSuccess={() => {}} />
      </div>
    </PageContainer>
  );
}

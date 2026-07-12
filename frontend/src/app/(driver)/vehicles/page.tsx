import { PageContainer } from "@/components/common/page-container";
import { VehicleRegistrationForm } from "@/features/vehicles/components/vehicle-registration-form";

export default function VehiclesPage() {
  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-2xl mt-8">
        <VehicleRegistrationForm />
      </div>
    </PageContainer>
  );
}

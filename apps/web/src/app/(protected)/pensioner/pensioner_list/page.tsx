import RoleGuard from "@/components/guards/RoleGuard";
import { DashboardView } from "@/modules/admin/dashboard";
import PensionerMasterList from "@/modules/pensionerLIst/views/pensionerMasterList";

export default function AccessControlPage() {
    return (
        <RoleGuard roles={["BRANCH","ADMIN"]}>
            <PensionerMasterList />
        </RoleGuard>
    );
}
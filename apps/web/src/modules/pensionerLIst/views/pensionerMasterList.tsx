'use client';
import Modal from "@/components/common/ModalHeader";
import { useDisclosure } from "@/hooks/useDisclosure";
import {  formatDateApiName,type PensionerSchemaType,UpdatePensionerSchemaType} from "@repo/shared";
import { useState } from "react";
import PensionerAddModal from "../components/modal/addPensioner";
import SweetAlert from "@/lib/alerts/alert";
import { useCreatePensioner, useGetPensioner } from "../hooks/usePensionerList";
import { useDebounce } from "@/hooks/useDebounce";
import { Table, TableColumn } from "@/components/common/Table";



export default function PensionerMasterList(){
    const userModal = useDisclosure();
    const [selectedTransaction, setSelectedTransaction] = useState<UpdatePensionerSchemaType | null>(null);
    const { mutateAsync: createPensioner } = useCreatePensioner();
    const [userPage, setUserPage] = useState(1);
    const [userLimit, setUserLimit] = useState(10);
    const [userSearch, setUserSearch] = useState("");
    const debouncedSearch = useDebounce(userSearch, 500);

    const openModal = () => {
        userModal.open();
        setSelectedTransaction(null);
    }

    const closeModal = () => {
        userModal.close();
        setSelectedTransaction(null);
    }

      async function handleCreatePensioner(data: PensionerSchemaType){
      try{
          await createPensioner(data);
           SweetAlert.successAlert('Success',"update successfully");
          userModal.close();
      }
      catch(error){
        console.log(`error ${error}`);
      }
    }

    function handleUserSearchChange(value: string) {
        setUserSearch(value);
        setUserPage(1);
    }

    function handleUserLimitChange(limit: number) {
        setUserLimit(limit);
        setUserPage(1);
    }

    
        const pensionerQuery = useGetPensioner({
            page: userPage,
            limit: userLimit,
            search: debouncedSearch,
        });

         const pensioner_data = pensionerQuery.data?.data ?? [];

            const columns: TableColumn<UpdatePensionerSchemaType>[] = [
                {
                    key: "firstName",
                    header: "Firstname",
                    render: (user) => user.firstName,
                },
                {
                    key: "lastName",
                    header: "Lastname",
                    render: (user) => user.lastName,
                },
                {
                    key: "legacyPensionerId",
                    header: "Age",
                    render: (user) => user.legacyPensionerId ?? "-",
                },
                {
                    key: "actualPension",
                    header: "Actual Pension",
                    render: (user) => user.actualPension,
                },
                {
                    key: "contingencyDate",
                    header: "Contingency Date",
                    render: (user) => formatDateApiName(user.contingencyDate),
                },
                {
                    key: "bankName",
                    header: "Bank Name",
                    render: (user) => user.bankName,
                },
                    {
                    key: "birthDate",
                    header:"Birth Date",
                    render: (user) => formatDateApiName(user.birthDate),
                },
            ];
        

    return(
                <div className="p-8">
  
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                    <h1 className="text-xl font-semibold text-slate-900">
                        Pensioners
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage pensioner information and records.
                    </p>
                    </div>

                    <button
                    type="button"
                    onClick={openModal}
                    className="
                        inline-flex items-center justify-center
                        self-start
                        rounded-lg bg-emerald-600
                        px-5 py-2.5
                        text-sm font-semibold text-white
                        shadow-sm
                        transition
                        hover:bg-emerald-700
                        focus:outline-none
                        focus:ring-2
                        focus:ring-emerald-500
                        focus:ring-offset-2
                        sm:self-auto
                    "
                    >
                    Add New Pensioner
                    </button>
                </div>


                <Table<UpdatePensionerSchemaType>
                    columns={columns}
                    data={pensioner_data}
                    isLoading={pensionerQuery.isLoading}
                    search={userSearch}
                    onSearchChange={handleUserSearchChange}
                    searchPlaceholder="Search pensioners..."
                    limit={userLimit}
                    onLimitChange={handleUserLimitChange}
                    limitOptions={[5, 10, 25, 50, 100]}
                    pagination={pensionerQuery.data?.pagination}
                    onPageChange={setUserPage}
                    emptyMessage="No pensioners found."
                    rowKey={(user) => user.id}
                />

                <Modal
                    onClose={closeModal}
                    isOpen={userModal.isOpen}
                    title="Add New Pensioner"
                    size="lg">

                    <PensionerAddModal onCreate={handleCreatePensioner} />
                </Modal>
                </div>
    );
}
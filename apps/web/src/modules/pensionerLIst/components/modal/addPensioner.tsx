'use client';


import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PensionerSchema,type PensionerSchemaType,UpdatePensionerSchemaType} from "@repo/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/common/FormInput";




interface props{
    onCreate?: (data: PensionerSchemaType) => void;
    onUpdate?: (data: UpdatePensionerSchemaType) => void;
    mode?: "add" | "edit";
    pensionerData?: UpdatePensionerSchemaType | null;
}


export default function PensionerAddModal({onCreate,mode,pensionerData,onUpdate}:props){
  const isEdit = mode === "edit";

    const {control, handleSubmit,reset} = useForm<PensionerSchemaType>({
        resolver: zodResolver(PensionerSchema),
        defaultValues: {
        firstName: "",
        lastName:"",
        legacyPensionerId: 0,
        actualPension: 0,
        contingencyDate:"",
        bankName:"",
        birthDate:"",
        },
    });

  useEffect(() => {
    if(isEdit && pensionerData){
      reset({
        firstName: pensionerData.firstName,
        lastName: pensionerData.lastName,
        legacyPensionerId: pensionerData.legacyPensionerId,
        actualPension: pensionerData.actualPension,
        contingencyDate: pensionerData.contingencyDate,
        bankName: pensionerData.bankName,
        birthDate: pensionerData.birthDate,
      });
      return;
    }
    reset({
        firstName: "",
        lastName:  "",
        legacyPensionerId:0,
        actualPension:  0,
        contingencyDate:  "",
        bankName:  "",
        birthDate:"",
    })
  },[isEdit,pensionerData,reset]);



const onSubmit = (data: PensionerSchemaType) => {
  if (isEdit && pensionerData) {
    onUpdate?.({
      ...data,
      id: pensionerData.id,
    });

    return;
  }

  onCreate?.(data);
};



    return(

      <div className="w-full">
  <form
    onSubmit={handleSubmit(onSubmit, (errors) => {
      console.log("form errors", errors);
    })}
    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
  >
    {/* FORM HEADER */}
    <div className="border-b border-slate-200 px-6 py-5">
      <h2 className="text-lg font-semibold text-slate-900">
        Pensioner Information
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Enter the pensioner&apos;s personal and account information.
      </p>
    </div>

    {/* FORM CONTENT */}
    <div className="p-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <FormInput
          name="firstName"
          label="First Name"
          control={control}
          type="text"
          placeholder="Enter first name"
        />

        <FormInput
          name="lastName"
          label="Last Name"
          control={control}
          type="text"
          placeholder="Enter last name"
        />

        <FormInput
          name="legacyPensionerId"
          label="Pensioner ID"
          control={control}
          type="number"
          placeholder="Enter pensioner ID"
        />

        <FormInput
          name="actualPension"
          label="Actual Pension"
          control={control}
          type="number"
          placeholder="Enter actual pension"
        />

        <FormInput
          name="birthDate"
          label="Birth Date"
          control={control}
          type="date"
          placeholder="Enter birth date"
        />

        <FormInput
          name="contingencyDate"
          label="Contingency Date"
          control={control}
          type="date"
          placeholder="Enter contingency date"
        />

        <div className="md:col-span-2">
          <FormInput
            name="bankName"
            label="Bank Name"
            control={control}
            type="text"
            placeholder="Enter bank name"
          />
        </div>
      </div>
    </div>

    {/* FORM FOOTER */}
    <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
      <button
        type="button"
        className="
          rounded-lg border border-slate-300
          bg-white px-5 py-2.5
          text-sm font-medium text-slate-700
          shadow-sm
          transition
          hover:bg-slate-50
          focus:outline-none
          focus:ring-2
          focus:ring-slate-300
        "
      >
        Cancel
      </button>

      <button
        type="submit"
        className="
          inline-flex items-center justify-center
          rounded-lg
          bg-blue-600 px-6 py-2.5
          text-sm font-semibold text-white
          shadow-sm
          transition
          hover:bg-blue-700
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:ring-offset-2
        "
      >
        Save Pensioner
      </button>
    </div>
  </form>
</div>


    );
}
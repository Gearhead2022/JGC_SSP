import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type InputType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "month"
  | "time";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  control: Control<T>;
  type?: InputType;
  placeholder?: string;
};

export default function FormInput<T extends FieldValues>({
  name,
  label,
  control,
  type = "text",
  placeholder,
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <label
            htmlFor={name}
            className="block mb-2 text-sm text-gray-600"
          >
            {label}
          </label>

          <input
            id={name}
            type={type}
            name={field.name}
            ref={field.ref}
            placeholder={placeholder}
            onBlur={field.onBlur}
            value={
              typeof field.value === "string" ||
              typeof field.value === "number"
                ? field.value
                : ""
            }
            onChange={(event) => {
              const value = event.target.value;

              if (type === "number") {
                field.onChange(
                  value === "" ? "" : Number(value)
                );

                return;
              }

              field.onChange(value);
            }}
            className={`
              w-full rounded-md border px-3 py-2
              outline-none
              ${
                fieldState.error
                  ? "border-red-500"
                  : "border-gray-300"
              }
            `}
          />

          {fieldState.error?.message && (
            <p className="mt-1 text-sm text-red-500">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
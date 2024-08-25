export interface IFormFieldErrorMessageProps {
    name: string;
    form: any;
}

export function FormFieldErrorMessage({
    name,
    form: { touched, errors }
}: IFormFieldErrorMessageProps) {
    return (
        <div className="bg-red mt-1 h-[4rem] w-full rounded-[3rem] border text-sm text-red-500">
            {errors[name]}
        </div>
    );
}

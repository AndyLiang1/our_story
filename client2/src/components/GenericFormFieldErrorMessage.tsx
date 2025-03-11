export interface IGenericFormFieldErrorMessageProps {
    name: string;
    form: any;
}

export function GenericFormFieldErrorMessage({
    name,
    form: { touched, errors }
}: IGenericFormFieldErrorMessageProps) {
    return (
        <div className="bg-red mt-1 h-[4rem] w-full rounded-[3rem] border text-sm text-red-500">
            {errors[name]}
        </div>
    );
}

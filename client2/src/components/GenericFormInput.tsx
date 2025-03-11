export interface IGenericFormInputProps {
    field: any;
    form: any;
    label: string;
    styles?: string;
}

export function GenericFormInput({
    field,
    form: { touched, errors },
    label,
    styles,
    ...props
}: IGenericFormInputProps) {
    return (
        <div
            className={
                (touched[field.name] && errors[field.name] ? 'h-[6rem]' : 'h-[4rem]') +
                ' mt-4 flex w-[90%] flex-col items-center justify-center'
            }
        >
            <div className="relative h-[4rem] max-h-[2.5rem] min-h-[4rem] w-full">
                <input
                    {...field}
                    {...props}
                    className={
                        'form__input border-box absolute top-0 left-0 h-[2.5rem] w-full rounded-[1rem] border font-bold text-[1rem]' +
                        (touched[field.name] && errors[field.name]
                            ? ' border-red-500'
                            : ' border-gray-800') +
                        ' ' +
                        'peer pt-5 pr-2 pl-4 hover:border hover:border-black focus:border-[3px] focus:border-black focus:outline-none'
                    }
                    placeholder=""
                />
                {/* Note, the following top_x is extremely important in creating a smooth transition. No idea why. */}
                <label className="form__label pointer-events-none absolute top-5 left-4 cursor-text text-base font-bold text-gray-500 transition-all duration-200 ease-in peer-focus:top-[0.4rem] peer-focus:text-sm peer-[:not(:placeholder-shown)]:top-[0.4rem] peer-[:not(:placeholder-shown)]:text-sm">
                    {label}
                </label>
                {/* As of right now, we have no errors for specific fields for this application. */}
            </div>
            {touched[field.name] && errors[field.name] && (
                <div className="m-1 flex h-[1rem] w-full items-center justify-center text-center text-[1rem] text-red-500">
                    {errors[field.name]}
                </div>
            )}
        </div>
    );
}

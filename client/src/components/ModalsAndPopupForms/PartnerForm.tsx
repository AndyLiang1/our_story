import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { IoIosClose, IoIosWarning } from 'react-icons/io';
import * as Yup from 'yup';
import { createPartnership } from '../../apis/partnerApi';
import { useUserContext } from '../../context/userContext';
import { errorType, genericErrorMessage } from '../../types/ApiTypes';
import { GenericFormButton } from '../GenericFormButton';
import { GenericFormErrorMessage } from '../GenericFormErrorMessage';
import { GenericFormInput } from '../GenericFormInput';

export interface IPartnerFormProps {
    setShowPartnerForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PartnerForm({ setShowPartnerForm }: IPartnerFormProps) {
    const user = useUserContext();
    const [formErrorMessage, setFormErrorMessage] = useState('');
    const { collabToken } = user;
    const handleSubmit = async (partnerEmail: string) => {
        try {
            await createPartnership(collabToken, partnerEmail);
            closeForm();
        } catch (error: any) {
            if (error.response.data) {
                const errorData = error.response.data;
                if ([errorType.BAD_REQUEST, errorType.NOT_FOUND].includes(errorData.name)) {
                    setFormErrorMessage(errorData.message);
                } else {
                    setFormErrorMessage(genericErrorMessage);
                }
            }
        }
    };
    const closeForm = () => {
        setShowPartnerForm(false);
    };
    const PartnerFormSchema = Yup.object().shape({
        partnerEmail: Yup.string()
            .email('Please enter a valid email.')
            .required('Partner email is required.'),
        confirm: Yup.string().oneOf(['Confirm'], 'You must type "Confirm".')
    });
    return (
        <div className="center-of-page z-10 flex h-[50%] w-[40%] justify-center items-center text-center bg-white">
            <IoIosClose
                className="absolute top-2 right-2 cursor-pointer text-[2rem]"
                onClick={() => setShowPartnerForm(false)}
            ></IoIosClose>
            <Formik
                initialValues={{
                    partnerEmail: ''
                }}
                validationSchema={PartnerFormSchema}
                onSubmit={(values, actions) => {
                    handleSubmit(values.partnerEmail);
                    setTimeout(() => {
                        actions.setSubmitting(false);
                    }, 1000);
                }}
            >
                {(props) => (
                    <Form className="flex h-full w-[90%] flex-col items-center justify-center">
                        <div className="text-[1.5rem] font-bold">
                            Share all your documents with a partner
                        </div>
                        <div className="flex h-[10%] w-full items-center justify-center text-center">
                            <IoIosWarning className="text-[3rem] text-orange-400" />

                            <div className="text-orange-400">
                                &nbsp;If your partner also selects you as their partner, all past,
                                current, and future documents will be automatically shared between
                                both of you.
                            </div>
                        </div>

                        <Field
                            name="partnerEmail"
                            type="email"
                            label="Email"
                            component={GenericFormInput}
                        />
                        <Field
                            name="confirm"
                            type="text"
                            label="Type Confirm"
                            component={GenericFormInput}
                        />

                        {formErrorMessage && (
                            <GenericFormErrorMessage errorMessage={formErrorMessage} />
                        )}

                        <GenericFormButton
                            displayMessage="Share"
                            type="submit"
                            disabled={props.isSubmitting}
                        ></GenericFormButton>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

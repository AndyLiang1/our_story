import { Field, Form, Formik } from 'formik';
import { IoIosClose, IoIosWarning } from 'react-icons/io';
import * as Yup from 'yup';
import { addDocumentOwnerToAll } from '../../apis/documentApi';
import { useUserContext } from '../../context/userContext';
import { GenericFormButton } from '../GenericFormButton';
import { GenericFormInput } from '../GenericFormInput';

export interface IShareAllDocumentsFormProps {
    setShowShareAllDocumentsForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ShareAllDocumentsForm({
    setShowShareAllDocumentsForm
}: IShareAllDocumentsFormProps) {
    const user = useUserContext();
    const { collabToken, userId } = user;
    const handleSubmit = async (partnerEmail: string) => {
        await addDocumentOwnerToAll(collabToken, userId, partnerEmail);
        closeForm();
    };
    const closeForm = () => {
        setShowShareAllDocumentsForm(false);
    };
    const ShareAllDocumentsFormSchema = Yup.object().shape({
        partnerEmail: Yup.string()
            .email('Please enter a valid email.')
            .required('Partner email is required.'),
        confirm: Yup.string().oneOf(['Confirm'], 'You must type "Confirm".')
    });
    return (
        <div className="center-of-page z-10 flex h-[50%] w-[30%] justify-center bg-white">
            <IoIosClose
                className="absolute top-2 right-2 cursor-pointer text-[2rem]"
                onClick={() => setShowShareAllDocumentsForm(false)}
            ></IoIosClose>
            <Formik
                initialValues={{
                    partnerEmail: ''
                }}
                validationSchema={ShareAllDocumentsFormSchema}
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
                            <IoIosWarning className="text-[1.5rem] text-orange-400" />

                            <div className="text-orange-400">
                                &nbsp;All future documents will be shared automatically too.
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

                        {/* {formErrorMessagae && (
                            <GenericFormErrorMessage errorMessage={formErrorMessage} />
                        )}  */}

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

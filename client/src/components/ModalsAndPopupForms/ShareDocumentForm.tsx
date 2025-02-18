import { Field, Form, Formik } from 'formik';
import { IoIosClose } from 'react-icons/io';
import * as Yup from 'yup';
import { addDocumentOwner } from '../../apis/documentApi';
import { useUserContext } from '../../context/userContext';
import { ShareDocumentFormInfo } from '../../types/DocumentTypes';
import { GenericFormButton } from '../GenericFormButton';
import { GenericFormInput } from '../GenericFormInput';

export interface IShareDocumentFormProps {
    showShareDocumentForm: ShareDocumentFormInfo;
    setShowShareDocumentForm: React.Dispatch<React.SetStateAction<ShareDocumentFormInfo>>;
}

export function ShareDocumentForm({
    showShareDocumentForm,
    setShowShareDocumentForm
}: IShareDocumentFormProps) {
    const user = useUserContext();
    const { collabToken, userId } = user;
    const handleSubmit = async (partnerEmail: string) => {
        await addDocumentOwner(collabToken, userId, showShareDocumentForm.documentId, partnerEmail);
        closeForm();
    };
    const closeForm = () => {
        setShowShareDocumentForm({
            documentId: '',
            documentTitle: '',
            status: false
        });
    };
    const ShareDocumentFormSchema = Yup.object().shape({
        documentTitle: Yup.string().required('Title is required.'),
        partnerEmail: Yup.string().email().required('Partner email is required.')
    });
    return (
        <div className="center-of-page z-10 flex h-[50%] w-[30%] justify-center bg-white">
            <IoIosClose
                className="absolute right-2 top-2 cursor-pointer text-[2rem]"
                onClick={() =>
                    setShowShareDocumentForm({
                        documentId: '',
                        documentTitle: '',
                        status: false
                    })
                }
            ></IoIosClose>
            <Formik
                initialValues={{
                    documentTitle: showShareDocumentForm.documentTitle
                        ? showShareDocumentForm.documentTitle
                        : '',
                    partnerEmail: ''
                }}
                validationSchema={ShareDocumentFormSchema}
                onSubmit={(values, actions) => {
                    handleSubmit(values.partnerEmail);
                    setTimeout(() => {
                        actions.setSubmitting(false);
                    }, 1000);
                }}
            >
                {(props) => (
                    <Form className="flex h-full w-[90%] flex-col items-center justify-center">
                        <div className="text-[1.5rem] font-bold">Share with a partner</div>
                        <Field
                            name="documentTitle"
                            type="text"
                            label="Title"
                            component={GenericFormInput}
                            onChange={() => {}}
                            disabled={showShareDocumentForm.documentTitle !== ''}
                        />
                        <Field
                            name="partnerEmail"
                            type="email"
                            label="Email"
                            component={GenericFormInput}
                        />

                        {/* {formErrorMessagae && (
                            <GenericFormErrorMessage errorMessage={formErrorMessage} />
                        )} */}

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

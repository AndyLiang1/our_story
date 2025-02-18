import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import * as Yup from 'yup';
import { createDocument } from '../../apis/documentApi';
import { useUserContext } from '../../context/userContext';
import { GenericFormButton } from '../GenericFormButton';
import { GenericFormErrorMessage } from '../GenericFormErrorMessage';
import { GenericFormInput } from '../GenericFormInput';

export interface ICreateDocumentFormProps {
    setShowCreateDocumentForm: React.Dispatch<React.SetStateAction<boolean>>;
    setTriggerFlipBookRefetch: React.Dispatch<React.SetStateAction<string>>;
}

type CreateDocumentFormData = {
    title: string;
    eventDate: Date;
};

export function CreateDocumentForm({
    setShowCreateDocumentForm,
    setTriggerFlipBookRefetch
}: ICreateDocumentFormProps) {
    const user = useUserContext();
    const [formErrorMessage, setFormErrorMessage] = useState('');

    const CreateDocumentSchema = Yup.object().shape({
        title: Yup.string().required('Title is required.'),
        eventDate: Yup.date().required('Date is required.')
    });

    const handleSubmit = async (formData: CreateDocumentFormData) => {
        const documentId = await createDocument(user.collabToken, {
            ...formData,
            createdByUserId: user.userId
        });
        setShowCreateDocumentForm(false);
        setTriggerFlipBookRefetch(documentId);
    };
    return (
        <div className="center-of-page z-10 flex h-[50%] w-[30%] justify-center bg-white">
            <IoIosClose
                className="absolute right-2 top-2 cursor-pointer text-[2rem]"
                onClick={() => setShowCreateDocumentForm(false)}
            ></IoIosClose>
            <Formik
                initialValues={{ title: '', eventDate: '' }}
                validationSchema={CreateDocumentSchema}
                onSubmit={(values, actions) => {
                    handleSubmit({
                        title: values.title,
                        eventDate: new Date(values.eventDate)
                    });
                    setTimeout(() => {
                        actions.setSubmitting(false);
                    }, 1000);
                }}
            >
                {(props) => (
                    <Form className="flex h-full w-[90%] flex-col items-center justify-center">
                        <div className="text-[1.5rem] font-bold">Create a new document</div>
                        <Field
                            name="title"
                            type="text"
                            label="Title"
                            component={GenericFormInput}
                        />
                        <Field
                            name="eventDate"
                            type="date"
                            label="Date"
                            max="9999-12-31"
                            component={GenericFormInput}
                        />

                        {formErrorMessage && (
                            <GenericFormErrorMessage errorMessage={formErrorMessage} />
                        )}

                        <GenericFormButton
                            displayMessage="Create"
                            type="submit"
                            disabled={props.isSubmitting}
                        ></GenericFormButton>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import * as Yup from 'yup';
import { createDocument } from '../apis/documentApi';
import { User } from '../types/UserTypes';
import { GenericFormButton } from './GenericFormButton';
import { GenericFormErrorMessage } from './GenericFormErrorMessage';
import { GenericFormInput } from './GenericFormInput';

export interface ICreateDocumentFormProps {
    user: User;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

type CreateDocumentFormData = {
    title: string;
    date: Date;
};

export function CreateDocumentForm({ user, setShowForm }: ICreateDocumentFormProps) {
    const [formErrorMessage, setFormErrorMessage] = useState('');

    const CreateDocumentSchema = Yup.object().shape({
        title: Yup.string().required('Title is required.'),
        date: Yup.date().required('Date is required.')
    });

    const handleSubmit = async (formData: CreateDocumentFormData) => {
        await createDocument(user.collabToken, { ...formData, createdByUserId: user.userId });
        setShowForm(false);
    };
    return (
        <div className="absolute left-[50%] top-[50%] h-[50%] w-[30%] -translate-x-1/2 -translate-y-1/2 transform bg-white">
            <IoIosClose
                className="absolute right-2 top-2 cursor-pointer text-[2rem]"
                onClick={() => setShowForm(false)}
            ></IoIosClose>
            <Formik
                initialValues={{ title: '', date: '' }}
                validationSchema={CreateDocumentSchema}
                onSubmit={(values, actions) => {
                    handleSubmit({
                        title: values.title,
                        date: new Date(values.date)
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
                        <Field name="date" type="date" label="Date" component={GenericFormInput} />

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

import { Formik, Field, Form } from "formik";
import { date } from "yup";
import { GenericFormButton } from "./GenericFormButton";
import { GenericFormErrorMessage } from "./GenericFormErrorMessage";
import { GenericFormInput } from "./GenericFormInput";
import * as Yup from 'yup';
import { useState } from "react";
import { User } from "../types/UserTypes";
import { createDocument } from "../apis/documentApi";


export interface ICreateDocumentFormProps {
    user: User
}


type CreateDocumentFormData = {
    title: string;
    date: Date;
}

export function CreateDocumentForm({user}: ICreateDocumentFormProps) {
    const [formErrorMessage, setFormErrorMessage] = useState('');

    const CreateDocumentSchema = Yup.object().shape({
        title: Yup.string().required(),
        password: Yup.string()
    });

    const handleSubmit = async (formData: CreateDocumentFormData) =>{
        await createDocument(user.collabToken, {...formData, createdByUserId: user.userId })
    }
    return (
        <div className="absolute h-[50%] w-[30%] top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-white">
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
                        <Field
                            name="date"
                            type="text"
                            label="Date"
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

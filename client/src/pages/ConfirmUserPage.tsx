import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { GenericFormInput } from '../components/GenericFormInput';
import { GenericFormErrorMessage } from '../components/GenericFormErrorMessage';
import { GenericFormButton } from '../components/GenericFormButton';
import { useState } from 'react';
import { ConfirmUserType } from '../types/UserTypes';
import Swal from 'sweetalert2';
import { confirmSignUp } from '../services/authService';
import { title } from 'process';
import { useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils/errorUtils';

export interface IConfirmUserPageProps {}

export function ConfirmUserPage(props: IConfirmUserPageProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const userEmail = location.state?.email || '';

    const [formErrorMessage, setFormErrorMessage] = useState('');

    const handleSubmit = async (formData: ConfirmUserType) => {
        try {
            await confirmSignUp(formData);
            await Swal.fire({
                title: 'Success!',
                text: 'Account confirmed successfully!\nSign in on next page.',
                icon: 'success',
                confirmButtonText: 'Continue to Log In'
            });
            navigate('/');
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: `Failed to confirm account: ${getErrorMessage(error)}`,
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };

    const confirmUserSchema = Yup.object().shape({
        email: Yup.string().email('Please enter a valid email.').required('Email is required.'),
        confirmationCode: Yup.string().required('Confirmation Code is required.')
    });

    return (
        <div className="v-screen h-screen flex-wrap items-center justify-between">
            <div className="float-right flex h-full w-[45%] items-center justify-center">
                <Formik
                    initialValues={{ email: userEmail, confirmationCode: '' }}
                    validationSchema={confirmUserSchema}
                    onSubmit={(values, actions) => {
                        handleSubmit(values);
                        setTimeout(() => {
                            actions.setSubmitting(false);
                        }, 1000);
                    }}
                >
                    {(props) => (
                        <Form className="flex h-full w-[90%] flex-col items-center justify-center">
                            <div className="text-[1.5rem] font-bold">Confirm Account</div>
                            <div className="text-[1rem]">
                                A confirmation code was sent to your email.
                            </div>
                            <Field
                                name="email"
                                type="email"
                                label="Email"
                                component={GenericFormInput}
                            />
                            <Field
                                type="text"
                                name="confirmationCode"
                                label="Confirmation Code"
                                component={GenericFormInput}
                            />
                            {formErrorMessage && (
                                <GenericFormErrorMessage errorMessage={formErrorMessage} />
                            )}

                            <GenericFormButton
                                displayMessage="Confirm Account"
                                type="submit"
                                disabled={props.isSubmitting}
                            ></GenericFormButton>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

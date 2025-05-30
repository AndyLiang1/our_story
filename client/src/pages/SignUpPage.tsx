import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { GenericFormButton } from '../components/GenericFormButton';
import { GenericFormErrorMessage } from '../components/GenericFormErrorMessage';
import { GenericFormInput } from '../components/GenericFormInput';
import { signUp } from '../services/authService';
import { SignUpType } from '../types/UserTypes';
import { getErrorMessage } from '../utils/errorUtils';

export interface ISignUpPageProps {}

export function SignUpPage(props: ISignUpPageProps) {
    const navigate = useNavigate();
    const [formErrorMessage, setFormErrorMessage] = useState('');

    const handleSubmit = async (formData: SignUpType) => {
        if (formData.password !== formData.confirmPassword) {
            setFormErrorMessage('Passwords do not match.');
            return;
        }
        try {
            const cognitoResponse = await signUp(formData);
            const userState = {
                cognitoId: cognitoResponse.UserSub,
                email: formData.email,
                familyName: formData.familyName,
                givenName: formData.givenName
            };
            navigate('/confirm', {
                state: {
                    user: userState
                }
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: `Failed to create account: ${getErrorMessage(error)}`,
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };

    const SignUpSchema = Yup.object().shape({
        email: Yup.string().email('Please enter a valid email.').required('Email is required.'),
        password: Yup.string().required('Password is required.'),
        confirmPassword: Yup.string().required('Confirm Password is required.'),
        familyName: Yup.string(),
        givenName: Yup.string()
    });

    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
        familyName: '',
        givenName: ''
    };

    return (
        <div className="v-screen h-screen flex-wrap items-center justify-between">
            <div className="float-right flex h-full w-[45%] items-center justify-center">
                <Formik
                    initialValues={initialValues}
                    validationSchema={SignUpSchema}
                    onSubmit={(values, actions) => {
                        handleSubmit(values);
                        setTimeout(() => {
                            actions.setSubmitting(false);
                        }, 1000);
                    }}
                >
                    {(props) => (
                        <Form className="flex h-full w-[90%] flex-col items-center justify-center">
                            <div className="text-[1.5rem] font-bold">Log in</div>
                            <Field
                                name="email"
                                type="email"
                                label="Email"
                                component={GenericFormInput}
                            />
                            <Field
                                type="password"
                                name="password"
                                label="Password"
                                component={GenericFormInput}
                            />
                            <Field
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                component={GenericFormInput}
                            />
                            <Field
                                name="familyName"
                                type="text"
                                label="Last Name"
                                component={GenericFormInput}
                            />
                            <Field
                                name="givenName"
                                type="text"
                                label="First Name"
                                component={GenericFormInput}
                            />

                            {formErrorMessage && (
                                <GenericFormErrorMessage errorMessage={formErrorMessage} />
                            )}

                            <GenericFormButton
                                displayMessage="Sign Up"
                                type="submit"
                                disabled={props.isSubmitting}
                            ></GenericFormButton>
                            <GenericFormButton
                                displayMessage="Already have an account? Sign In"
                                disabled={false}
                                onClick={() => navigate('/login')}
                            ></GenericFormButton>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

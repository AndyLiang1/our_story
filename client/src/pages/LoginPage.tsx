import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { getCollabToken, getUserByCollabToken } from '../apis/userApi';
import { GenericFormButton } from '../components/GenericFormButton';
import { GenericFormErrorMessage } from '../components/GenericFormErrorMessage';
import { GenericFormInput } from '../components/GenericFormInput';
import { ACCESS_TOKEN_KEY, COLLAB_TOKEN_KEY, ID_TOKEN_KEY } from '../constant/constant';
import { login } from '../services/authService';
import { LoginType } from '../types/UserTypes';
import { getErrorMessage } from '../utils/errorUtils';

export interface ILoginPageProps {}

export function LoginPage(props: ILoginPageProps) {
    const navigate = useNavigate();
    const [formErrorMessage, setFormErrorMessage] = useState('');

    const handleSubmit = async (formData: LoginType) => {
        try {
            const session = await login(formData);
            if (session && typeof session.AccessToken !== 'undefined') {
                sessionStorage.setItem(ACCESS_TOKEN_KEY, session.AccessToken);
                if (sessionStorage.getItem(ACCESS_TOKEN_KEY)) {
                    const idToken = sessionStorage[ID_TOKEN_KEY].toString();
                    const collabToken = await getCollabToken(idToken);
                    sessionStorage.setItem(COLLAB_TOKEN_KEY, collabToken);
                    const user = await getUserByCollabToken();
                    navigate('/home', {
                        state: {
                            user: user
                        }
                    });
                } else {
                    console.error('Session token was not set properly.');
                }
            } else {
                console.error('SignIn session or AccessToken is undefined.');
            }
        } catch (error) {
            console.error(
                `Unable to retrieve user with email ${formData.email}: ${getErrorMessage(error)}`
            );
            Swal.fire({
                title: 'Error!',
                text: getErrorMessage(error),
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        }
    };

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Please enter a valid email.').required('Email is required.'),
        password: Yup.string().required('Password is required.')
    });

    return (
        <div className="v-screen flex h-screen items-center justify-between">
            <div className="flex h-full w-[55%] scale-100 bg-[url('/login_page.png')] bg-cover"></div>
            <div className="float-right flex h-full w-[45%] items-center justify-center bg-none">
                <Formik
                    className="h-full w-full"
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
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

                            {formErrorMessage && (
                                <GenericFormErrorMessage errorMessage={formErrorMessage} />
                            )}

                            <GenericFormButton
                                displayMessage="Log in"
                                type="submit"
                                disabled={props.isSubmitting}
                                styles="h-12 w-[30%]"
                            ></GenericFormButton>
                            <GenericFormButton
                                displayMessage="Need an account? Sign Up"
                                disabled={false}
                                onClick={() => navigate('/signup')}
                                styles="h-12 w-[30%]"
                            ></GenericFormButton>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

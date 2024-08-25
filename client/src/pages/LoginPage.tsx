import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { FormInput } from '../components/FormInput';
import { FormErrorMessage } from '../components/FormErrorMessage';
import * as Yup from 'yup';
import { FormButton } from '../components/FormButton';
import { login, signUp } from '../services/authService';
import { LoginType, LoginBEType, SignUpType } from '../types/UserTypes';
import { APPErrorType } from '../types/ApiTypes';
import { useState } from 'react';
import Swal from 'sweetalert2'
import { getErrorMessage } from '../utils/errorUtils';

export interface ILoginPageProps {}

export function LoginPage(props: ILoginPageProps) {
    const navigate = useNavigate();
    const [formErrorMessage, setFormErrorMessage] = useState('')
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (formData: LoginType | SignUpType) => {
        if (isSignUp) {
            await handleSignUp(formData as SignUpType)
        } else {
            await handleLogin(formData)
        }

    };

    const handleSignUp = async (formData: SignUpType) => {
        if (formData.password !== formData.confirmPassword) {
            setFormErrorMessage("Passwords do not match.")
            return
        }
        try {
            await signUp(formData)
            const email = formData.email
            navigate('/confirm', { state: { email } })
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: `Failed to create account: ${getErrorMessage(error)}`,
                icon: 'error',
                confirmButtonText: 'Try Again'
            
            })
        }

    }

    const handleLogin = async (formData: LoginType) => {
        try {
            const session = await login(formData)
            if (session && typeof session.AccessToken !== 'undefined') {
                sessionStorage.setItem('accessToken', session.AccessToken);
                if (sessionStorage.getItem('accessToken')) {
                    navigate('/home');
                } else {
                    console.error('Session token was not set properly.');
                }
            } else {
                console.error('SignIn session or AccessToken is undefined.');
            }
            
        } catch(error) {
            Swal.fire({
                title: 'Error!',
                text: getErrorMessage(error),
                icon: 'error',
                confirmButtonText: 'Try Again'
            
            })
        }
    };

    const loginAttributes = {
        email: Yup.string().email('Please enter a valid email.').required('Email is required.'),
        password: Yup.string().required('Password is required.')
    }

    const LoginSchema = Yup.object().shape(loginAttributes);
    const SignUpSchema = Yup.object().shape({
        ...loginAttributes,
        confirmPassword: Yup.string().required('Confirm Password is required.'),
        familyName: Yup.string(),
        givenName: Yup.string()
    });

    return (
        <div className="v-screen h-screen flex-wrap items-center justify-between">
            <div className="float-right flex h-full w-[45%] items-center justify-center">
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={isSignUp ? SignUpSchema : LoginSchema}
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
                            <Field name="email" type="email" label="Email" component={FormInput} />
                            <Field
                                type="password"
                                name="password"
                                label="Password"
                                component={FormInput}
                            />
                            {isSignUp && (
                                <>
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        component={FormInput}
                                    />
                                    <Field name="familyName" type="text" label="Last Name" component={FormInput} />
                                    <Field name="givenName" type="text" label="First Name" component={FormInput} />
                                </>
                            )}
                            {formErrorMessage && <FormErrorMessage errorMessage={formErrorMessage} />}

                            <FormButton
                                displayMessage={isSignUp ? 'Sign Up' : 'Log in'}
                                type="submit"
                                disabled={props.isSubmitting}
                            ></FormButton>
                            <FormButton 
                                displayMessage={isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                                disabled={!isSignUp}
                                onClick={() => setIsSignUp(!isSignUp)}
                            ></FormButton>
                        </Form>
                    )}  
                </Formik>
            </div>
            
            
        </div>
    );
}

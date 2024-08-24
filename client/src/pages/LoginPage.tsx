import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { FormInput } from '../components/FormInput';
import { FormErrorMessage } from '../components/FormErrorMessage';
import * as Yup from 'yup';
import { FormButton } from '../components/FormButton';
import { login } from '../apis/userApi';
import { LoginType, LoginBEType } from '../types/UserTypes';
import { APPErrorType } from '../types/ApiTypes';
import { useState } from 'react';

export interface ILoginPageProps {}

export function LoginPage(props: ILoginPageProps) {
    const navigate = useNavigate();
    const [formErrorMessage, setFormErrorMessage] = useState('')

    const handleSubmit = async (formData: LoginType) => {
        const loginResult: LoginBEType = await login(formData)
        await handleLogin(loginResult)
    };

    const handleLogin = async (loginDataFromBE: LoginBEType | APPErrorType) => {
        if ((loginDataFromBE as APPErrorType).errorMessage) {
            setFormErrorMessage((loginDataFromBE as APPErrorType).errorMessage)
        } else {
            navigate('/home', {state : {userInfo: loginDataFromBE}});
        }
    };

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Please enter a valid email.').required('Email is required.'),
        password: Yup.string().required('Password is required.')
    });

    return (
        <div className="v-screen h-screen flex-wrap items-center justify-between">
            <div className="float-right flex h-full w-[45%] items-center justify-center">
                <Formik
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
                            <Field name="email" type="email" label="Email" component={FormInput} />
                            <Field
                                type="password"
                                name="password"
                                label="Password"
                                component={FormInput}
                            />
                            {formErrorMessage && <FormErrorMessage errorMessage={formErrorMessage} />}

                            <FormButton
                                displayMessage="Log in"
                                type="submit"
                                disabled={props.isSubmitting}
                            ></FormButton>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

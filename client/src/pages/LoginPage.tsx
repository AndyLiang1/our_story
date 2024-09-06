import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { GenericFormInput } from '../components/GenericFormInput';
import { GenericFormErrorMessage } from '../components/GenericFormErrorMessage';
import * as Yup from 'yup';
import { GenericFormButton } from '../components/GenericFormButton';
import { login, signUp } from '../services/authService';
import { LoginType, LoginBEType, SignUpType } from '../types/UserTypes';
import { APPErrorType } from '../types/ApiTypes';
import { useState } from 'react';
import Swal from 'sweetalert2'
import { getErrorMessage } from '../utils/errorUtils';
import { getCollabToken, getUserByEmail } from '../apis/userApi';
import { parseJwt } from '../utils/authUtils';

export interface ILoginPageProps {}

export function LoginPage(props: ILoginPageProps) {
    const navigate = useNavigate();
    const [formErrorMessage, setFormErrorMessage] = useState('')

    const handleSubmit = async (formData: LoginType) => {
        try {
            const session = await login(formData)
            if (session && typeof session.AccessToken !== 'undefined') {
                sessionStorage.setItem('accessToken', session.AccessToken);
                if (sessionStorage.getItem('accessToken')) {
                    var idToken = sessionStorage.idToken.toString()
                    const collabToken = await getCollabToken(idToken)
                    const user = await getUserByEmail(formData.email, collabToken)
                    console.log ("Amazon Cognito ID token encoded: " + sessionStorage.idToken.toString());
                    console.log ("Amazon Cognito ID token decoded: ");
                    console.log ( parseJwt(idToken) );
                    console.log ("Collab token decoded: ");
                    console.log(parseJwt(collabToken))
                    navigate('/home', {state: user?.data});
                } else {
                    console.error('Session token was not set properly.');
                }
            } else {
                console.error('SignIn session or AccessToken is undefined.');
            }
            
        } catch(error) {
            console.error(`Unable to retrieve user with email ${formData.email}: ${getErrorMessage(error)}`)
            Swal.fire({
                title: 'Error!',
                text: getErrorMessage(error),
                icon: 'error',
                confirmButtonText: 'Try Again'
            
            })
        }

    };

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Please enter a valid email.').required('Email is required.'),
        password: Yup.string().required('Password is required.')
    }
        
    );

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
                            <Field name="email" type="email" label="Email" component={GenericFormInput} />
                            <Field
                                type="password"
                                name="password"
                                label="Password"
                                component={GenericFormInput}
                            />
                            
                            {formErrorMessage && <GenericFormErrorMessage errorMessage={formErrorMessage} />}

                            <GenericFormButton
                                displayMessage='Log in'
                                type="submit"
                                disabled={props.isSubmitting}
                            ></GenericFormButton>
                            <GenericFormButton 
                                displayMessage='Need an account? Sign Up'
                                disabled={false}
                                onClick={() => navigate('/signup')}
                            ></GenericFormButton>
                        </Form>
                    )}  
                </Formik>
            </div>
            
            
        </div>
    );
}

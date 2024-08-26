import {
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    ConfirmSignUpCommandInput,
    InitiateAuthCommand,
    InitiateAuthCommandInput,
    SignUpCommand,
    SignUpCommandInput
} from '@aws-sdk/client-cognito-identity-provider';
import { config } from '../config/config';
import { ConfirmUserType, LoginType, SignUpType } from '../types/UserTypes';

const cognitoClient = new CognitoIdentityProviderClient({
    region: config.cognito.region
});

export const login = async (formData: LoginType) => {
    const params: InitiateAuthCommandInput = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: config.cognito.clientId,
        AuthParameters: {
            USERNAME: formData.email,
            PASSWORD: formData.password
        }
    };

    try {
        const command = new InitiateAuthCommand(params);
        const { AuthenticationResult } = await cognitoClient.send(command);
        if (AuthenticationResult) {
            sessionStorage.setItem('idToken', AuthenticationResult.IdToken || '');
            sessionStorage.setItem('accessToken', AuthenticationResult.AccessToken || '');
            sessionStorage.setItem('refreshToken', AuthenticationResult.RefreshToken || '');
            return AuthenticationResult;
        }
    } catch (error) {
        console.error('Error signing in: ', error);
        throw error;
    }
};

export const signUp = async (formData: SignUpType) => {
    const params: SignUpCommandInput = {
        ClientId: config.cognito.clientId,
        Username: formData.email,
        Password: formData.password,
        UserAttributes: [
            {
                Name: 'email',
                Value: formData.email
            },
            {
                Name: 'family_name',
                Value: formData.familyName
            },
            {
                Name: 'given_name',
                Value: formData.givenName
            }
        ]
    };

    try {
        const command = new SignUpCommand(params);
        const response = await cognitoClient.send(command);
        console.log('Sign up success: ', response);
        return response;
    } catch (error) {
        console.error('Error signing up: ', error);
        throw error;
    }
};

export const confirmSignUp = async (formData: ConfirmUserType) => {
    const params: ConfirmSignUpCommandInput = {
        ClientId: config.cognito.clientId,
        Username: formData.email,
        ConfirmationCode: formData.confirmationCode
    };
    try {
        const command = new ConfirmSignUpCommand(params);
        await cognitoClient.send(command);
        console.log('User confirmed successfully');
        return true;
    } catch (error) {
        console.error('Error confirming sign up: ', error);
        throw error;
    }
};


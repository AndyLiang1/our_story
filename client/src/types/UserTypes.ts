export type LoginType = {
    email: string;
    password: string;
};

export type SignUpType = {
    email: string;
    password: string;
    confirmPassword: string;
    familyName?: string;
    givenName?: string;
};

export type ConfirmUserType = {
    email: string;
    confirmationCode: string;
};

export type LoginBEType = {
    firstName: string;
    lastName: string;
    authToken: string;
    tiptapToken: string;
};

export type User = {
    cognitoId: string;
    email: string;
    firstName: string;
    lastName: string;
    collabToken: string;
};

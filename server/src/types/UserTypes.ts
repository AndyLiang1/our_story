export type UserCreationData = {
    cognitoId: string;
    email: string;
    firstName: string;
    lastName: string;
};

export type UserData = {
    userId: string;
    cognitoId: string;
    email: string;
    firstName: string;
    lastName: string;
};

export type UserReturnTypeData = {
    email: string;
    firstName: string;
    lastName: string;
    textColor: string | null
};

export type UserAccountDBType = {
    accountData: UserAccountType;
    loginAttempts: LoginAttemptType[];
    emailConfirmation: EmailConfirmationType;
};

export type EmailConfirmationType = {
    isConfirmed: boolean;
    confirmationCode: string;
    expirationDate: Date;
    sentEmails: SentConfirmationEmailType[];
};

export type UserAccountType = {
    id: string;
    email: string;
    login: string;
    password: string;
    createdAt: Date;
};
export type SentConfirmationEmailType = {
    sentDate: Date;
};

export type LoginAttemptType = {
    attemptDate: Date;
    ip: string;
};

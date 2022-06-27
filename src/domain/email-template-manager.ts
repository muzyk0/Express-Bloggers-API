import { UserAccountDBType } from '../types/types';
import { BASE_PREFIX } from '../constants';

export const emailTemplateManager = {
    getEmailConfirmationMessage(user: UserAccountDBType) {
        return `<div>
            <h1>Thanks for registration</h1>
            <h3>Confirm your email</h3>
            <a href={"${BASE_PREFIX}/code=${user.accountData.email}"}>http://localhost:3000/code=${user.emailConfirmation.confirmationCode}</a>
        </div>`;
    },
};

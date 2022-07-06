import { BASE_URL } from '../constants';
import { UserAccountDBType } from '../entity/User/User';

export const emailTemplateManager = {
    getEmailConfirmationMessage(user: UserAccountDBType) {
        return `<div>
            <h1>Thanks for registration</h1>
            <h3>Confirm your email</h3>
            <a href="${BASE_URL}/code=${user.accountData.email}">${BASE_URL}/code=${user.emailConfirmation.confirmationCode}</a>
        </div>`;
    },
};

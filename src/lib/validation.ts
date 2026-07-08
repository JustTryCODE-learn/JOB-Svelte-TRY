export type AccountFormValues = {
	username: string;
	accountType: string;
	techStack: string;
};

export type AccountFormErrors = {
	username: string;
	accountType: string;
	techStack: string;
};

type ExistingAccount = {
	name: string;
};

export function createEmptyAccountErrors(): AccountFormErrors {
	return {
		username: '',
		accountType: '',
		techStack: ''
	};
}

export function validateAccountForm(
	form: AccountFormValues,
	existingAccounts: ExistingAccount[] = []
): AccountFormErrors {
	const errors = createEmptyAccountErrors();
	const username = form.username.trim();

	if (!username) {
		errors.username = 'Username is required';
	} else {
		const usernameAlreadyExists = existingAccounts.some((account) => {
			return account.name.toLowerCase() === username.toLowerCase();
		});

		if (usernameAlreadyExists) {
			errors.username = 'Username already exists.';
		}
	}

	if (!form.accountType) {
		errors.accountType = 'Please select an account type';
	}

	if (!form.techStack) {
		errors.techStack = 'Please select a tech stack';
	}

	return errors;
}

export function hasValidationErrors(errors: AccountFormErrors) {
	if (errors.username) return true;
	if (errors.accountType) return true;
	if (errors.techStack) return true;

	return false;
}

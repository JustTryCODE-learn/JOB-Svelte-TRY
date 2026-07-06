export type AccountFormValues = {
	username: string;
	accountType: string;
	techStack: string;
};

export type AccountFormErrors = Record<keyof AccountFormValues, string>;

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
	} else if (existingAccounts.some((account) => account.name.toLowerCase() === username.toLowerCase())) {
		errors.username = 'Username already exists.';
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
	return Object.values(errors).some(Boolean);
}

export function validateAccountForm(
	form: { username: string; accountType: string; techStack: string },
	existingAccounts: { name: string }[] = []
) {
	const errors = {
		username: '',
		accountType: '',
		techStack: ''
	};

	const name = form.username.trim();

	if (!name) {
		errors.username = 'Username cannot be empty';
	} else {
		for (let i = 0; i < existingAccounts.length; i++) {
			const acc = existingAccounts[i];
			if (acc.name.toLowerCase() === name.toLowerCase()) {
				errors.username = 'Username already exists';
				break;
			}
		}
	}

	if (!form.accountType) {
		errors.accountType = 'Please pick account type';
	}

	if (!form.techStack) {
		errors.techStack = 'Please pick tech stack';
	}

	return errors;
}

export function formHasErrors(errors: { username: string; accountType: string; techStack: string }) {
	if (errors.username) return true;
	if (errors.accountType) return true;
	if (errors.techStack) return true;
	return false;
}

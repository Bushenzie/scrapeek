const templateRegex = /\{([^}]+)\}/g;

export const hasVariables = (template: string) => {
	return templateRegex.test(template);
};

export const formatVariables = (
	template: string,
	variables: Record<string, string>,
) => {
	return template.replace(templateRegex, (_, key) => {
		if (!(key in variables)) throw new Error(`Missing key: "${key}"`);
		return variables[key];
	});
};

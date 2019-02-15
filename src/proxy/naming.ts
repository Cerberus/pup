const toSentenceCase = (camel: string) => {
	const spaceCase = camel.replace(/([A-Z])/g, ' $1')
	const lowerCase = spaceCase
		.split(' ')
		.map(word => word.toLowerCase())
		.join(' ')
	return lowerCase[0].toUpperCase() + lowerCase.slice(1)
}

export const getStepName = (key: string, options: unknown[]) =>
	[toSentenceCase(key), ...options.filter(opt => typeof opt === 'string')].join(
		' ',
	)

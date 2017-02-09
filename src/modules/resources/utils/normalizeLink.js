import { get as g, set, reduce, each } from 'lodash';
import { INTERNAL_ID_PROPERTY_NAME } from 'client-core/src/modules/resources/constants';

export default (link, paths) => {
	const { name: linkName, params: linkParams } = link;
	let parameters = reduce(
		paths,
		(result, value) => {
			if (result) {
				return result;
			}
			if (g(value, 'x-linkName') === linkName) {
				return g(value, 'parameters', []);
			}
			return undefined;
		},
		undefined
	);
	if (!parameters) {
		parameters = [
			{
				name: INTERNAL_ID_PROPERTY_NAME,
				'x-linkParam': INTERNAL_ID_PROPERTY_NAME,
			},
		];
	}

	const finalParams = {};
	each(parameters, (parameter) => {
		const linkParamPath = g(parameter, 'x-linkParam');
		const paramValue = g(linkParams, linkParamPath);
		set(finalParams, linkParamPath, paramValue);
	});

	return {
		name: linkName,
		params: finalParams,
	};
};
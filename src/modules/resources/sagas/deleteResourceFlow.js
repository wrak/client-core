import { get as g, isObject, isArray } from 'lodash';
import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import invariant from 'invariant';
import rethrowError from 'client-core/src/utils/rethrowError';
import {
	resourcesModuleStateSelector,
	resourcesServiceSelector,
	resourceSelectorFactory,
	resourceSchemaSelectorFactory,
} from '../selectors';

import {
	DELETE_RESOURCE,
	receiveDeleteResourceSuccess,
	receiveDeleteResourceFailure,
	defineResource,
} from '../actions';

import {
	modelIdPropertyNameSelectorFactory,
} from 'client-core/src/modules/entityDescriptors/selectors';

import {
	forgetEntity,
} from 'client-core/src/modules/entityStorage/actions';

export function *deleteResourceTask({ payload: { link, collectionsLinks } }) {
	// const resourceContent = g(resource, 'content');
	const apiDescription = yield select(resourcesModuleStateSelector);
	const resourceSchema = yield select(resourceSchemaSelectorFactory(link));
	const modelName = g(resourceSchema, 'x-model');

	// determine id property of model by name
	const idPropertyNameSelector = yield call(
		modelIdPropertyNameSelectorFactory,
		modelName,
	);
	const idPropertyName = yield select(idPropertyNameSelector);
	const entityId = g(link, ['params', idPropertyName]);
	invariant(entityId, 'Couldn\'t determine entityId to delete');

	let resource = yield select(resourceSelectorFactory(link));
	let resourceContent = g(resource, 'content');

	if (!resourceContent) {
		yield put(
			defineResource(
				{
					link,
					content: entityId,
				}
			)
		);
	}

	resource = yield select(resourceSelectorFactory(link));
	resourceContent = g(resource, 'content');
	const ResourcesService = yield select(resourcesServiceSelector);
	try {
		yield call(
			ResourcesService.deleteResource,
			{
				apiDescription,
				link,
			}
		);
	} catch (error) {
		rethrowError(error);
		yield put(receiveDeleteResourceFailure({ link, error }));
		return;
	}

	yield put(receiveDeleteResourceSuccess({ link, collectionsLinks }));
	yield (isArray(resourceContent) ? resourceContent : [resourceContent]).map((entityIdToForget) => {
		if (!isObject(entityIdToForget) && !isArray(entityIdToForget)) {
			return put(forgetEntity({ modelName, entityId: entityIdToForget }));
		}
		return undefined;
	});
}

export default function *deleteResourceFlow() {
	yield call(takeEvery, DELETE_RESOURCE, deleteResourceTask);
}
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
	return (0, _recompose.compose)((0, _recompose.withProps)(function (_ref) {
		var _ref$meta = _ref.meta,
		    meta = _ref$meta === undefined ? {} : _ref$meta,
		    _ref$input = _ref.input,
		    input = _ref$input === undefined ? {} : _ref$input,
		    _ref$canBeTouched = _ref.canBeTouched,
		    canBeTouched = _ref$canBeTouched === undefined ? true : _ref$canBeTouched;
		var error = meta.error,
		    touched = meta.touched,
		    dirty = meta.dirty,
		    submitFailed = meta.submitFailed;

		var value = (0, _get3.default)(input, 'value');
		var isDirty = dirty && (!(0, _isArray3.default)(value) || value.length);
		return {
			showError: error && (touched || !canBeTouched) && (isDirty || submitFailed)
		};
	}));
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../cjs/components/Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var OverviewIcon = function OverviewIcon(props) {
  return _react.default.createElement(_Icon.default, _extends({
    dangerouslySetGlyph: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" focusable=\"false\" role=\"presentation\"><path d=\"M8.01 18c.546 0 .99-.444.99-1a1 1 0 0 0-.99-1H3.99A.993.993 0 0 0 3 17a1 1 0 0 0 .99 1h4.02zM3 7c0 .552.445 1 .993 1h16.014A.994.994 0 0 0 21 7c0-.552-.445-1-.993-1H3.993A.994.994 0 0 0 3 7zm10.998 6A.999.999 0 0 0 15 12c0-.552-.456-1-1.002-1H4.002A.999.999 0 0 0 3 12c0 .552.456 1 1.002 1h9.996z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
  }, props));
};

OverviewIcon.displayName = 'OverviewIcon';
var _default = OverviewIcon;
exports.default = _default;
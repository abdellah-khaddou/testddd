"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterTable = exports.MatchString = void 0;
var MatchString;
(function (MatchString) {
    MatchString["STARTS_WITH"] = "startsWith";
    MatchString["CONTAINS"] = "contains";
    MatchString["NOT_CONTAINS"] = "notContains";
    MatchString["ENDS_WITH"] = "endsWith";
    MatchString["EQUALS"] = "equals";
    MatchString["NOT_EQUALS"] = "notEquals";
    MatchString["IN"] = "in";
    MatchString["LESS_THAN"] = "lt";
    MatchString["LESS_THAN_OR_EQUAL_TO"] = "lte";
    MatchString["GREATER_THAN"] = "gt";
    MatchString["GREATER_THAN_OR_EQUAL_TO"] = "gte";
    MatchString["BETWEEN"] = "between";
    MatchString["IS"] = "is";
    MatchString["IS_NOT"] = "isNot";
    MatchString["BEFORE"] = "before";
    MatchString["AFTER"] = "after";
    MatchString["DATE_IS"] = "dateIs";
    MatchString["DATE_IS_NOT"] = "dateIsNot";
    MatchString["DATE_BEFORE"] = "dateBefore";
    MatchString["DATE_AFTER"] = "dateAfter";
})(MatchString = exports.MatchString || (exports.MatchString = {}));
class FilterTable {
    constructor() {
    }
    returnRegEx(match, value) {
        switch (match) {
            case MatchString.STARTS_WITH: {
                return { $regex: '^' + value + '', $options: "i" };
            }
            case MatchString.CONTAINS: {
                return { $regex: '.*' + value + '.*', $options: "i" };
            }
            case MatchString.NOT_CONTAINS: {
                return { $regex: '^((?!' + value + ').)*$', $options: "i" };
            }
            case MatchString.ENDS_WITH: {
                return { $regex: '' + value + '$', $options: "i" };
            }
            case MatchString.EQUALS: {
                return { $eq: value };
            }
            case MatchString.NOT_EQUALS: {
                return { $ne: value };
            }
            case MatchString.IN: {
                return { $in: value };
            }
            case MatchString.LESS_THAN: {
                return { $lt: value };
            }
            case MatchString.LESS_THAN_OR_EQUAL_TO: {
                return { $lte: value };
            }
            case MatchString.GREATER_THAN: {
                return { $gt: value };
            }
            case MatchString.GREATER_THAN_OR_EQUAL_TO: {
                return { $gte: value };
            }
            case MatchString.BETWEEN: {
                return value;
            }
            case MatchString.IS: {
                return value;
            }
            case MatchString.IS_NOT: {
                return { $not: { $regex: '.*' + value + '.*', $options: "i" } };
            }
            case MatchString.BEFORE: {
                return { $lte: value };
            }
            case MatchString.AFTER: {
                return { $gte: value };
            }
            case MatchString.DATE_IS: {
                let date = new Date(value);
                let datePlus = new Date(new Date().setDate(date.getDate() + 1));
                let dateMoins = new Date(new Date().setDate(date.getDate() - 1));
                return { $lt: datePlus, $gt: dateMoins };
            }
            case MatchString.DATE_IS_NOT: {
                let date = new Date(value);
                let datePlus = new Date(new Date().setDate(date.getDate() + 1));
                let dateMoins = new Date(new Date().setDate(date.getDate() - 1));
                return { $not: { $lt: datePlus, $gt: dateMoins } };
            }
            case MatchString.DATE_BEFORE: {
                let date = new Date(value);
                return { $lte: date };
            }
            case MatchString.DATE_AFTER: {
                let date = new Date(value);
                return { $gte: date };
            }
            default: return null;
        }
    }
}
exports.FilterTable = FilterTable;
//# sourceMappingURL=lazyLoading.js.map
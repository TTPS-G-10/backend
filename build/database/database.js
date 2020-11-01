"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql2_1 = __importDefault(require("mysql2"));
var db;
function getConnectionDB() {
    return db;
}
function generateConnection(conData) {
    if (db) {
        return db;
    }
    db = mysql2_1.default.createPool({
        host: conData.host,
        user: conData.user,
        password: conData.password,
        database: conData.database,
        port: conData.port
    });
}
function createTransaction() {
    return __awaiter(this, void 0, void 0, function () {
        var connection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.promise().getConnection()];
                case 1:
                    connection = _a.sent();
                    connection.beginTransaction();
                    return [2 /*return*/, connection];
            }
        });
    });
}
function start(trx) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!trx) return [3 /*break*/, 2];
                    return [4 /*yield*/, trx.query('START TRANSACTION')];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, createTransaction()];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    trx = _a;
                    return [2 /*return*/, trx];
            }
        });
    });
}
function commit(trx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, trx.query('COMMIT')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, trx.release()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function rollback(trx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, trx.query('ROLLBACK')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function rawQuery(query, params, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var conn, _a, resp, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    conn = transaction || db.promise();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, conn.query(query, params)];
                case 2:
                    _a = (_b.sent())[0], resp = _a === void 0 ? null : _a;
                    return [2 /*return*/, resp];
                case 3:
                    err_1 = _b.sent();
                    console.warn(err_1.message);
                    throw new Error(err_1.message + ', in query: ' + query);
                case 4: return [2 /*return*/];
            }
        });
    });
}
function patch(name, model, id, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var query, record;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "SELECT id FROM " + name + " WHERE " + id + " = ?";
                    return [4 /*yield*/, singleOrDefault(query, [model[id]], transaction)];
                case 1:
                    record = _a.sent();
                    if (!record) return [3 /*break*/, 3];
                    return [4 /*yield*/, update(name, id, __assign(__assign({}, record), model), transaction)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, record.id];
                case 3: throw new Error('Profile does not exist');
            }
        });
    });
}
;
function remove(name, id, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var query, _a, record, updateQuery;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = "SELECT id FROM " + name + " WHERE id = ?";
                    return [4 /*yield*/, rawQuery(query, [id], transaction)];
                case 1:
                    _a = (_b.sent())[0], record = _a === void 0 ? null : _a;
                    if (!record) {
                        throw new Error("Record does not exist: " + name + ": " + id);
                    }
                    updateQuery = "UPDATE " + name + " SET ? WHERE id = ?";
                    return [4 /*yield*/, rawQuery(updateQuery, [{ deleted_at: new Date() }, record.id], transaction)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, record.id];
            }
        });
    });
}
;
function update(name, id, model, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var updateQuery;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Object.keys(model).forEach(function (key) { return model[key] === undefined && delete model[key]; });
                    updateQuery = "UPDATE " + name + " SET ? WHERE " + id + " = ?";
                    return [4 /*yield*/, rawQuery(updateQuery, [__assign(__assign({}, model), { updated_at: new Date() }), model[id]], transaction)];
                case 1: return [2 /*return*/, (_a.sent()).affectedRows];
            }
        });
    });
}
;
function processInsert(query, params) {
    var k = Object.keys(params);
    var bindedParams = k.map(function (v) { return '?'; }).join(',');
    var keys = "(" + k.join(',') + " ) values ( " + bindedParams + " )";
    return query + " " + keys;
}
function singleOrDefault(query, params, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, row;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, rawQuery(query, params, transaction)];
                case 1:
                    _a = (_b.sent())[0], row = _a === void 0 ? null : _a;
                    return [2 /*return*/, row];
            }
        });
    });
}
var dbAPI = {
    generateConnection: generateConnection,
    getConnectionDB: getConnectionDB,
    start: start,
    commit: commit,
    singleOrDefault: singleOrDefault,
    rawQuery: rawQuery,
    rollback: rollback
};
exports.default = dbAPI;

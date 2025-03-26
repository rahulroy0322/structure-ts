// 1xx Informational
const CONTINUE = 100;
const SWITCHING_PROTOCOLS = 101;
const PROCESSING = 102;

// 2xx Success
const OK = 200;
const CREATED = 201;
const ACCEPTED = 202;
const NON_AUTHORITATIVE_INFORMATION = 203;
const NO_CONTENT = 204;
const RESET_CONTENT = 205;
const PARTIAL_CONTENT = 206;
const MULTI_STATUS = 207;
const ALREADY_REPORTED = 208;
const IM_USED = 226;

// 3xx Redirection
const MOVED_PERMANENTLY = 301;
const FOUND = 302;
const SEE_OTHER = 303;
const NOT_MODIFIED = 304;
const USE_PROXY = 305;
const TEMPORARY_REDIRECT = 307;
const PERMANENT_REDIRECT = 308;

// 4xx Client Errors
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const METHOD_NOT_ALLOWED = 405;
const NOT_ACCEPTABLE = 406;
const PROXY_AUTHENTICATION_REQUIRED = 407;
const REQUEST_TIMEOUT = 408;
const CONFLICT = 409;
const GONE = 410;
const LENGTH_REQUIRED = 411;
const PRECONDITION_FAILED = 412;
const PAYLOAD_TOO_LARGE = 413;
const URI_TOO_LONG = 414;
const UNSUPPORTED_MEDIA_TYPE = 415;
const RANGE_NOT_SATISFIABLE = 416;
const EXPECTATION_FAILED = 417;
const IM_A_TEAPOT = 418; // (April Fools' joke)
const MISDIRECTED_REQUEST = 421;
const UNPROCESSABLE_ENTITY = 422;
const LOCKED = 423;
const FAILED_DEPENDENCY = 424;
const TOO_EARLY = 425;
const UPGRADE_REQUIRED = 426;
const PRECONDITION_REQUIRED = 428;
const TOO_MANY_REQUESTS = 429;
const REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
const UNAVAILABLE_FOR_LEGAL_REASONS = 451;

// 5xx Server Errors
const INTERNAL_SERVER_ERROR = 500;
const NOT_IMPLEMENTED = 501;
const BAD_GATEWAY = 502;
const SERVICE_UNAVAILABLE = 503;
const GATEWAY_TIMEOUT = 504;
const HTTP_VERSION_NOT_SUPPORTED = 505;
const VARIANT_ALSO_NEGOTIATES = 506;
const INSUFFICIENT_STORAGE = 507;
const LOOP_DETECTED = 508;
const NOT_EXTENDED = 510;
const NETWORK_AUTHENTICATION_REQUIRED = 511;

// 1xx Informational
const continueRequest = () => {
  return CONTINUE;
};
const switchingProtocols = () => {
  return SWITCHING_PROTOCOLS;
};
const processing = () => {
  return PROCESSING;
};

// 2xx Success
const ok = () => {
  return OK;
};
const created = () => {
  return CREATED;
};
const accepted = () => {
  return ACCEPTED;
};
const nonAuthoritativeInformation = () => {
  return NON_AUTHORITATIVE_INFORMATION;
};
const noContent = () => {
  return NO_CONTENT;
};
const resetContent = () => {
  return RESET_CONTENT;
};
const partialContent = () => {
  return PARTIAL_CONTENT;
};
const multiStatus = () => {
  return MULTI_STATUS;
};
const alreadyReported = () => {
  return ALREADY_REPORTED;
};
const imUsed = () => {
  return IM_USED;
};

// 3xx Redirection
const movedPermanently = () => {
  return MOVED_PERMANENTLY;
};
const found = () => {
  return FOUND;
};
const seeOther = () => {
  return SEE_OTHER;
};
const notModified = () => {
  return NOT_MODIFIED;
};
const useProxy = () => {
  return USE_PROXY;
};
const temporaryRedirect = () => {
  return TEMPORARY_REDIRECT;
};
const permanentRedirect = () => {
  return PERMANENT_REDIRECT;
};

// 4xx Client Errors
const badRequest = () => {
  return BAD_REQUEST;
};
const unauthorized = () => {
  return UNAUTHORIZED;
};
const forbidden = () => {
  return FORBIDDEN;
};
const notFound = () => {
  return NOT_FOUND;
};
const methodNotAllowed = () => {
  return METHOD_NOT_ALLOWED;
};
const notAcceptable = () => {
  return NOT_ACCEPTABLE;
};
const proxyAuthenticationRequired = () => {
  return PROXY_AUTHENTICATION_REQUIRED;
};
const requestTimeout = () => {
  return REQUEST_TIMEOUT;
};
const conflict = () => {
  return CONFLICT;
};
const gone = () => {
  return GONE;
};
const lengthRequired = () => {
  return LENGTH_REQUIRED;
};
const preconditionFailed = () => {
  return PRECONDITION_FAILED;
};
const payloadTooLarge = () => {
  return PAYLOAD_TOO_LARGE;
};
const uriTooLong = () => {
  return URI_TOO_LONG;
};
const unsupportedMediaType = () => {
  return UNSUPPORTED_MEDIA_TYPE;
};
const rangeNotSatisfiable = () => {
  return RANGE_NOT_SATISFIABLE;
};
const expectationFailed = () => {
  return EXPECTATION_FAILED;
};
const imATeapot = () => {
  return IM_A_TEAPOT;
};
const misdirectedRequest = () => {
  return MISDIRECTED_REQUEST;
};
const unprocessableEntity = () => {
  return UNPROCESSABLE_ENTITY;
};
const locked = () => {
  return LOCKED;
};
const failedDependency = () => {
  return FAILED_DEPENDENCY;
};
const tooEarly = () => {
  return TOO_EARLY;
};
const upgradeRequired = () => {
  return UPGRADE_REQUIRED;
};
const preconditionRequired = () => {
  return PRECONDITION_REQUIRED;
};
const tooManyRequests = () => {
  return TOO_MANY_REQUESTS;
};
const requestHeaderFieldsTooLarge = () => {
  return REQUEST_HEADER_FIELDS_TOO_LARGE;
};
const unavailableForLegalReasons = () => {
  return UNAVAILABLE_FOR_LEGAL_REASONS;
};

// 5xx Server Errors
const internalServerError = () => {
  return INTERNAL_SERVER_ERROR;
};
const notImplemented = () => {
  return NOT_IMPLEMENTED;
};
const badGateway = () => {
  return BAD_GATEWAY;
};
const serviceUnavailable = () => {
  return SERVICE_UNAVAILABLE;
};
const gatewayTimeout = () => {
  return GATEWAY_TIMEOUT;
};
const httpVersionNotSupported = () => {
  return HTTP_VERSION_NOT_SUPPORTED;
};
const variantAlsoNegotiates = () => {
  return VARIANT_ALSO_NEGOTIATES;
};
const insufficientStorage = () => {
  return INSUFFICIENT_STORAGE;
};
const loopDetected = () => {
  return LOOP_DETECTED;
};
const notExtended = () => {
  return NOT_EXTENDED;
};
const networkAuthenticationRequired = () => {
  return NETWORK_AUTHENTICATION_REQUIRED;
};

export {
  continueRequest,
  switchingProtocols,
  processing,
  ok,
  created,
  accepted,
  nonAuthoritativeInformation,
  noContent,
  resetContent,
  partialContent,
  multiStatus,
  alreadyReported,
  imUsed,
  movedPermanently,
  found,
  seeOther,
  notModified,
  useProxy,
  temporaryRedirect,
  permanentRedirect,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  methodNotAllowed,
  notAcceptable,
  proxyAuthenticationRequired,
  requestTimeout,
  conflict,
  gone,
  lengthRequired,
  preconditionFailed,
  payloadTooLarge,
  uriTooLong,
  unsupportedMediaType,
  rangeNotSatisfiable,
  expectationFailed,
  imATeapot,
  misdirectedRequest,
  unprocessableEntity,
  locked,
  failedDependency,
  tooEarly,
  upgradeRequired,
  preconditionRequired,
  tooManyRequests,
  requestHeaderFieldsTooLarge,
  unavailableForLegalReasons,
  internalServerError,
  notImplemented,
  badGateway,
  serviceUnavailable,
  gatewayTimeout,
  httpVersionNotSupported,
  variantAlsoNegotiates,
  insufficientStorage,
  loopDetected,
  notExtended,
  networkAuthenticationRequired,
};

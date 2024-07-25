export class ApiRoutes {
  static NODE = '/v1/node';
  static NODES = '/nodes';
  static EXTERNAL_CLIENTS = '/extclients';
  static HOSTS = '/hosts';
  static NETWORKS = '/networks';
  static DNS = '/dns';
  static DNS_ADMIN = '/dns/adm';
  static LOGIN = '/users/adm/authenticate';
  static LOGIN_OAUTH = '/oauth/login';
  static SERVER_STATUS = '/server/status';
  static SERVER_CONFIG = '/server/getconfig';
  static ENROLLMENT_KEYS = '/v1/enrollment-keys';
  static USERS_ADMIN = '/users/adm';
  static USERS = '/users';
  static PENDING_USERS = '/users_pending';
  // static USER_GROUPS = '/usergroups';
  static METRICS = '/metrics';
  static METRICS_EXTERNAL_CLIENT = '/metrics-ext';
  static RESTART_TENANT = '/server/shutdown';
  static USER_ROLES = '/v1/users/roles';
  static USER_ROLE = '/v1/users/role';
  static USER_GROUPS = '/v1/users/groups';
  static USER_GROUP = '/v1/users/group';
  static USERS_INVITE = '/v1/users/invite';
  static USERS_INVITES = '/v1/users/invites';
  static USERS_INVITE_SIGNUP = '/v1/users/invite-signup';
}

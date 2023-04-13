import { useStore } from '@/store/store';
import { getNetworkRoute } from '@/utils/RouteUtils';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Layout,
  MenuProps,
  Modal,
  notification,
  Row,
  Skeleton,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
  Tag,
  Typography,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { PageProps } from '../../models/Page';
import './UsersPage.scss';
import { Network } from '@/models/Network';
import { extractErrorMsg } from '@/utils/ServiceUtils';
import { NetworksService } from '@/services/NetworksService';
import { UsersService } from '@/services/UsersService';
import { User } from '@/models/User';

export default function UsersPage(props: PageProps) {
  const [notify, notifyCtx] = notification.useNotification();
  const store = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usersSearch, setUsersSearch] = useState('');
  const [networksSearch, setNetworksSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');

  const confirmDeleteUser = useCallback(
    async (user: User) => {
      Modal.confirm({
        title: 'Delete user',
        content: `Are you sure you want to delete user ${user.username}?`,
        onOk: async () => {
          try {
            await UsersService.deleteUser(user.username);
            notify.success({ message: `User ${user.username} deleted` });
            setUsers((users) => users.filter((u) => u.username !== user.username));
          } catch (err) {
            notify.error({
              message: 'Failed to delete user',
              description: extractErrorMsg(err as any),
            });
          }
        },
      });
    },
    [notify]
  );

  const onEditUser = useCallback((user: User) => {}, []);

  const usersTableColumns: TableColumnsType<User> = useMemo(
    () => [
      {
        title: 'Username',
        dataIndex: 'username',
        sorter(a, b) {
          return a.username.localeCompare(b.username);
        },
        defaultSortOrder: 'ascend',
      },
      {
        title: 'Role',
        render(_, user) {
          return <Tag color={user.isadmin ? 'warning' : 'default'}>{user.isadmin ? 'Admin' : 'User'}</Tag>;
        },
      },
      {
        title: 'Groups',
        render(_, user) {
          return user.groups?.map((g) => <Typography.Text key={g}>{g}</Typography.Text>) ?? '';
        },
      },
      {
        width: '1rem',
        render(_, user) {
          return (
            <Dropdown
              placement="bottomRight"
              menu={{
                items: [
                  {
                    key: 'edit',
                    label: (
                      <Typography.Text
                        onClick={(ev) => {
                          ev.stopPropagation();
                          onEditUser(user);
                        }}
                      >
                        Edit
                      </Typography.Text>
                    ),
                  },
                  {
                    key: 'default',
                    label: (
                      <Typography.Text
                        onClick={(ev) => {
                          ev.stopPropagation();
                          confirmDeleteUser(user);
                        }}
                      >
                        Delete
                      </Typography.Text>
                    ),
                  },
                ] as MenuProps['items'],
              }}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          );
        },
      },
    ],
    [confirmDeleteUser, onEditUser]
  );

  const networksTableColumns: TableColumnsType<Network> = useMemo(
    () => [
      {
        title: 'Network',
        dataIndex: 'netid',
        render(_, network) {
          return <Link to={getNetworkRoute(network)}>{network.netid}</Link>;
        },
        sorter(a, b) {
          return a.netid.localeCompare(b.netid);
        },
        defaultSortOrder: 'ascend',
      },
      {
        title: 'Default Access Level',
        render(_, network) {
          switch (network.prosettings?.defaultaccesslevel) {
            case 0:
              return <Tag>0 - Network Admin</Tag>;
            case 1:
              return <Tag>1 - Host Access</Tag>;
            case 2:
              return <Tag>2 - Client Access</Tag>;
            case 3:
              return <Tag>3 - No Access</Tag>;
          }
        },
        sorter(a, b) {
          return (a.prosettings?.defaultaccesslevel ?? 0) - (b.prosettings?.defaultaccesslevel ?? 0);
        },
      },
      {
        title: 'Allowed Groups',
        render(_, network) {
          return network.prosettings?.allowedgroups.length;
        },
        sorter(a, b) {
          return (a.prosettings?.allowedgroups.length ?? 0) - (b.prosettings?.allowedgroups.length ?? 0);
        },
      },
      {
        title: 'Allowed Users',
        render(_, network) {
          return network.prosettings?.allowedusers.length;
        },
        sorter(a, b) {
          return (a.prosettings?.allowedusers.length ?? 0) - (b.prosettings?.allowedusers.length ?? 0);
        },
      },
    ],
    []
  );

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      return u.username.toLowerCase().includes(usersSearch.trim().toLowerCase());
    });
  }, [users, usersSearch]);

  const filteredNetworks = useMemo(
    () => store.networks.filter((net) => net.netid.toLocaleLowerCase().includes(networksSearch.trim().toLowerCase())),
    [store.networks, networksSearch]
  );

  // ui components
  const getUsersContent = useCallback(() => {
    return (
      <>
        <Row>
          <Col xs={24} md={8}>
            <Input
              size="large"
              placeholder="Search users"
              value={usersSearch}
              onChange={(ev) => setUsersSearch(ev.target.value)}
            />
          </Col>
          <Col xs={24} md={16} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                // TODO: create user
              }}
            >
              <PlusOutlined /> Add a User
            </Button>
          </Col>
        </Row>
        <Row className="" style={{ marginTop: '1rem' }}>
          <Col xs={24}>
            <Table columns={usersTableColumns} dataSource={filteredUsers} rowKey="username" />
          </Col>
        </Row>
      </>
    );
  }, [filteredUsers, usersSearch, usersTableColumns]);

  const getNetworkPermissionsContent = useCallback(() => {
    return (
      <>
        <Row>
          <Col xs={24} md={8}>
            <Input
              size="large"
              placeholder="Search networks"
              value={networksSearch}
              onChange={(ev) => setNetworksSearch(ev.target.value)}
            />
          </Col>
        </Row>
        <Row className="" style={{ marginTop: '1rem' }}>
          <Col xs={24}>
            <Table columns={networksTableColumns} dataSource={filteredNetworks} rowKey="netid" />
          </Col>
        </Row>
      </>
    );
  }, [networksSearch, networksTableColumns, filteredNetworks]);

  const getGropusContent = useCallback(() => {
    return <>hello</>;
  }, []);

  const tabs: TabsProps['items'] = useMemo(
    () => [
      {
        key: 'users',
        label: 'Users',
        children: getUsersContent(),
      },
      {
        key: 'network-permissions',
        label: 'Network Permissions',
        children: getNetworkPermissionsContent(),
      },
      {
        key: 'groups',
        label: 'Groups',
        children: getGropusContent(),
      },
    ],
    [getUsersContent, getNetworkPermissionsContent, getGropusContent]
  );

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const users = (await UsersService.getUsers()).data;
      setUsers(users);
    } catch (err) {
      notify.error({
        message: 'Failed to load users',
        description: extractErrorMsg(err as any),
      });
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <Layout.Content
      className="UsersPage"
      style={{ position: 'relative', height: '100%', padding: props.isFullScreen ? 0 : 24 }}
    >
      <Skeleton loading={isLoading} active title={true} className="page-padding">
        {users.length === 0 && (
          <>
            <Row
              className="page-padding"
              style={{
                background: 'linear-gradient(90deg, #52379F 0%, #B66666 100%)',
              }}
            >
              <Col xs={(24 * 2) / 3}>
                <Typography.Title level={3} style={{ color: 'white ' }}>
                  Users
                </Typography.Title>
                <Typography.Text style={{ color: 'white ' }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque amet modi cum aut doloremque dicta
                  reiciendis odit molestias nam animi enim et molestiae consequatur quas quo facere magni, maiores rem.
                </Typography.Text>
              </Col>
              <Col xs={(24 * 1) / 3} style={{ position: 'relative' }}>
                <Card className="header-card" style={{ height: '20rem', position: 'absolute', width: '100%' }}>
                  <Typography.Title level={3}>Add a User</Typography.Title>
                  <Typography.Text>Users access the Netmaker UI to configure their networks.</Typography.Text>
                  <Row style={{ marginTop: 'auto' }}>
                    <Col>
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => {
                          // TODO: create user
                        }}
                      >
                        <PlusOutlined /> Create a User
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: '8rem', padding: '0px 5.125rem' }} gutter={[0, 20]}>
              <Col xs={24}>
                <Typography.Title level={3}>Add a User</Typography.Title>
              </Col>

              <Col xs={7} style={{ marginRight: '1rem' }}>
                <Card>
                  <Typography.Title level={4} style={{ marginTop: '0px' }}>
                    Manage access to Netmaker
                  </Typography.Title>
                  <Typography.Text>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti, beatae quis. Possimus commodi
                    quas eveniet, nostrum iure eaque unde illo deleniti obcaecati aut aliquid ab sapiente ipsum soluta
                    ex quis.
                  </Typography.Text>
                </Card>
              </Col>
              <Col xs={7} style={{ marginRight: '1rem' }}>
                <Card>
                  <Typography.Title level={4} style={{ marginTop: '0px' }}>
                    Manage access to Netmaker
                  </Typography.Title>
                  <Typography.Text>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti, beatae quis. Possimus commodi
                    quas eveniet, nostrum iure eaque unde illo deleniti obcaecati aut aliquid ab sapiente ipsum soluta
                    ex quis.
                  </Typography.Text>
                </Card>
              </Col>
              <Col xs={7}>
                <Card>
                  <Typography.Title level={4} style={{ marginTop: '0px' }}>
                    Manage access to Netmaker
                  </Typography.Title>
                  <Typography.Text>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti, beatae quis. Possimus commodi
                    quas eveniet, nostrum iure eaque unde illo deleniti obcaecati aut aliquid ab sapiente ipsum soluta
                    ex quis.
                  </Typography.Text>
                </Card>
              </Col>
            </Row>
          </>
        )}
        {users.length > 0 && (
          <>
            <Row className="page-row-padding">
              <Col xs={24}>
                <Typography.Title level={3}>Users</Typography.Title>
              </Col>
            </Row>

            <Row className="page-row-padding" justify="space-between">
              <Col xs={24}>
                <Tabs defaultActiveKey="users" items={tabs} />
              </Col>
            </Row>
          </>
        )}
      </Skeleton>

      {/* misc */}
      {notifyCtx}
    </Layout.Content>
  );
}

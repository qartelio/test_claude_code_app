export type UserRole = 'candidate' | 'employer' | 'admin' | 'guest';

export interface CurrentUser {
  id: string;
  role: UserRole;
  displayName: string;
  tenantId: string | null;
}

export const DEMO_USERS: Readonly<Record<Exclude<UserRole, 'guest'>, CurrentUser>> = {
  candidate: {
    id: 'user-candidate-001',
    role: 'candidate',
    displayName: 'Ainura Nurlanova',
    tenantId: null,
  },
  employer: {
    id: 'user-employer-001',
    role: 'employer',
    displayName: 'Mehmet Yılmaz',
    tenantId: 'tenant-001',
  },
  admin: {
    id: 'user-admin-001',
    role: 'admin',
    displayName: 'Irina Petrova',
    tenantId: null,
  },
};

export const GUEST_USER: CurrentUser = {
  id: 'user-guest',
  role: 'guest',
  displayName: 'Guest',
  tenantId: null,
};

export type UserRole = {
    id: string;
    userId: string;
    roleId: string;
};

export type UserRoleCreateRequest = Omit<UserRole, "id">;

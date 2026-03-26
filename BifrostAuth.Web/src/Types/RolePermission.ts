export type RolePermission = {
    id: string;
    roleId: string;
    permissionId: string;
};

export type RolePermissionCreateRequest = Omit<RolePermission, "id">;

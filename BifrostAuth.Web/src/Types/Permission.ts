export type Permission = {
    id: string;
    name: string;
};

export type PermissionCreateRequest = Omit<Permission, "id">;

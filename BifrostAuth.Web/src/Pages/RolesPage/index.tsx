import {
    ActionsGroup,
    ActionButton,
    CreateButton,
    Header,
    InputLabel,
    ModalBody,
    Modal,
    ModalActions,
    ModalOverlay,
    PermissionBindingHint,
    ModalTitle,
    Page,
    PrimaryButton,
    SecondaryButton,
    Subtitle,
    Title,
    ViewGrid,
    ViewItem,
    ViewLabel,
    ViewValue
} from "./style";
import { useState } from "react";
import DataTable, { type DataTableColumn } from "../../Components/DataTable";
import type { Role, RoleCreateRequest } from "../../Types/Role";
import {
    createRole,
    deleteRole,
    getRoles,
    getRoleById,
    getRolesOData,
    updateRole
} from "../../Services/roleService";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import Input from "../../Components/Input";
import ConfirmationModal from "../../Components/ConfirmationModal";
import { useAlert } from "../../Contexts/AlertContext";
import type { Permission } from "../../Types/Permission";
import { getPermissions } from "../../Services/permissionService";
import FormSideBar, { type FormSideBarTab } from "../../Components/FormSideBar";
import {
    createRolePermission,
    deleteRolePermission,
    getRolePermissionsByRoleId
} from "../../Services/rolePermissionService";
import type { RolePermission } from "../../Types/RolePermission";

type RoleEditForm = {
    name: string;
};

type RoleFormTabId = "cadastro" | "permissoes";

function RolesPage() {
    const { showAlert } = useAlert();
    const formTabs: FormSideBarTab[] = [
        { id: "cadastro", label: "Cadastro" },
        { id: "permissoes", label: "Permissões" }
    ];
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
    const [createSelectedPermissionIds, setCreateSelectedPermissionIds] = useState<string[]>([]);
    const [editSelectedPermissionIds, setEditSelectedPermissionIds] = useState<string[]>([]);
    const [createActiveTab, setCreateActiveTab] = useState<RoleFormTabId>("cadastro");
    const [editActiveTab, setEditActiveTab] = useState<RoleFormTabId>("cadastro");
    const [tableRefreshTrigger, setTableRefreshTrigger] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
    const [actionError, setActionError] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeletingRole, setIsDeletingRole] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [deleteTargetRole, setDeleteTargetRole] = useState<Role | null>(null);
    const [editForm, setEditForm] = useState<RoleEditForm>({
        name: ""
    });
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const [createForm, setCreateForm] = useState<RoleCreateRequest>({
        name: ""
    });

    const handleToggleCreatePermission = (permissionId: string) => {
        setCreateSelectedPermissionIds((previous) =>
            previous.includes(permissionId)
                ? previous.filter((id) => id !== permissionId)
                : [...previous, permissionId]
        );
    };

    const handleToggleEditPermission = (permissionId: string) => {
        setEditSelectedPermissionIds((previous) =>
            previous.includes(permissionId)
                ? previous.filter((id) => id !== permissionId)
                : [...previous, permissionId]
        );
    };

    const loadRolePermissionLinks = async (roleId: string): Promise<RolePermission[]> => {
        const resultado = await getRolePermissionsByRoleId(roleId);
        if (resultado.status < 200 || resultado.status >= 300) {
            throw new Error(resultado.errorMessage ?? "Nao foi possivel carregar os vínculos do cargo.");
        }

        return resultado.data;
    };

    const syncRolePermissionLinks = async (roleId: string, selectedPermissionIds: string[]) => {
        const existingLinks = await loadRolePermissionLinks(roleId);
        const selectedSet = new Set(selectedPermissionIds);
        const existingByPermissionId = new Map(existingLinks.map((link) => [link.permissionId, link]));

        for (const permissionId of selectedSet) {
            if (existingByPermissionId.has(permissionId)) {
                continue;
            }

            const createResult = await createRolePermission({ roleId, permissionId });
            if (createResult.status < 200 || createResult.status >= 300) {
                throw new Error(createResult.errorMessage ?? "Nao foi possivel vincular o cargo a permissão.");
            }
        }

        for (const link of existingLinks) {
            if (selectedSet.has(link.permissionId)) {
                continue;
            }

            const deleteResult = await deleteRolePermission(link.id);
            if (deleteResult.status < 200 || deleteResult.status >= 300) {
                throw new Error(deleteResult.errorMessage ?? "Nao foi possivel remover o vínculo do cargo com a permissão.");
            }
        }
    };

    const permissionColumns: DataTableColumn<Permission>[] = [
        {
            key: "name",
            header: "PERMISSÃO",
            render: (permission) => permission.name
        }
    ];

    const renderBindingTable = (
        selectedIds: string[],
        onToggle: (permissionId: string) => void,
        rowKeyPrefix: string
    ) => {
        const bindingColumns: DataTableColumn<Permission>[] = [
            ...permissionColumns,
            {
                key: "vincular",
                header: "VINCULAR",
                width: "100px",
                align: "center",
                render: (permission) => (
                    <input
                        type="checkbox"
                        aria-label={`Vincular cargo na permissão ${permission.name}`}
                        checked={selectedIds.includes(permission.id)}
                        onChange={() => onToggle(permission.id)}
                    />
                )
            }
        ];

        return (
            <>
                <PermissionBindingHint>
                    Selecione as permissões vinculadas ao cargo.
                </PermissionBindingHint>
                <DataTable
                    columns={bindingColumns}
                    data={permissions}
                    searchableFields={["name"]}
                    searchPlaceholder="Pesquisar permissões..."
                    rowKey={(permission) => `${rowKeyPrefix}-${permission.id}`}
                    emptyMessage={
                        isLoadingPermissions ? "Carregando permissões..." : "Nenhuma permissão disponível."
                    }
                />
            </>
        );
    };

    const loadPermissionsForBinding = async () => {
        if (isLoadingPermissions || permissions.length > 0) {
            return;
        }

        setIsLoadingPermissions(true);

        try {
            const resultado = await getPermissions();
            if (resultado.status < 200 || resultado.status >= 300) {
                showAlert({
                    type: "error",
                    message: resultado.errorMessage ?? "Nao foi possivel carregar as permissões para vínculo."
                });
                setPermissions([]);
                setIsLoadingPermissions(false);
                return;
            }

            setPermissions(resultado.data);
        } catch {
            showAlert({
                type: "error",
                message: "Nao foi possivel carregar as permissões para vínculo."
            });
            setPermissions([]);
        }

        setIsLoadingPermissions(false);
    };

    const handleCreateTabChange = async (tabId: RoleFormTabId) => {
        setCreateActiveTab(tabId);

        if (tabId === "permissoes") {
            await loadPermissionsForBinding();
        }
    };

    const handleEditTabChange = async (tabId: RoleFormTabId) => {
        setEditActiveTab(tabId);

        if (tabId === "permissoes") {
            await loadPermissionsForBinding();
        }
    };

    const handleCreate = () => {
        setCreateActiveTab("cadastro");
        setCreateSelectedPermissionIds([]);
        setCreateForm({
            name: ""
        });
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        if (isSubmittingCreate) {
            return;
        }

        setIsCreateModalOpen(false);
        setCreateActiveTab("cadastro");
    };

    const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!createForm.name.trim()) {
            const message = "Preencha o nome do cargo para salvar.";
            showAlert({ type: "warning", message });
            return;
        }

        setIsSubmittingCreate(true);

        try {
            const resultado = await createRole(createForm);

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possível criar o cargo.";
                showAlert({ type: "error", message });
                return;
            }

            const refreshedRoles = await getRoles();
            const createdRole = resultado.data?.id
                ? resultado.data
                : refreshedRoles.data.find((role) => role.name === createForm.name);

            if (!createdRole) {
                throw new Error("Cargo criado, mas nao foi possivel identificar o registro para vincular permissões.");
            }

            await syncRolePermissionLinks(createdRole.id, createSelectedPermissionIds);

            setIsCreateModalOpen(false);
            showAlert({ type: "success", message: "Cargo criado com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch {
            const message = "Nao foi possível criar o cargo.";
            showAlert({ type: "error", message });
        } finally {
            setIsSubmittingCreate(false);
        }
    };

    const loadRoleById = async (id: string) => {
        setActionError("");
        setIsActionLoading(true);

        try {
            const resultado = await getRoleById(id);

            if (resultado.status < 200 || resultado.status >= 300 || !resultado.data) {
                const message = resultado.errorMessage ?? "Nao foi possível carregar os detalhes do cargo.";
                setActionError(message);
                showAlert({ type: "error", message });
                return null;
            }

            return resultado.data;
        } catch {
            const message = "Nao foi possível carregar os detalhes do cargo.";
            setActionError(message);
            showAlert({ type: "error", message });
            return null;
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleView = async (role: Role) => {
        const loadedRole = await loadRoleById(role.id);
        if (!loadedRole) {
            return;
        }

        setSelectedRole(loadedRole);
        setIsViewModalOpen(true);
    };

    const handleEdit = async (role: Role) => {
        const loadedRole = await loadRoleById(role.id);
        if (!loadedRole) {
            return;
        }

        try {
            const rolePermissions = await loadRolePermissionLinks(role.id);
            setEditSelectedPermissionIds(rolePermissions.map((item) => item.permissionId));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Nao foi possivel carregar os vínculos do cargo.";
            showAlert({ type: "error", message });
            return;
        }

        setSelectedRole(loadedRole);
        setEditActiveTab("cadastro");
        setEditForm({
            name: loadedRole.name
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (role: Role) => {
        setDeleteTargetRole(role);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (isDeletingRole) {
            return;
        }

        setIsDeleteModalOpen(false);
        setDeleteTargetRole(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTargetRole) {
            return;
        }

        setActionError("");
        setIsDeletingRole(true);

        try {
            const resultado = await deleteRole(deleteTargetRole.id);

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possível excluir o cargo.";
                setActionError(message);
                showAlert({ type: "error", message });
                return;
            }

            setIsDeleteModalOpen(false);
            setDeleteTargetRole(null);
            showAlert({ type: "success", message: "Cargo excluído com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch {
            const message = "Nao foi possível excluir o cargo.";
            setActionError(message);
            showAlert({ type: "error", message });
        } finally {
            setIsDeletingRole(false);
        }
    };

    const handleCloseViewModal = () => {
        if (isActionLoading) {
            return;
        }

        setIsViewModalOpen(false);
        setSelectedRole(null);
    };

    const handleCloseEditModal = () => {
        if (isSubmittingEdit) {
            return;
        }

        setIsEditModalOpen(false);
        setSelectedRole(null);
        setEditActiveTab("cadastro");
    };

    const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedRole) {
            const message = "Cargo nao encontrado.";
            showAlert({ type: "warning", message });
            return;
        }

        if (!editForm.name.trim()) {
            const message = "Preencha o nome do cargo para salvar.";
            showAlert({ type: "warning", message });
            return;
        }

        setIsSubmittingEdit(true);

        try {
            const payload: Role = {
                ...selectedRole,
                name: editForm.name
            };

            const resultado = await updateRole(payload);

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possível atualizar o cargo.";
                showAlert({ type: "error", message });
                return;
            }

            await syncRolePermissionLinks(selectedRole.id, editSelectedPermissionIds);

            setIsEditModalOpen(false);
            setSelectedRole(null);
            showAlert({ type: "success", message: "Cargo atualizado com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch {
            const message = "Nao foi possível atualizar o cargo.";
            showAlert({ type: "error", message });
        } finally {
            setIsSubmittingEdit(false);
        }
    };

    const columns: DataTableColumn<Role>[] = [
        {
            key: "id",
            header: "ID",
            render: (role) => role.id
        },
        {
            key: "name",
            header: "NOME",
            render: (role) => role.name
        },
        {
            key: "acoes",
            header: "AÇÕES",
            width: "180px",
            render: (role) => (
                <ActionsGroup>
                    <ActionButton
                        type="button"
                        aria-label="Visualizar cargo"
                        $variant="view"
                        onClick={() => handleView(role)}
                    >
                        <FaEye size={14} />
                    </ActionButton>
                    <ActionButton
                        type="button"
                        aria-label="Editar cargo"
                        $variant="edit"
                        onClick={() => handleEdit(role)}
                    >
                        <FaEdit size={14} />
                    </ActionButton>
                    <ActionButton
                        type="button"
                        aria-label="Excluir cargo"
                        $variant="danger"
                        onClick={() => handleDelete(role)}
                    >
                        <FaTrash size={14} />
                    </ActionButton>
                </ActionsGroup>
            )
        }
    ];

    return (
        <Page>
            <Header>
                <Title>Cargos</Title>
                <CreateButton type="button" onClick={handleCreate}>
                    <FaPlus size={12} />
                    Novo cargo
                </CreateButton>
            </Header>
            {errorMessage && <Subtitle>{errorMessage}</Subtitle>}
            {actionError && <Subtitle>{actionError}</Subtitle>}
            <DataTable
                columns={columns}
                searchableFields={["name"]}
                searchPlaceholder="Pesquisar cargos..."
                oDataFetcher={getRolesOData}
                refreshTrigger={tableRefreshTrigger}
                onFetchError={(message) => {
                    setErrorMessage(message);
                    showAlert({ type: "error", message });
                }}
                rowKey={(role) => role.id}
                emptyMessage="Nenhum cargo cadastrado."
            />

            {isCreateModalOpen && (
                <ModalOverlay onClick={handleCloseCreateModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Cadastro de cargo</ModalTitle>

                        <form onSubmit={handleCreateSubmit} noValidate>
                            <FormSideBar
                                tabs={formTabs}
                                activeTabId={createActiveTab}
                                onTabChange={(tabId) => handleCreateTabChange(tabId as RoleFormTabId)}
                            >
                                <ModalBody>
                                    {createActiveTab === "cadastro" && (
                                        <>
                                            <InputLabel htmlFor="novo-cargo-nome">Nome do cargo</InputLabel>
                                            <Input
                                                id="novo-cargo-nome"
                                                type="text"
                                                placeholder="Digite o nome do cargo"
                                                width="100%"
                                                height="40px"
                                                value={createForm.name}
                                                onChange={(event) =>
                                                    setCreateForm((previous) => ({ ...previous, name: event.target.value }))
                                                }
                                                required
                                            />
                                        </>
                                    )}

                                    {createActiveTab === "permissoes" && (
                                        <>
                                            {renderBindingTable(
                                                createSelectedPermissionIds,
                                                handleToggleCreatePermission,
                                                "create-role-permission"
                                            )}
                                        </>
                                    )}
                                </ModalBody>
                            </FormSideBar>

                            <ModalActions>
                                <SecondaryButton type="button" onClick={handleCloseCreateModal}>
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={isSubmittingCreate}>
                                    {isSubmittingCreate ? "Salvando..." : "Salvar"}
                                </PrimaryButton>
                            </ModalActions>
                        </form>
                    </Modal>
                </ModalOverlay>
            )}

            {isViewModalOpen && selectedRole && (
                <ModalOverlay onClick={handleCloseViewModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Visualizar cargo</ModalTitle>

                        <ViewGrid>
                            <ViewItem>
                                <ViewLabel>ID</ViewLabel>
                                <ViewValue>{selectedRole.id}</ViewValue>
                            </ViewItem>
                            <ViewItem>
                                <ViewLabel>NOME</ViewLabel>
                                <ViewValue>{selectedRole.name}</ViewValue>
                            </ViewItem>
                        </ViewGrid>

                        <ModalActions>
                            <SecondaryButton type="button" onClick={handleCloseViewModal}>
                                Fechar
                            </SecondaryButton>
                        </ModalActions>
                    </Modal>
                </ModalOverlay>
            )}

            {isEditModalOpen && selectedRole && (
                <ModalOverlay onClick={handleCloseEditModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Editar cargo</ModalTitle>

                        <form onSubmit={handleEditSubmit} noValidate>
                            <FormSideBar
                                tabs={formTabs}
                                activeTabId={editActiveTab}
                                onTabChange={(tabId) => handleEditTabChange(tabId as RoleFormTabId)}
                            >
                                <ModalBody>
                                    {editActiveTab === "cadastro" && (
                                        <>
                                            <InputLabel htmlFor="editar-cargo-nome">Nome do cargo</InputLabel>
                                            <Input
                                                id="editar-cargo-nome"
                                                type="text"
                                                placeholder="Digite o nome do cargo"
                                                width="100%"
                                                height="40px"
                                                value={editForm.name}
                                                onChange={(event) =>
                                                    setEditForm((previous) => ({ ...previous, name: event.target.value }))
                                                }
                                                required
                                            />
                                        </>
                                    )}

                                    {editActiveTab === "permissoes" && (
                                        <>
                                            {renderBindingTable(
                                                editSelectedPermissionIds,
                                                handleToggleEditPermission,
                                                "edit-role-permission"
                                            )}
                                        </>
                                    )}
                                </ModalBody>
                            </FormSideBar>

                            <ModalActions>
                                <SecondaryButton type="button" onClick={handleCloseEditModal}>
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={isSubmittingEdit}>
                                    {isSubmittingEdit ? "Salvando..." : "Salvar"}
                                </PrimaryButton>
                            </ModalActions>
                        </form>
                    </Modal>
                </ModalOverlay>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Excluir cargo"
                message={
                    deleteTargetRole
                        ? `Tem certeza que deseja excluir o cargo ${deleteTargetRole.name}?`
                        : "Tem certeza que deseja excluir este cargo?"
                }
                confirmText="Excluir"
                cancelText="Cancelar"
                isSubmitting={isDeletingRole}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
            />
        </Page>
    );
}

export default RolesPage;

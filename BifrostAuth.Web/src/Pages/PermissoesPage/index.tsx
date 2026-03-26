import {
    ActionsGroup,
    ActionButton,
    CreateButton,
    Header,
    InputLabel,
    Modal,
    ModalActions,
    ModalOverlay,
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
import type { Permission, PermissionCreateRequest } from "../../Types/Permission";
import {
    createPermission,
    deletePermission,
    getPermissionsOData,
    getPermissionById,
    updatePermission
} from "../../Services/permissionService";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import Input from "../../Components/Input";
import ConfirmationModal from "../../Components/ConfirmationModal";
import { useAlert } from "../../Contexts/AlertContext";

type PermissionEditForm = {
    name: string;
};

function PermissoesPage() {
    const { showAlert } = useAlert();
    const [tableRefreshTrigger, setTableRefreshTrigger] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
    const [actionError, setActionError] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeletingPermission, setIsDeletingPermission] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    const [deleteTargetPermission, setDeleteTargetPermission] = useState<Permission | null>(null);
    const [editForm, setEditForm] = useState<PermissionEditForm>({
        name: ""
    });
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const [createForm, setCreateForm] = useState<PermissionCreateRequest>({
        name: ""
    });

    const handleCreate = () => {
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
    };

    const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!createForm.name.trim()) {
            const message = "Preencha o nome das permissões para salvar.";
            showAlert({ type: "warning", message });
            return;
        }

        setIsSubmittingCreate(true);

        try {
            const resultado = await createPermission(createForm);

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possível criar as permissões.";
                showAlert({ type: "error", message });
                return;
            }

            setIsCreateModalOpen(false);
            showAlert({ type: "success", message: "Permissões criadas com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch {
            const message = "Nao foi possível criar as permissões.";
            showAlert({ type: "error", message });
        } finally {
            setIsSubmittingCreate(false);
        }
    };

    const loadPermissionById = async (id: string) => {
        setActionError("");
        setIsActionLoading(true);

        try {
            const resultado = await getPermissionById(id);

            if (resultado.status < 200 || resultado.status >= 300 || !resultado.data) {
                const message = resultado.errorMessage ?? "Nao foi possível carregar os detalhes das permissões.";
                setActionError(message);
                showAlert({ type: "error", message });
                return null;
            }

            return resultado.data;
        } catch {
            const message = "Nao foi possível carregar os detalhes das permissões.";
            setActionError(message);
            showAlert({ type: "error", message });
            return null;
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleView = async (permission: Permission) => {
        const loadedPermission = await loadPermissionById(permission.id);
        if (!loadedPermission) {
            return;
        }

        setSelectedPermission(loadedPermission);
        setIsViewModalOpen(true);
    };

    const handleEdit = async (permission: Permission) => {
        const loadedPermission = await loadPermissionById(permission.id);
        if (!loadedPermission) {
            return;
        }

        setSelectedPermission(loadedPermission);
        setEditForm({
            name: loadedPermission.name
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (permission: Permission) => {
        setDeleteTargetPermission(permission);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (isDeletingPermission) {
            return;
        }

        setIsDeleteModalOpen(false);
        setDeleteTargetPermission(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTargetPermission) {
            return;
        }

        setActionError("");
        setIsDeletingPermission(true);

        try {
            const resultado = await deletePermission(deleteTargetPermission.id);

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possível excluir as permissões.";
                setActionError(message);
                showAlert({ type: "error", message });
                return;
            }

            setIsDeleteModalOpen(false);
            setDeleteTargetPermission(null);
            showAlert({ type: "success", message: "Permissões excluídas com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch {
            const message = "Nao foi possível excluir as permissões.";
            setActionError(message);
            showAlert({ type: "error", message });
        } finally {
            setIsDeletingPermission(false);
        }
    };

    const handleCloseViewModal = () => {
        if (isActionLoading) {
            return;
        }

        setIsViewModalOpen(false);
        setSelectedPermission(null);
    };

    const handleCloseEditModal = () => {
        if (isSubmittingEdit) {
            return;
        }

        setIsEditModalOpen(false);
        setSelectedPermission(null);
    };

    const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedPermission) {
            const message = "Permissões nao encontradas.";
            showAlert({ type: "warning", message });
            return;
        }

        if (!editForm.name.trim()) {
            const message = "Preencha o nome das permissões para salvar.";
            showAlert({ type: "warning", message });
            return;
        }

        setIsSubmittingEdit(true);

        try {
            const payload: Permission = {
                ...selectedPermission,
                name: editForm.name
            };

            const resultado = await updatePermission(payload);

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possível atualizar as permissões.";
                showAlert({ type: "error", message });
                return;
            }

            setIsEditModalOpen(false);
            setSelectedPermission(null);
            showAlert({ type: "success", message: "Permissões atualizadas com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch {
            const message = "Nao foi possível atualizar as permissões.";
            showAlert({ type: "error", message });
        } finally {
            setIsSubmittingEdit(false);
        }
    };

    const columns: DataTableColumn<Permission>[] = [
        {
            key: "id",
            header: "ID",
            render: (permission) => permission.id
        },
        {
            key: "name",
            header: "NOME",
            render: (permission) => permission.name
        },
        {
            key: "acoes",
            header: "AÇÕES",
            width: "180px",
            render: (permission) => (
                <ActionsGroup>
                    <ActionButton
                        type="button"
                        aria-label="Visualizar permissões"
                        $variant="view"
                        onClick={() => handleView(permission)}
                    >
                        <FaEye size={14} />
                    </ActionButton>
                    <ActionButton
                        type="button"
                        aria-label="Editar permissões"
                        $variant="edit"
                        onClick={() => handleEdit(permission)}
                    >
                        <FaEdit size={14} />
                    </ActionButton>
                    <ActionButton
                        type="button"
                        aria-label="Excluir permissões"
                        $variant="danger"
                        onClick={() => handleDelete(permission)}
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
                <Title>Permissões</Title>
                <CreateButton type="button" onClick={handleCreate}>
                    <FaPlus size={12} />
                    Nova permissões
                </CreateButton>
            </Header>
            {errorMessage && <Subtitle>{errorMessage}</Subtitle>}
            {actionError && <Subtitle>{actionError}</Subtitle>}
            <DataTable
                columns={columns}
                searchableFields={["name"]}
                searchPlaceholder="Pesquisar permissões..."
                oDataFetcher={getPermissionsOData}
                refreshTrigger={tableRefreshTrigger}
                onFetchError={(message) => {
                    setErrorMessage(message);
                    showAlert({ type: "error", message });
                }}
                rowKey={(permission) => permission.id}
                emptyMessage="Nenhuma permissões cadastradas."
            />

            {isCreateModalOpen && (
                <ModalOverlay onClick={handleCloseCreateModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Cadastro de permissões</ModalTitle>

                        <form onSubmit={handleCreateSubmit} noValidate>
                            <InputLabel htmlFor="nova-permissoes-nome">Nome</InputLabel>
                            <Input
                                id="nova-permissoes-nome"
                                type="text"
                                placeholder="Digite o nome das permissões"
                                width="100%"
                                height="40px"
                                value={createForm.name}
                                onChange={(event) =>
                                    setCreateForm((previous) => ({ ...previous, name: event.target.value }))
                                }
                                required
                            />

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

            {isViewModalOpen && selectedPermission && (
                <ModalOverlay onClick={handleCloseViewModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Visualizar permissões</ModalTitle>

                        <ViewGrid>
                            <ViewItem>
                                <ViewLabel>ID</ViewLabel>
                                <ViewValue>{selectedPermission.id}</ViewValue>
                            </ViewItem>
                            <ViewItem>
                                <ViewLabel>NOME</ViewLabel>
                                <ViewValue>{selectedPermission.name}</ViewValue>
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

            {isEditModalOpen && selectedPermission && (
                <ModalOverlay onClick={handleCloseEditModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Editar permissões</ModalTitle>

                        <form onSubmit={handleEditSubmit} noValidate>
                            <InputLabel htmlFor="editar-permissoes-nome">Nome das permissões</InputLabel>
                            <Input
                                id="editar-permissoes-nome"
                                type="text"
                                placeholder="Digite o nome das permissões"
                                width="100%"
                                height="40px"
                                value={editForm.name}
                                onChange={(event) =>
                                    setEditForm((previous) => ({ ...previous, name: event.target.value }))
                                }
                                required
                            />

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
                title="Excluir permissões"
                message={
                    deleteTargetPermission
                        ? `Tem certeza que deseja excluir as permissões ${deleteTargetPermission.name}?`
                        : "Tem certeza que deseja excluir estas permissões?"
                }
                confirmText="Excluir"
                cancelText="Cancelar"
                isSubmitting={isDeletingPermission}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
            />
        </Page>
    );
}

export default PermissoesPage;

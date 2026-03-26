import {
    ActionsGroup,
    ActionButton,
    Badge,
    CheckboxRow,
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
import type { Application, ApplicationCreateRequest } from "../../Types/Application";
import {
    createApplication,
    deleteApplication,
    getOData as getApplicationsOData,
    getApplicationById,
    updateApplication
} from "../../Services/applicationService";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import Input from "../../Components/Input";
import ConfirmationModal from "../../Components/ConfirmationModal";
import { useAlert } from "../../Contexts/AlertContext";

type ApplicationEditForm = {
    name: string;
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    isActive: boolean;
};

function isValidHttpUrl(value: string): boolean {
    try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

function ApplicationPage() {
    const { showAlert } = useAlert();
    const [tableRefreshTrigger, setTableRefreshTrigger] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
    const [actionError, setActionError] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeletingApplication, setIsDeletingApplication] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [deleteTargetApplication, setDeleteTargetApplication] = useState<Application | null>(null);
    const [editForm, setEditForm] = useState<ApplicationEditForm>({
        name: "",
        clientId: "",
        clientSecret: "",
        redirectUrl: "",
        isActive: true
    });
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const [createForm, setCreateForm] = useState<ApplicationCreateRequest>({
        name: "",
        clientId: "",
        clientSecret: "",
        redirectUrl: "",
        isActive: true
    });

    const handleCreate = () => {
        setCreateForm({
            name: "",
            clientId: "",
            clientSecret: "",
            redirectUrl: "",
            isActive: true
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

        if (!createForm.name.trim() || !createForm.clientId.trim() || !createForm.clientSecret.trim() || !createForm.redirectUrl.trim()) {
            const message = "Preencha todos os campos obrigatorios.";
            showAlert({ type: "warning", message });
            return;
        }

        if (!isValidHttpUrl(createForm.redirectUrl)) {
            const message = "Informe uma Redirect URL valida (http ou https).";
            showAlert({ type: "warning", message });
            return;
        }

        setIsSubmittingCreate(true);

        try {
            const resultado = await createApplication(createForm);

            if (resultado.status !== 201) {
                const message = resultado.errorMessage ?? "Nao foi possivel criar a aplicação.";
                showAlert({ type: "error", message });
                return;
            }

            setIsCreateModalOpen(false);
            showAlert({ type: "success", message: "Aplicação criada com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch {
            const message = "Nao foi possivel criar a aplicação.";
            showAlert({ type: "error", message });
        } finally {
            setIsSubmittingCreate(false);
        }
    };

    const loadApplicationById = async (id: string) => {
        setActionError("");
        setIsActionLoading(true);

        try {
            const resultado = await getApplicationById(id);

            if (resultado.status < 200 || resultado.status >= 300 || !resultado.data) {
                const message = resultado.errorMessage ?? "Nao foi possivel carregar os detalhes da aplicação.";
                setActionError(message);
                showAlert({ type: "error", message });
                return null;
            }

            return resultado.data;
        } catch {
            const message = "Nao foi possivel carregar os detalhes da aplicação.";
            setActionError(message);
            showAlert({ type: "error", message });
            return null;
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleView = async (application: Application) => {
        const loadedApplication = await loadApplicationById(application.id);
        if (!loadedApplication) {
            return;
        }

        setSelectedApplication(loadedApplication);
        setIsViewModalOpen(true);
    };

    const handleEdit = async (application: Application) => {
        const loadedApplication = await loadApplicationById(application.id);
        if (!loadedApplication) {
            return;
        }

        setSelectedApplication(loadedApplication);
        setEditForm({
            name: loadedApplication.name,
            clientId: loadedApplication.clientId,
            clientSecret: loadedApplication.clientSecret,
            redirectUrl: loadedApplication.redirectUrl,
            isActive: loadedApplication.isActive
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (application: Application) => {
        setDeleteTargetApplication(application);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (isDeletingApplication) {
            return;
        }

        setIsDeleteModalOpen(false);
        setDeleteTargetApplication(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTargetApplication) {
            return;
        }

        setActionError("");
        setIsDeletingApplication(true);

        try {
            const resultado = await deleteApplication(deleteTargetApplication.id);

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possivel excluir a aplicação.";
                setActionError(message);
                showAlert({ type: "error", message });
                return;
            }

            setIsDeleteModalOpen(false);
            setDeleteTargetApplication(null);
            showAlert({ type: "success", message: "Aplicação excluida com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch {
            const message = "Nao foi possivel excluir a aplicação.";
            setActionError(message);
            showAlert({ type: "error", message });
        } finally {
            setIsDeletingApplication(false);
        }
    };

    const handleCloseViewModal = () => {
        if (isActionLoading) {
            return;
        }

        setIsViewModalOpen(false);
        setSelectedApplication(null);
    };

    const handleCloseEditModal = () => {
        if (isSubmittingEdit) {
            return;
        }

        setIsEditModalOpen(false);
        setSelectedApplication(null);
    };

    const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedApplication) {
            const message = "Aplicação nao encontrada.";
            showAlert({ type: "warning", message });
            return;
        }

        if (!editForm.name.trim() || !editForm.clientId.trim() || !editForm.clientSecret.trim() || !editForm.redirectUrl.trim()) {
            const message = "Preencha todos os campos obrigatorios para salvar.";
            showAlert({ type: "warning", message });
            return;
        }

        if (!isValidHttpUrl(editForm.redirectUrl)) {
            const message = "Informe uma Redirect URL valida (http ou https).";
            showAlert({ type: "warning", message });
            return;
        }

        setIsSubmittingEdit(true);

        try {
            const payload: Application = {
                ...selectedApplication,
                name: editForm.name,
                clientId: editForm.clientId,
                clientSecret: editForm.clientSecret,
                redirectUrl: editForm.redirectUrl,
                isActive: editForm.isActive
            };

            const resultado = await updateApplication(payload);

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possivel atualizar a aplicação.";
                showAlert({ type: "error", message });
                return;
            }

            setIsEditModalOpen(false);
            setSelectedApplication(null);
            showAlert({ type: "success", message: "Aplicação atualizada com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch {
            const message = "Nao foi possivel atualizar a aplicação.";
            showAlert({ type: "error", message });
        } finally {
            setIsSubmittingEdit(false);
        }
    };

    const columns: DataTableColumn<Application>[] = [
        {
            key: "id",
            header: "ID",
            render: (application) => application.id
        },
        {
            key: "name",
            header: "NOME",
            render: (application) => application.name
        },
        {
            key: "clientId",
            header: "CLIENT ID",
            render: (application) => application.clientId
        },
        {
            key: "redirectUrl",
            header: "REDIRECT URL",
            render: (application) => application.redirectUrl
        },
        {
            key: "isActive",
            header: "STATUS",
            width: "110px",
            render: (application) => (
                <Badge $status={application.isActive ? "Ativo" : "Inativo"}>
                    {application.isActive ? "Ativo" : "Inativo"}
                </Badge>
            )
        },
        {
            key: "acoes",
            header: "AÇÕES",
            width: "180px",
            render: (application) => (
                <ActionsGroup>
                    <ActionButton
                        type="button"
                        aria-label="Visualizar aplicação"
                        $variant="view"
                        onClick={() => handleView(application)}
                    >
                        <FaEye size={14} />
                    </ActionButton>
                    <ActionButton
                        type="button"
                        aria-label="Editar aplicação"
                        $variant="edit"
                        onClick={() => handleEdit(application)}
                    >
                        <FaEdit size={14} />
                    </ActionButton>
                    <ActionButton
                        type="button"
                        aria-label="Excluir aplicação"
                        $variant="danger"
                        onClick={() => handleDelete(application)}
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
                <Title>Aplicações</Title>
                <CreateButton type="button" onClick={handleCreate}>
                    <FaPlus size={12} />
                    Nova Aplicação
                </CreateButton>
            </Header>
            {errorMessage && <Subtitle>{errorMessage}</Subtitle>}
            {actionError && <Subtitle>{actionError}</Subtitle>}
            <DataTable
                columns={columns}
                searchableFields={["name", "clientId", "redirectUrl"]}
                searchPlaceholder="Pesquisar aplicações..."
                oDataFetcher={getApplicationsOData}
                refreshTrigger={tableRefreshTrigger}
                onFetchError={(message) => {
                    setErrorMessage(message);
                    showAlert({ type: "error", message });
                }}
                rowKey={(application) => application.id}
                emptyMessage="Nenhuma aplicação cadastrada."
            />

            {isCreateModalOpen && (
                <ModalOverlay onClick={handleCloseCreateModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Nova Aplicação</ModalTitle>

                        <form onSubmit={handleCreateSubmit} noValidate>
                            <InputLabel htmlFor="nova-aplicacao-nome">Nome</InputLabel>
                            <Input
                                id="nova-aplicacao-nome"
                                type="text"
                                placeholder="Digite o nome"
                                width="100%"
                                height="40px"
                                value={createForm.name}
                                onChange={(event) =>
                                    setCreateForm((previous) => ({ ...previous, name: event.target.value }))
                                }
                                required
                            />

                            <InputLabel htmlFor="nova-aplicacao-client-id">Client ID</InputLabel>
                            <Input
                                id="nova-aplicacao-client-id"
                                type="text"
                                placeholder="Digite o client id"
                                width="100%"
                                height="40px"
                                value={createForm.clientId}
                                onChange={(event) =>
                                    setCreateForm((previous) => ({ ...previous, clientId: event.target.value }))
                                }
                                required
                            />

                            <InputLabel htmlFor="nova-aplicacao-client-secret">Client Secret</InputLabel>
                            <Input
                                id="nova-aplicacao-client-secret"
                                type="text"
                                placeholder="Digite o client secret"
                                width="100%"
                                height="40px"
                                value={createForm.clientSecret}
                                onChange={(event) =>
                                    setCreateForm((previous) => ({ ...previous, clientSecret: event.target.value }))
                                }
                                required
                            />

                            <InputLabel htmlFor="nova-aplicacao-redirect-url">Redirect URL</InputLabel>
                            <Input
                                id="nova-aplicacao-redirect-url"
                                type="url"
                                placeholder="https://sua-aplicação/callback"
                                width="100%"
                                height="40px"
                                value={createForm.redirectUrl}
                                onChange={(event) =>
                                    setCreateForm((previous) => ({ ...previous, redirectUrl: event.target.value }))
                                }
                                required
                            />

                            <CheckboxRow>
                                <input
                                    id="aplicacao-ativa"
                                    type="checkbox"
                                    checked={createForm.isActive}
                                    onChange={(event) =>
                                        setCreateForm((previous) => ({ ...previous, isActive: event.target.checked }))
                                    }
                                />
                                <label htmlFor="aplicacao-ativa">Aplicação ativa</label>
                            </CheckboxRow>

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

            {isViewModalOpen && selectedApplication && (
                <ModalOverlay onClick={handleCloseViewModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Visualizar Aplicação</ModalTitle>

                        <ViewGrid>
                            <ViewItem>
                                <ViewLabel>ID</ViewLabel>
                                <ViewValue>{selectedApplication.id}</ViewValue>
                            </ViewItem>
                            <ViewItem>
                                <ViewLabel>NOME</ViewLabel>
                                <ViewValue>{selectedApplication.name}</ViewValue>
                            </ViewItem>
                            <ViewItem>
                                <ViewLabel>CLIENT ID</ViewLabel>
                                <ViewValue>{selectedApplication.clientId}</ViewValue>
                            </ViewItem>
                            <ViewItem>
                                <ViewLabel>CLIENT SECRET</ViewLabel>
                                <ViewValue>{selectedApplication.clientSecret}</ViewValue>
                            </ViewItem>
                            <ViewItem>
                                <ViewLabel>REDIRECT URL</ViewLabel>
                                <ViewValue>{selectedApplication.redirectUrl}</ViewValue>
                            </ViewItem>
                            <ViewItem>
                                <ViewLabel>STATUS</ViewLabel>
                                <ViewValue>{selectedApplication.isActive ? "Ativo" : "Inativo"}</ViewValue>
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

            {isEditModalOpen && selectedApplication && (
                <ModalOverlay onClick={handleCloseEditModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Editar Aplicação</ModalTitle>

                        <form onSubmit={handleEditSubmit} noValidate>
                            <InputLabel htmlFor="editar-aplicacao-nome">Nome</InputLabel>
                            <Input
                                id="editar-aplicacao-nome"
                                type="text"
                                placeholder="Digite o nome"
                                width="100%"
                                height="40px"
                                value={editForm.name}
                                onChange={(event) =>
                                    setEditForm((previous) => ({ ...previous, name: event.target.value }))
                                }
                                required
                            />

                            <InputLabel htmlFor="editar-aplicacao-client-id">Client ID</InputLabel>
                            <Input
                                id="editar-aplicacao-client-id"
                                type="text"
                                placeholder="Digite o client id"
                                width="100%"
                                height="40px"
                                value={editForm.clientId}
                                onChange={(event) =>
                                    setEditForm((previous) => ({ ...previous, clientId: event.target.value }))
                                }
                                required
                            />

                            <InputLabel htmlFor="editar-aplicacao-client-secret">Client Secret</InputLabel>
                            <Input
                                id="editar-aplicacao-client-secret"
                                type="text"
                                placeholder="Digite o client secret"
                                width="100%"
                                height="40px"
                                value={editForm.clientSecret}
                                onChange={(event) =>
                                    setEditForm((previous) => ({ ...previous, clientSecret: event.target.value }))
                                }
                                required
                            />

                            <InputLabel htmlFor="editar-aplicacao-redirect-url">Redirect URL</InputLabel>
                            <Input
                                id="editar-aplicacao-redirect-url"
                                type="url"
                                placeholder="https://sua-aplicação/callback"
                                width="100%"
                                height="40px"
                                value={editForm.redirectUrl}
                                onChange={(event) =>
                                    setEditForm((previous) => ({ ...previous, redirectUrl: event.target.value }))
                                }
                                required
                            />

                            <CheckboxRow>
                                <input
                                    id="editar-aplicacao-ativa"
                                    type="checkbox"
                                    checked={editForm.isActive}
                                    onChange={(event) =>
                                        setEditForm((previous) => ({ ...previous, isActive: event.target.checked }))
                                    }
                                />
                                <label htmlFor="editar-aplicacao-ativa">Aplicação ativa</label>
                            </CheckboxRow>

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
                title="Excluir aplicação"
                message={
                    deleteTargetApplication
                    ? `Tem certeza que deseja excluir a aplicação ${deleteTargetApplication.name}?`
                    : "Tem certeza que deseja excluir esta aplicação?"
                }
                confirmText="Excluir"
                cancelText="Cancelar"
                isSubmitting={isDeletingApplication}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
            />
        </Page>
    );
}

export default ApplicationPage;

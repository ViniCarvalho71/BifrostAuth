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
import { useEffect, useState } from "react";
import DataTable, { type DataTableColumn } from "../../Components/DataTable";
import type { Application, ApplicationCreateRequest } from "../../Types/Application";
import {
    createApplication,
    deleteApplication,
    getApplicationById,
    getApplications,
    updateApplication
} from "../../Services/applicationService";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import Input from "../../Components/Input";
import ConfirmationModal from "../../Components/ConfirmationModal";

type ApplicationEditForm = {
    name: string;
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    isActive: boolean;
};

function ApplicationPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
    const [createError, setCreateError] = useState("");
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
    const [editError, setEditError] = useState("");
    const [createForm, setCreateForm] = useState<ApplicationCreateRequest>({
        name: "",
        clientId: "",
        clientSecret: "",
        redirectUrl: "",
        isActive: true
    });

    const loadApplications = async () => {
        setIsLoading(true);
        setErrorMessage("");

        const resultado = await getApplications();

        if (resultado.status < 200 || resultado.status >= 300) {
            setApplications([]);
            setErrorMessage("Nao foi possivel carregar as aplicacoes.");
            setIsLoading(false);
            return;
        }

        setApplications(resultado.data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadApplications();
    }, []);

    const handleCreate = () => {
        setCreateError("");
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
        setCreateError("");
    };

    const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateError("");
        setIsSubmittingCreate(true);

        try {
            const resultado = await createApplication(createForm);

            if (resultado.status < 200 || resultado.status >= 300) {
                setCreateError("Nao foi possivel criar a aplicacao.");
                return;
            }

            setIsCreateModalOpen(false);
            await loadApplications();
        } catch {
            setCreateError("Nao foi possivel criar a aplicacao.");
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
                setActionError("Nao foi possivel carregar os detalhes da aplicacao.");
                return null;
            }

            return resultado.data;
        } catch {
            setActionError("Nao foi possivel carregar os detalhes da aplicacao.");
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
        setEditError("");
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
                setActionError("Nao foi possivel excluir a aplicacao.");
                return;
            }

            setIsDeleteModalOpen(false);
            setDeleteTargetApplication(null);
            await loadApplications();
        } catch {
            setActionError("Nao foi possivel excluir a aplicacao.");
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
        setEditError("");
        setSelectedApplication(null);
    };

    const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedApplication) {
            setEditError("Aplicacao nao encontrada.");
            return;
        }

        setEditError("");
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
                setEditError("Nao foi possivel atualizar a aplicacao.");
                return;
            }

            setIsEditModalOpen(false);
            setSelectedApplication(null);
            await loadApplications();
        } catch {
            setEditError("Nao foi possivel atualizar a aplicacao.");
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
                        aria-label="Visualizar aplicacao"
                        $variant="view"
                        onClick={() => handleView(application)}
                    >
                        <FaEye size={14} />
                    </ActionButton>
                    <ActionButton
                        type="button"
                        aria-label="Editar aplicacao"
                        $variant="edit"
                        onClick={() => handleEdit(application)}
                    >
                        <FaEdit size={14} />
                    </ActionButton>
                    <ActionButton
                        type="button"
                        aria-label="Excluir aplicacao"
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
                <Title>Aplicacoes</Title>
                <CreateButton type="button" onClick={handleCreate}>
                    <FaPlus size={12} />
                    Nova Aplicacao
                </CreateButton>
            </Header>
            {errorMessage && <Subtitle>{errorMessage}</Subtitle>}
            {actionError && <Subtitle>{actionError}</Subtitle>}
            <DataTable
                columns={columns}
                data={applications}
                rowKey={(application) => application.id}
                emptyMessage={isLoading ? "Carregando aplicacoes..." : "Nenhuma aplicacao cadastrada."}
            />

            {isCreateModalOpen && (
                <ModalOverlay onClick={handleCloseCreateModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Nova Aplicacao</ModalTitle>

                        <form onSubmit={handleCreateSubmit}>
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
                                placeholder="https://sua-aplicacao/callback"
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
                                <label htmlFor="aplicacao-ativa">Aplicacao ativa</label>
                            </CheckboxRow>

                            {createError && <Subtitle>{createError}</Subtitle>}

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
                        <ModalTitle>Visualizar Aplicacao</ModalTitle>

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
                        <ModalTitle>Editar Aplicacao</ModalTitle>

                        <form onSubmit={handleEditSubmit}>
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
                                placeholder="https://sua-aplicacao/callback"
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
                                <label htmlFor="editar-aplicacao-ativa">Aplicacao ativa</label>
                            </CheckboxRow>

                            {editError && <Subtitle>{editError}</Subtitle>}

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
                title="Excluir aplicacao"
                message={
                    deleteTargetApplication
                        ? `Tem certeza que deseja excluir a aplicacao ${deleteTargetApplication.name}?`
                        : "Tem certeza que deseja excluir esta aplicacao?"
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

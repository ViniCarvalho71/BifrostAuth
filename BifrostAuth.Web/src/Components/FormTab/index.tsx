import { TabButton } from "./style";

type FormTabProps = {
    label: string;
    isActive: boolean;
    onClick: () => void;
};

function FormTab({ label, isActive, onClick }: FormTabProps) {
    return (
        <TabButton type="button" $active={isActive} onClick={onClick}>
            {label}
        </TabButton>
    );
}

export default FormTab;

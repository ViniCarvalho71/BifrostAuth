import type { ReactNode } from "react";
import FormTab from "../FormTab";
import { Content, Layout, Sidebar } from "./style";

export type FormSideBarTab = {
    id: string;
    label: string;
};

type FormSideBarProps = {
    tabs: FormSideBarTab[];
    activeTabId: string;
    onTabChange: (tabId: string) => void;
    children: ReactNode;
};

function FormSideBar({ tabs, activeTabId, onTabChange, children }: FormSideBarProps) {
    return (
        <Layout>
            <Sidebar>
                {tabs.map((tab) => (
                    <FormTab
                        key={tab.id}
                        label={tab.label}
                        isActive={tab.id === activeTabId}
                        onClick={() => onTabChange(tab.id)}
                    />
                ))}
            </Sidebar>
            <Content>{children}</Content>
        </Layout>
    );
}

export default FormSideBar;

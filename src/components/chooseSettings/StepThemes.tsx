import React, { useEffect } from "react";
import TagSelector from "@/components/tags/TagSelector";

type Props = {
    allTags: string[];
    selectedTags: string[];
    onChange: (tags: string[]) => void;
    preselectedTags?: string[];
};

export default function StepThemes({ allTags, selectedTags, onChange, preselectedTags, }: Props) {

    useEffect(() => {
        if (selectedTags.length === 0 && preselectedTags?.length) {
            onChange(preselectedTags);
        }
    }, []);

    return (
        <TextWrapper>
            <TagSelector
                mode="select"
                allTags={allTags}
                selectedTags={selectedTags}
                onChange={onChange}
            />
        </TextWrapper>
    );
}

const TextWrapper = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
);
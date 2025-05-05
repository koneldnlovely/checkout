
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export interface AdminToolsHeaderProps {
  title: string;
  onSave: () => Promise<void>;
}

const AdminToolsHeader: React.FC<AdminToolsHeaderProps> = ({ title, onSave }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex space-x-2">
        <Button onClick={onSave} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default AdminToolsHeader;

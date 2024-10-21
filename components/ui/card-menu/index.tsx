import React from "react";
import { MoreVertical, Edit, Trash } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "../menu";

interface CardMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const CardMenu: React.FC<CardMenuProps> = ({ onEdit, onDelete }) => {
  return (
    <Menu
      className="bg-gray-800/70 backdrop-blur-sm border-blue-500 "
      trigger={({ ...triggerProps }) => (
        <TouchableOpacity {...triggerProps}>
          <MoreVertical size={24} color="#fff" />
        </TouchableOpacity>
      )}
      placement="bottom right"
      offset={5}
    >
      <MenuItem
        key="edit"
        onPress={onEdit}
        textValue="Editar"
        className="[data-active=true]:bg-gray-100/70"
      >
        <Edit size={20} color="white" />
        <MenuItemLabel size="md" className="ml-2">
          Editar
        </MenuItemLabel>
      </MenuItem>
      <MenuSeparator />
      <MenuItem key="delete" onPress={onDelete} textValue="Deletar">
        <Trash size={20} color="white" className="mr-2" />
        <MenuItemLabel size="md" className="ml-2">
          Deletar
        </MenuItemLabel>
      </MenuItem>
    </Menu>
  );
};

export default CardMenu;

import React, { useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../modal";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ActivityIndicator } from "react-native";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="w-11/12 border shadow-lg bg-gray-900/90 backdrop-blur-sm border-red-500">
        <ModalHeader>
          <Text className="text-lg font-bold text-gray-100 text-center w-full">
            Confirmar Exclusão
          </Text>
          <ModalCloseButton onPress={onClose} />
        </ModalHeader>
        <ModalBody>
          <VStack className="w-full h-full items-center mt-3">
            <Text className="text-sm text-gray-400 mb-4">
              Tem certeza de que deseja excluir este livro?
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            onPress={onConfirm}
            className={`w-11/12 mb-2 bg-red-600 data-[active=true]:bg-red-600/80`}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-gray-100">Confirmar</Text>
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;

import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
} from "@/components/ui/modal";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { HStack } from "../hstack";
import { CheckCircle, RefreshCcw, XCircle } from "lucide-react-native";

interface AppConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppConfigModal: React.FC<AppConfigModalProps> = ({ isOpen, onClose }) => {
  const [host, setHost] = useState(process.env.EXPO_PUBLIC_API_URL || "");
  const [pingResult, setPingResult] = useState<boolean | null>(null);

  useEffect(() => {
    const loadHost = async () => {
      const savedHost =
        (await AsyncStorage.getItem("host")) || process.env.EXPO_PUBLIC_API_URL;
      if (savedHost) {
        setHost(savedHost);
        await checkServerStatus(savedHost);
      }
    };
    loadHost();
  }, [isOpen]);

  const saveHost = async () => {
    if (!host) return;
    await AsyncStorage.setItem("host", host);
    onClose();
  };

  const checkServerStatus = async (url: string) => {
    try {
      const response = await axios.get(`${url}/auth/ping`);
      console.log(response.data);
      setPingResult(response.data.pong === true);
    } catch (error) {
      setPingResult(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="w-11/12 border p-6 shadow-lg bg-gray-900/90 backdrop-blur-sm border-blue-500">
        <ModalHeader>
          <Text className="text-lg font-bold text-gray-100">
            Configurar Host
          </Text>
          <ModalCloseButton onPress={onClose} />
        </ModalHeader>
        <ModalBody>
          <VStack className="flex-col w-full h-full">
            <VStack className="mt-3 w-full">
              <Text className="text-sm text-gray-400 mb-4">
                Insira o novo endereço do host
              </Text>
              <HStack className="w-full">
                <HStack className="w-5/6">
                  <Input
                    size="lg"
                    className="h-12 flex w-full rounded-md border text-sm placeholder:text-muted-foreground bg-gray-700 border-blue-500 text-gray-100"
                  >
                    <InputField
                      size="lg"
                      type="text"
                      cursorColor={"#3b82f6"}
                      placeholder="http://example.com"
                      placeholderTextColor={"#4b5563"}
                      value={host}
                      onChangeText={setHost}
                    />
                    <Button
                      onPress={() => checkServerStatus(host)}
                      className="text-center mr-1 bg-blue-600 data-[active=true]:bg-blue-600/80"
                    >
                      <ButtonIcon
                        as={RefreshCcw}
                        className="text-gray-100 data-[active=true]:text-gray-100"
                      />
                    </Button>
                  </Input>
                </HStack>
              </HStack>
              {pingResult !== null && (
                <HStack className="mt-4 items-center">
                  {pingResult ? (
                    <CheckCircle color="#22c55e" size={20} />
                  ) : (
                    <XCircle color="#ef4444" size={20} />
                  )}
                  <Text className="text-sm text-gray-400 ml-2">
                    {pingResult
                      ? "Servidor funcionando"
                      : "Falha ao conectar ao servidor"}
                  </Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter className="flex-col items-center">
          <Button
            onPress={saveHost}
            className="w-11/12 mb-2 text-center mt-4 bg-blue-600 data-[active=true]:bg-blue-600/80"
          >
            <Text className="text-gray-100 text-center">Salvar</Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const useAppConfigModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  const openModal = useCallback(() => setIsVisible(true), []);
  const closeModal = useCallback(() => setIsVisible(false), []);

  return {
    isVisible,
    openModal,
    closeModal,
  };
};

export default AppConfigModal;

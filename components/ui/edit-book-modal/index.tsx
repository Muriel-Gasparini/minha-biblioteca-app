import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "../modal";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  RadioGroup,
  Radio,
  RadioIndicator,
  RadioIcon,
  RadioLabel,
} from "../radio";
import { CircleIcon } from "lucide-react-native";

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    titulo?: string;
    autor?: string;
    anoPublicacao?: number;
    genero?: string;
    statusLeitura?: "LIDO" | "NAO_LIDO";
  };
  onSave: (book: any) => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({
  isOpen,
  onClose,
  book,
  onSave,
}) => {
  const [titulo, setTitulo] = useState(book?.titulo);
  const [autor, setAutor] = useState(book?.autor);
  const [anoPublicacao, setAnoPublicacao] = useState(book?.anoPublicacao);
  const [genero, setGenero] = useState(book?.genero);
  const [statusLeitura, setStatusLeitura] = useState(book?.statusLeitura);

  const handleSave = () => {
    const updatedBook = {
      ...book,
      titulo,
      autor,
      anoPublicacao,
      genero,
      statusLeitura,
    };
    onSave(updatedBook);
    onClose();
  };

  useEffect(() => {
    setTitulo(book?.titulo);
    setAutor(book?.autor);
    setAnoPublicacao(book?.anoPublicacao);
    setGenero(book?.genero);
    setStatusLeitura(book?.statusLeitura);
  }, [book]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="w-11/12 border p-6 shadow-lg bg-gray-900/90 backdrop-blur-sm border-blue-500">
        <ModalHeader>
          <VStack>
            <Heading size="md" className="text-typography-950">
              Editar Livro
            </Heading>
            <Text className="text-sm text-gray-400">
              Atualize os detalhes do livro
            </Text>
          </VStack>
          <ModalCloseButton onPress={onClose} />
        </ModalHeader>
        <ModalBody>
          <VStack className="w-full h-full items-center mt-3">
            <VStack space="xs" className="w-11/12 mb-6">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Titulo
              </Text>
              <Input
                size="lg"
                className="flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 border-blue-500 text-gray-100"
              >
                <InputField
                  type="text"
                  value={titulo}
                  onChangeText={setTitulo}
                  cursorColor={"#3b82f6"}
                  placeholderTextColor={"#4b5563"}
                />
              </Input>
            </VStack>
            <VStack space="xs" className="w-11/12 mb-6">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Autor
              </Text>
              <Input
                size="lg"
                className="flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 border-blue-500 text-gray-100"
              >
                <InputField
                  type="text"
                  value={autor}
                  onChangeText={setAutor}
                  cursorColor={"#3b82f6"}
                  placeholderTextColor={"#4b5563"}
                />
              </Input>
            </VStack>
            <VStack space="xs" className="w-11/12 mb-6">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Ano de Publicação
              </Text>
              <Input
                size="lg"
                className="flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 border-blue-500 text-gray-100"
              >
                <InputField
                  type="text"
                  value={anoPublicacao?.toString()}
                  onChangeText={(text) =>
                    setAnoPublicacao(text ? parseInt(text) : undefined)
                  }
                  cursorColor={"#3b82f6"}
                  placeholderTextColor={"#4b5563"}
                />
              </Input>
            </VStack>
            <VStack space="xs" className="w-11/12 mb-6">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Gênero
              </Text>
              <Input
                size="lg"
                className="flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 border-blue-500 text-gray-100"
              >
                <InputField
                  type="text"
                  value={genero}
                  onChangeText={setGenero}
                  cursorColor={"#3b82f6"}
                  placeholderTextColor={"#4b5563"}
                />
              </Input>
            </VStack>
            <VStack className="w-11/12 justify-start">
              <Text className="text-sm font-medium leading-none text-gray-100 mb-2">
                Status da Leitura
              </Text>
              <RadioGroup value={statusLeitura} onChange={setStatusLeitura}>
                <Radio value="LIDO" size="md">
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel>Lido</RadioLabel>
                </Radio>
                <Radio value="NAO_LIDO" size="md">
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel>Não Lido</RadioLabel>
                </Radio>
              </RadioGroup>
            </VStack>
            <Button
              onPress={handleSave}
              className="w-11/12 mt-4 bg-blue-600 data-[active=true]:bg-blue-600/80"
            >
              <Text className="text-gray-100">Salvar</Text>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditBookModal;

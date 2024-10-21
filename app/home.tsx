import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Book, LogOut } from "lucide-react-native";

import debounce from "./utils/debounce";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/app/context/auth";
import { Badge } from "@/components/ui/badge";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import CardMenu from "@/components/ui/card-menu";
import { Heading } from "@/components/ui/heading";
import axiosInstance from "@/app/utils/axios-instance";
import { AddIcon, SearchIcon } from "@/components/ui/icon";
import { Button, ButtonIcon } from "@/components/ui/button";
import EditBookModal from "@/components/ui/edit-book-modal";
import CreateBookModal from "@/components/ui/create-book-modal";
import { LinearGradient } from "@/components/ui/linear-gradient";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

export interface IBook {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacao: string;
  statusLeitura: "LIDO" | "NAO_LIDO";
  usuario: string;
}

const Home = () => {
  const { logout } = useAuth();
  const [books, setBooks] = useState<IBook[]>([]);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookToDelete, setBookToDelete] = useState<IBook | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  const fetchBooks = async (search = "") => {
    try {
      setError("");
      setRefreshing(true);
      const response = await axiosInstance.get(`/livros?search=${search}`);
      setBooks(response.data);
    } catch (error) {
      setError("Erro ao buscar livros. Tente novamente.");
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    await fetchBooks(searchQuery);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleEdit = (book: IBook) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleDelete = (book: IBook) => {
    setBookToDelete(book);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/livros/${bookToDelete.id}`);
      setBookToDelete(null);
      await fetchBooks(searchQuery);
    } catch (error) {
      setError("Erro ao excluir livro. Tente novamente.");
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchQuery);
  }, [searchQuery]);

  return (
    <SafeAreaView>
      <LinearGradient
        className="flex-col w-full h-full"
        colors={["#111827", "#1e3a8a", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Box
          style={{
            paddingTop: StatusBar?.currentHeight
              ? StatusBar.currentHeight + 20
              : 0,
          }}
          className="mb-6 w-full bg-gray-800/50 backdrop-blur-sm border-b border-blue-500 py-6 px-4 flex flex-row justify-between items-center"
        >
          <HStack>
            <Heading
              className="whitespace-nowrap tracking-tight text-3xl font-bold text-white mr-2"
              size="3xl"
            >
              Minha Biblioteca
            </Heading>
          </HStack>
          <HStack>
            <Button
              onPress={handleLogout}
              className="rounded-lg data-[active=true]:bg-red-600 text-card-foreground shadow-sm overflow-hidden hover:shadow-lg bg-transparent backdrop-blur-sm border border-gray-100/70"
            >
              <ButtonIcon as={LogOut} className="text-gray-100/90" size="xl" />
            </Button>
          </HStack>
        </Box>
        <HStack className="w-full  justify-center items-center mb-6">
          <Input
            size="lg"
            style={{ width: "75%" }}
            className="p-1 h-12 flex rounded-md border text-sm placeholder:text-muted-foreground bg-gray-700 border-blue-500 text-gray-100"
          >
            <InputSlot>
              <InputIcon className="ml-2 text-gray-100/70" as={SearchIcon} />
            </InputSlot>
            <InputField
              size="lg"
              type="text"
              cursorColor={"#3b82f6"}
              placeholder="Pesquisar por título ou autor"
              placeholderTextColor={"#4b5563"}
              onChangeText={handleSearch}
            />
          </Input>
          <Button
            size="lg"
            className="ml-3 p-1 w-16 h-12 flex items-center justify-center rounded-lg border border-blue-500/70 text-sm bg-transparent data-[active=true]:bg-blue-500/10 data-[active=true]:border-gray-100"
            onPress={() => setCreateModalVisible(true)}
          >
            <ButtonIcon
              as={AddIcon}
              className="text-blue-500 data-[active=true]:text-gray-100"
            />
          </Button>
        </HStack>
        <VStack className="w-full flex-col items-center mb-6">
          {error && <Text className="text-red-500 mb-3">{error}</Text>}
          <ScrollView
            style={{ height: "80%", width: "100%" }}
            contentContainerStyle={{
              alignItems: "center",
              paddingBottom: 15,
              paddingTop: 10,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                colors={["#2563eb"]}
                onRefresh={onRefresh}
              />
            }
          >
            {books.length > 0
              ? books.map((book) => (
                  <Card
                    key={book.id}
                    className="w-11/12 p-6 rounded-lg border text-card-foreground shadow-sm hover:shadow-lg bg-gray-800/50 backdrop-blur-sm border-blue-500 mb-4"
                  >
                    <HStack className="justify-between align-items-center mb-4">
                      <Book color="#3b82f6" size={50} />
                      <CardMenu
                        onEdit={() => handleEdit(book)}
                        onDelete={() => handleDelete(book)}
                      />
                    </HStack>
                    <Text className="text-xl font-semibold text-gray-100 mb-2">
                      {book.titulo}
                    </Text>
                    <Text className="text-sm text-gray-300 mb-1">
                      {book.autor}
                    </Text>
                    <HStack className="justify-between">
                      <Text className="text-xs text-gray-400 mb-1">
                        {book.genero} - {book.anoPublicacao}
                      </Text>
                      <Badge
                        className={`text-center border px-4 whitespace-nowrap rounded-full border-none drop-shadow-lg h-9 font-semibold ${
                          book.statusLeitura === "LIDO"
                            ? "bg-blue-500 border-gray-100/70"
                            : "bg-blue-500/10 border-blue-500/70"
                        } text-white`}
                      >
                        <Text className="text-gray-100 text-sm text-center">
                          {book.statusLeitura === "LIDO" ? "Lido" : "Não Lido"}
                        </Text>
                      </Badge>
                    </HStack>
                  </Card>
                ))
              : !refreshing && (
                  <Text className="text-gray-400">
                    Nenhum livro encontrado.
                  </Text>
                )}
          </ScrollView>
          <LinearGradient
            colors={["transparent", "#111827"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
              zIndex: 1,
            }}
          />
        </VStack>

        <EditBookModal
          isOpen={!!selectedBook}
          onClose={handleCloseModal}
          book={selectedBook}
          onSave={() => {
            fetchBooks(searchQuery);
            setSelectedBook(null);
          }}
        />

        <CreateBookModal
          isOpen={isCreateModalVisible}
          onClose={() => setCreateModalVisible(false)}
          onSave={() => {
            fetchBooks(searchQuery);
            setCreateModalVisible(false);
          }}
        />

        <ConfirmationModal
          isOpen={!!bookToDelete}
          onClose={() => setBookToDelete(null)}
          onConfirm={confirmDelete}
          loading={deleteLoading}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Home;

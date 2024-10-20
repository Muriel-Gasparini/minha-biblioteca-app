import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { AddIcon, SearchIcon } from "@/components/ui/icon";
import { Book, LogOut } from "lucide-react-native";
import { Badge } from "@/components/ui/badge";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import axiosInstance from "@/app/utils/axios-instance";
import { useAuth } from "@/app/context/auth";
import CardMenu from "@/components/ui/card-menu";
import EditBookModal from "@/components/ui/edit-book-modal";
import CreateBookModal from "@/components/ui/create-book-modal";

interface IBook {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacao: string;
  statusLeitura: "lido" | "nao lido";
  usuario: string;
}

const Home = () => {
  const { logout } = useAuth();
  const [books, setBooks] = useState<IBook[]>([]);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooks = async () => {
    try {
      setError("");
      setRefreshing(true);
      const response = await axiosInstance.get("/livros");
      setBooks(response.data);
    } catch (error) {
      setError("Erro ao buscar livros. Tente novamente.");
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    await fetchBooks();
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleEdit = (book: IBook) => {
    setSelectedBook(book);
    setEditModalVisible(true);
  };

  const handleCloseModal = () => {
    setEditModalVisible(false);
    setSelectedBook(null);
  };

  const handleSaveEdit = async (updatedBook: IBook) => {
    try {
      const { id, usuario, ...bookToUpdate } = updatedBook;
      await axiosInstance.patch(`/livros/${id}`, bookToUpdate);
      await fetchBooks();
      setEditModalVisible(false);
      setSelectedBook(null);
    } catch (error) {
      setError("Erro ao atualizar livro. Tente novamente.");
      console.error(error);
    }
  };

  const handleCreateBook = async (newBook: Omit<IBook, "id" | "usuario">) => {
    try {
      await axiosInstance.post("/livros", newBook);
      await fetchBooks();
      setCreateModalVisible(false);
    } catch (error) {
      setError("Erro ao criar livro. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor={"#0f172a"} />
      <LinearGradient
        className="flex-col w-full h-full"
        colors={["#111827", "#1e3a8a", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Box
          style={{ marginTop: StatusBar.currentHeight }}
          className="mb-6 w-full h-24 bg-gray-800/50 backdrop-blur-sm border-b border-blue-500 py-6 px-4 flex flex-row justify-between items-center"
        >
          <HStack>
            <Text className="text-3xl font-bold text-gray-100 ">
              Minha Biblioteca
            </Text>
          </HStack>
          <HStack>
            <Button
              onPress={handleLogout}
              className="rounded-full data-[active=true]:bg-gray-500/80 text-card-foreground shadow-sm overflow-hidden hover:shadow-lg bg-gray-800/50 backdrop-blur-sm border border-white"
            >
              <LogOut color="white" size={20} />
            </Button>
          </HStack>
        </Box>
        <VStack className="w-full justify-center flex-row items-center flex-col mb-6">
          <Input
            size="lg"
            className="p-1 h-12 flex w-11/12 rounded-md border text-sm placeholder:text-muted-foreground bg-gray-700 border-blue-500 text-gray-100"
          >
            <InputSlot>
              <InputIcon className="ml-2" as={SearchIcon} />
            </InputSlot>
            <InputField
              size="lg"
              type="text"
              cursorColor={"#3b82f6"}
              placeholder="Pesquisar por título ou autor"
              placeholderTextColor={"#4b5563"}
            />
          </Input>
        </VStack>
        <VStack className="w-full flex-col items-center mb-6">
          {error && <Text className="text-red-500 mb-3">{error}</Text>}
          <ScrollView
            style={{ height: "78.5%", width: "100%" }}
            contentContainerStyle={{
              alignItems: "center",
              paddingBottom: 100,
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
                        onDelete={() => console.log("Delete", book.id)}
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
                        className={`text-center px-4 whitespace-nowrap rounded-full border-none drop-shadow-lg h-9 font-semibold ${
                          book.statusLeitura === "lido"
                            ? "bg-green-600"
                            : "bg-red-600"
                        } text-white`}
                      >
                        <Text className="text-gray-100 text-sm text-center">
                          {book.statusLeitura === "lido" ? "Lido" : "Não Lido"}
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
        <Fab
          size="lg"
          className="active:bg-blue-600/80 text-card-foreground shadow-sm overflow-hidden hover:shadow-lg bg-blue-600 backdrop-blur-sm border-none"
          placement="bottom right"
          onPress={() => setCreateModalVisible(true)}
        >
          <FabIcon as={AddIcon} className="text-gray-100" />
          <FabLabel className="text-gray-100">Novo Livro</FabLabel>
        </Fab>

        <EditBookModal
          onSave={handleSaveEdit}
          isOpen={!!selectedBook}
          onClose={handleCloseModal}
          book={selectedBook}
        />

        <CreateBookModal
          onSave={handleCreateBook}
          isOpen={isCreateModalVisible}
          onClose={() => setCreateModalVisible(false)}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Home;

// Array para armazenar todos os livros da biblioteca 
let books = []; 
 
// Referências aos elementos HTML importantes 
const bookForm = document.getElementById('bookForm'); // Formulário de adição 
const bookList = document.getElementById('bookList'); // Lista de livros 
const messageDiv = document.getElementById('message'); // Div de mensagens 
 
// Quando o documento estiver completamente carregado 
document.addEventListener('DOMContentLoaded', function() { 
    loadBooksFromStorage(); // Carrega livros do armazenamento local 
    renderBooks(); // Exibe os livros na tela 
}); 
 
// Adiciona evento de submit ao formulário 
bookForm.addEventListener('submit', function(e) { 
    e.preventDefault(); // Impede o comportamento padrão do formulário 
     
    // Obtém os valores dos campos do formulário 
    const title = document.getElementById('title').value; 
    const author = document.getElementById('author').value; 
    const year = document.getElementById('year').value; 
     
    // Verifica se o livro já existe na biblioteca 
    const existingBook = books.find(book =>  
        book.title.toLowerCase() === title.toLowerCase() &&  
        book.author.toLowerCase() === author.toLowerCase() 
    ); 
     
    // Se o livro já existe, mostra mensagem de erro 
    if (existingBook) { 
        showMessage('Este livro já está na biblioteca!', 'error'); 
        return; // Para a execução da função 
    } 
     
    // Cria um novo objeto livro 
    const newBook = { 
        id: Date.now(), // ID único baseado no timestamp atual 
        title: title, // Título do livro 
        author: author, // Autor do livro 
        year: year, // Ano de publicação 
        status: 'disponível' // Status inicial 
    }; 
     
    // Adiciona o novo livro ao array 
    books.push(newBook); 
    saveBooksToStorage(); // Salva no armazenamento local 
    renderBooks(); // Atualiza a exibição 
    bookForm.reset(); // Limpa o formulário 
    showMessage('Livro adicionado com sucesso!', 'success'); // Mensagem de sucesso 
}); 
 
// Função para exibir a lista de livros na tela 
function renderBooks() { 
    bookList.innerHTML = ''; // Limpa a lista atual 
     
    // Se não há livros, exibe mensagem 
    if (books.length === 0) { 
        bookList.innerHTML = '<p>Nenhum livro cadastrado ainda.</p>'; 
        return; // Para a execução da função 
    } 
     
    // Para cada livro no array, cria um elemento na lista 
    books.forEach(book => { 
        const bookItem = document.createElement('li'); // Cria elemento li 
        bookItem.className = 'book-item'; // Adiciona classe CSS 
         
        // Define o HTML interno do item do livro 
        bookItem.innerHTML = ` 
            <div class="book-info"> 
                <div class="book-title">${book.title}</div> 
                <div class="book-author">${book.author} (${book.year})</div> 
                <div class="book-status ${book.status === 'disponível' ? 'disponivel' : 'alugado'}"> 
                    Status: ${book.status} 
                </div> 
            </div> 
            <div class="actions"> 
                ${book.status === 'disponível'  
                    ? `<button class="alugar" onclick="rentBook(${book.id})">Alugar</button>`  
                    : `<button class="devolver" onclick="returnBook(${book.id})">Devolver</button>` 
                } 
                <button onclick="removeBook(${book.id})">Remover</button> 
            </div> 
        `; 
         
        // Adiciona o item à lista 
        bookList.appendChild(bookItem); 
    }); 
} 
 
// Função para alugar um livro 
function rentBook(id) { 
    // Encontra o livro pelo ID 
    const book = books.find(book => book.id === id); 
     
    // Se o livro existe e está disponível, altera o status 
    if (book && book.status === 'disponível') { 
        book.status = 'alugado'; 
        saveBooksToStorage(); // Salva alterações 
        renderBooks(); // Atualiza a exibição 
        showMessage(`Livro "${book.title}" alugado com sucesso!`, 'success'); 
    } 
} 
 
// Função para devolver um livro 
function returnBook(id) { 
    // Encontra o livro pelo ID 
    const book = books.find(book => book.id === id); 
     
    // Se o livro existe e está alugado, altera o status 
    if (book && book.status === 'alugado') { 
        book.status = 'disponível'; 
        saveBooksToStorage(); // Salva alterações 
        renderBooks(); // Atualiza a exibição 
        showMessage(`Livro "${book.title}" devolvido com sucesso!`, 'success'); 
    } 
} 
 
// Função para remover um livro da biblioteca 
function removeBook(id) { 
    // Confirma se o usuário realmente quer remover 
    if (confirm('Tem certeza que deseja remover este livro?')) { 
        // Filtra o array, mantendo apenas livros com ID diferente 
        books = books.filter(book => book.id !== id); 
        saveBooksToStorage(); // Salva alterações 
        renderBooks(); // Atualiza a exibição 
        showMessage('Livro removido com sucesso!', 'success'); 
    } 
} 
 
// Função para exibir mensagens temporárias 
function showMessage(text, type) { 
    messageDiv.textContent = text; // Define o texto da mensagem 
    messageDiv.className = `message ${type}`; // Define as classes CSS 
    messageDiv.classList.remove('hidden'); // Torna visível 
     
    // Após 3 segundos, esconde a mensagem 
    setTimeout(() => { 
        messageDiv.classList.add('hidden'); 
    }, 3000); 
} 
 
// Função para salvar os livros no armazenamento local do navegador 
function saveBooksToStorage() { 
    localStorage.setItem('libraryBooks', JSON.stringify(books)); 
} 
 
// Função para carregar os livros do armazenamento local 
function loadBooksFromStorage() { 
    // Obtém os dados do armazenamento local 
    const storedBooks = localStorage.getItem('libraryBooks'); 
     
    // Se existem dados, converte de volta para array 
    if (storedBooks) { 
        books = JSON.parse(storedBooks); 
    } 
} 

// Seletores de elementos HTML onde as informações do personagem serão exibidas
const characterName = document.querySelector('.character__name');
const characterNumber = document.querySelector('.character__number');
const characterStatus = document.querySelector('.character__status');
const characterGender = document.querySelector('.character__gender');
const characterImage = document.querySelector('.character__image');

// Seletores do formulário e dos botões de navegação
const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

// Variável para manter o ID do personagem atual
let searchCharacter = 1; // Inicia com o primeiro personagem

// Função assíncrona para buscar um personagem na API
const fetchCharacter = async (query) => {
    // Define a URL da API baseada na consulta
    let url = `https://rickandmortyapi.com/api/character/${query}`;

    // Se a consulta não for um número, assume-se que é uma busca pelo nome
    if (isNaN(query)) {
        url = `https://rickandmortyapi.com/api/character/?name=${query}`;
    }

    // Faz a requisição para a API
    const APIResponse = await fetch(url);

    // Retorna os dados se a resposta for bem-sucedida
    if (APIResponse.status == 200) {
        const data = await APIResponse.json();
        return data;
    } else {
        // Retorna null se houver algum problema com a requisição
        return null;
    }
}

// Função assíncrona para renderizar os dados do personagem na página
const renderCharacter = async (query) => {
    // Exibe uma mensagem de carregamento enquanto a busca é realizada
    characterName.innerHTML = 'Loading...';
    characterStatus.innerHTML = 'Loading...';
    characterGender.innerHTML = 'Loading...';

    // Busca os dados do personagem
    const data = await fetchCharacter(query);

    if (data) {
        // Se a busca foi pelo nome, 'data.results' será uma lista
        if (Array.isArray(data.results)) {
            // Se houver resultados, exibe o primeiro
            if (data.results.length > 0) {
                const character = data.results[0];
                characterName.innerHTML = character.name;
                characterNumber.innerHTML = character.id;
                characterStatus.innerHTML = character.status;
                characterGender.innerHTML = character.gender;
                characterImage.src = character.image;
                input.value = ''; // Limpa o campo de pesquisa
                searchCharacter = character.id; // Atualiza o ID do personagem atual
            } else {
                // Se nenhum personagem foi encontrado
                characterName.innerHTML = 'Not found :c';
                characterGender.innerHTML = 'Not found :c';
                characterStatus.innerHTML = 'Not found :c';
                characterNumber.innerHTML = '#';
                characterImage.src = '../imagens/not_found.png'; // Imagem de erro
            }
        } else {
            // Se a resposta não for uma lista, é um ID específico
            const character = data;
            characterName.innerHTML = character.name;
            characterNumber.innerHTML = character.id;
            characterStatus.innerHTML = character.status;
            characterGender.innerHTML = character.gender;
            characterImage.src = character.image;
            input.value = ''; // Limpa o campo de pesquisa
            searchCharacter = character.id; // Atualiza o ID do personagem atual
        }
    } else {
        // Se não houver resposta válida da API
        characterName.innerHTML = 'Not found :c';
        characterGender.innerHTML = 'Not found :c';
        characterStatus.innerHTML = 'Not found :c';
        characterNumber.innerHTML = '#';
        characterImage.src = '../imagens/not_found.png'; // Imagem de erro
    }
}

// Adiciona um listener para o envio do formulário
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita o envio padrão do formulário
    renderCharacter(input.value.trim().toLowerCase()); // Renderiza o personagem baseado na pesquisa
});

// Adiciona um listener para o botão de "anterior"
buttonPrev.addEventListener('click', () => {
    if (searchCharacter > 1) {
        searchCharacter -= 1; // Decrementa o ID do personagem
        renderCharacter(searchCharacter); // Renderiza o personagem anterior
    }
});

// Adiciona um listener para o botão de "próximo"
buttonNext.addEventListener('click', () => {
    searchCharacter += 1; // Incrementa o ID do personagem
    renderCharacter(searchCharacter); // Renderiza o próximo personagem
});

// Renderiza o personagem inicial ao carregar a página
renderCharacter(searchCharacter);

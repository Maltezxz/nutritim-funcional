# Nutritim Funcional

Um aplicativo móvel desenvolvido com React Native e Expo para análise nutricional de alimentos.

## 📱 Sobre o Projeto

O Nutritim Funcional é um aplicativo que permite aos usuários analisar alimentos através de fotos e obter informações nutricionais detalhadas. O app utiliza inteligência artificial para identificar alimentos e fornecer dados nutricionais precisos.

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Linguagem de programação tipada
- **Supabase** - Backend como serviço (BaaS)
- **Expo Router** - Sistema de navegação
- **React Navigation** - Navegação entre telas
- **Expo Camera** - Funcionalidade de câmera
- **Lucide React Native** - Ícones

## 📋 Funcionalidades

- 📸 **Análise de Alimentos**: Tire fotos de alimentos para análise nutricional
- 📊 **Informações Nutricionais**: Obtenha dados detalhados sobre nutrientes
- 📈 **Histórico**: Acompanhe suas análises anteriores
- 👤 **Perfil do Usuário**: Gerencie suas informações pessoais
- 💳 **Sistema de Assinatura**: Acesso premium a funcionalidades avançadas

## 🛠️ Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Expo

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/nutritim-funcional.git
cd nutritim-funcional
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione sua chave da API OpenAI:
   ```
   OPENAI_API_KEY=sua-chave-aqui
   ```

4. Execute o projeto:
```bash
npm run dev
```

5. Abra o app no seu dispositivo:
   - Instale o app Expo Go no seu smartphone
   - Escaneie o QR code que aparecerá no terminal

## 📁 Estrutura do Projeto

```
project/
├── app/                    # Telas e navegação
│   ├── (tabs)/           # Navegação por abas
│   ├── api/              # Endpoints da API
│   └── ...
├── assets/               # Imagens e recursos
├── hooks/               # Custom hooks
├── lib/                 # Configurações (Supabase, etc.)
├── supabase/            # Funções do Supabase
└── ...
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build:web` - Gera build para web
- `npm run lint` - Executa o linter

## 📱 Telas Principais

- **Home**: Tela principal com funcionalidades de análise
- **Análise**: Interface para análise de alimentos
- **Histórico**: Lista de análises anteriores
- **Perfil**: Configurações do usuário
- **Assinatura**: Gerenciamento de planos premium

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

---

Desenvolvido com ❤️ para ajudar na jornada nutricional das pessoas. 
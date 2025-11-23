# Documentação do Diagrama de Casos de Uso: Sistema de Gestão de Ciclistas e Pedais

## 1. Visão Geral

Este documento descreve o Diagrama de Casos de Uso do "Sistema de Gestão de Ciclistas e Pedais". O diagrama ilustra as funcionalidades principais do sistema a partir da perspectiva dos usuários, identificando os atores envolvidos e as ações que eles podem realizar. Ele serve como uma representação visual dos requisitos funcionais do sistema.

## 2. Atores

Os atores representam os papéis desempenhados pelos usuários que interagem com o sistema.

### 2.1. Administrador (Ator Primário)
O **Administrador** é o usuário responsável pelas funções de gestão e *back-office* do sistema. Seu foco está na organização dos eventos e na manutenção da base de dados. Este ator possui privilégios para criar e estruturar os eventos que serão disponibilizados aos ciclistas.

### 2.2. Ciclista (Ator Primário)
O **Ciclista** é o usuário final da aplicação. Seu foco está na gestão de suas próprias informações pessoais e de segurança, bem como na busca e inscrição em eventos de pedal. É o principal beneficiário das funcionalidades de segurança do sistema.

## 3. Casos de Uso

Os casos de uso descrevem as funcionalidades específicas disponíveis para cada ator dentro do sistema.

### 3.1. Funcionalidades do Administrador

| Caso de Uso | Descrição |
| :--- | :--- |
| **Cadastrar Biker** | Permite ao administrador realizar o registro inicial de novos ciclistas no sistema, garantindo que os dados básicos sejam inseridos corretamente. |
| **Criar Pedal** | Funcionalidade que permite ao administrador abrir novos eventos de pedal no sistema, definindo informações básicas como nome do evento, data de realização e local de encontro. |
| **Adicionar Trilha a Pedal** | Permite ao administrador detalhar tecnicamente um evento de pedal já criado. Através desta funcionalidade, é possível adicionar um ou mais percursos (trilhas) a um evento, especificando características como quilometragem e nível de dificuldade técnica/física para cada trilha. |

### 3.2. Funcionalidades do Ciclista

| Caso de Uso | Descrição |
| :--- | :--- |
| **Manter Perfil Pessoal** | Permite ao ciclista visualizar e atualizar seus próprios dados cadastrais, como informações de contato, tipo de bicicleta e condições de saúde relevantes. |
| **Gerenciar Contatos de Emergência** | Funcionalidade crítica para a segurança, que permite ao ciclista adicionar, editar ou remover contatos que devem ser acionados em situações de urgência durante um evento. |
| **Listar Pedais Disponíveis** | Apresenta ao ciclista uma visão geral dos próximos eventos de pedal que estão com inscrições abertas no sistema. |
| **Visualizar Detalhes e Trilhas do Pedal** | Permite ao ciclista acessar as informações completas de um evento específico. Isso inclui não apenas os dados básicos (data, local), mas também o detalhamento técnico de todas as trilhas que compõem aquele pedal, auxiliando na tomada de decisão sobre a participação. |
| **Confirmar Participação no Evento** | Ação final que permite ao ciclista realizar sua inscrição no pedal desejado, vinculando seu perfil à lista de participantes do evento. |

## 4. Relacionamentos Avançados (Regras de Negócio)

O diagrama utiliza relacionamentos de inclusão (`<<include>>`) e extensão (`<<extend>>`) para modelar regras de negócio importantes e fluxos de navegação do sistema.

### 4.1. Inclusão (`<<include>>`)

Este relacionamento indica que um caso de uso base incorpora obrigatoriamente o comportamento de outro caso de uso.

1.  **Manter Perfil Pessoal `<<include>>` Gerenciar Contatos de Emergência:**
    * **Regra de Negócio:** Esta relação define que a gestão de contatos de emergência é uma parte **essencial e obrigatória** da manutenção do perfil do ciclista. O sistema força o usuário a revisar ou manter seus contatos de emergência sempre que ele for editar seu perfil pessoal, garantindo que essa informação vital de segurança esteja sempre atualizada.

2.  **Listar Pedais Disponíveis `<<include>>` Visualizar Detalhes e Trilhas do Pedal:**
    * **Fluxo de Navegação:** Indica um fluxo natural onde a funcionalidade de listar os pedais já engloba, como parte de seu comportamento, a capacidade de acessar os detalhes de cada pedal listado. Não faz sentido listar os pedais sem oferecer a possibilidade de ver seus detalhes.

### 4.2. Extensão (`<<extend>>`)

Este relacionamento indica que um caso de uso pode estender o comportamento de outro sob certas condições. O caso de uso extensor é opcional.

1.  **Confirmar Participação no Evento `<<extend>>` Visualizar Detalhes e Trilhas do Pedal:**
    * **Comportamento Opcional:** A seta aponta do caso de uso extensor para o caso de uso base. Isso significa que a ação base é "Visualizar Detalhes e Trilhas do Pedal". A partir dessa visualização, o ciclista **pode ou não** decidir estender esse fluxo confirmando sua participação. A confirmação é uma ação opcional que ocorre no contexto da visualização dos detalhes.
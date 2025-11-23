# 1. Modelagem do Sistema

## 1.1. Diagrama de Classes

O Diagrama de Classes apresenta a estrutura estática do sistema, detalhando as entidades de domínio que serão persistidas no banco de dados, bem como os modelos de objeto utilizados para a transferência de dados nas interfaces da API (Data Transfer Objects - DTOs).

O modelo foi concebido para centralizar a gestão de ciclistas, garantindo o registro de informações vitais de segurança, e estruturar complexos eventos de pedal, permitindo a associação de múltiplos participantes e o detalhamento técnico dos percursos.

![Diagrama de Classes do Sistema de Ciclistas](CAMINHO/PARA/SUA/IMAGEM_DO_DIAGRAMA.png)
*Figura 1.1: Diagrama de Classes do Sistema*

---

## 1.2. Dicionário de Classes e Entidades

Esta seção detalha os componentes representados no diagrama, divididos entre a camada de persistência (Tabelas) e a camada de interface (Modelos de API).

### 1.2.1. Entidades de Domínio (Camada de Persistência)

As classes estereotipadas como `<<Table>>` representam o modelo relacional do banco de dados.

| Classe | Descrição e Responsabilidade |
| :--- | :--- |
| **Biker** | **Entidade Central.** Representa o usuário ciclista no sistema. Além dos dados cadastrais básicos (`nome`, `tipo_bike`), armazena informações críticas para a prática esportiva, como indicador de participação em trilhas técnicas (`participa_trilha`) e descrições de problemas de saúde (`problema_saude`). Atua como o ponto focal dos relacionamentos principais. |
| **EmergencyContact** | Representa os contatos de segurança de um ciclista. Armazena o `nome`, `telefone` e o `grau_parentesco`. Esta entidade existe exclusivamente em função de um `Biker`, sendo fundamental para o requisito não funcional de segurança do usuário. |
| **Pedal** | Representa um evento de ciclismo organizado. Contém os metadados do evento, como `nome`, `data`, e o ponto de encontro (`local`). Serve como agregador, conectando os ciclistas participantes às trilhas que serão percorridas no dia. |
| **Trilha** | Representa um percurso ou segmento técnico específico dentro de um evento de Pedal. Detalha a `distância` e o nível de `dificuldade`, permitindo que um único evento seja composto por diferentes desafios técnicos. |

### 1.2.2. Modelos de Interface (Camada de API)

As classes estereotipadas como `<<API Model>>` funcionam como DTOs (*Data Transfer Objects*), desacoplando a camada de banco de dados da camada de apresentação da API.

| Classe | Descrição e Estratégia |
| :--- | :--- |
| **BikerCreate** | **Modelo de Entrada.** Define a estrutura de dados esperada para a criação de um novo ciclista via API (método POST). Abstrai campos gerados pelo sistema (como ID) e permite a criação aninhada de contatos de emergência em uma única requisição. |
| **BikerRead** | **Modelo de Saída Base.** Define a visualização padrão e resumida de um ciclista. Utilizado em listagens gerais onde o desempenho é prioridade, retornando apenas os dados essenciais do usuário. |
| **BikerReadWithContacts** | **Modelo de Saída Estendido.** Herda de `BikerRead`. Implementa uma estratégia de *"Eager Loading"* (carregamento antecipado) para a API, sendo utilizado quando é necessário exibir os detalhes completos de um ciclista, incluindo sua lista de contatos de emergência. |

---

## 1.3. Relacionamentos e Cardinalidades

As associações entre as classes definem as regras de negócio e a integridade dos dados do sistema.

### 1. Associação `Biker` - `EmergencyContact` (Um-para-Muitos)
* **Descrição:** Um ciclista (`Biker`) **possui** uma lista de contatos de emergência.
* **Cardinalidade (1 : 0..*):** Indica que um registro de `Biker` pode estar associado a zero ou múltiplos registros de `EmergencyContact`. Em contrapartida, cada `EmergencyContact` deve obrigatoriamente estar vinculado a um único `Biker` (representado pela chave estrangeira `biker_id`).
* **Justificativa:** Trata-se de um relacionamento de composição forte. Os contatos de emergência não têm sentido semântico no sistema sem o ciclista associado.

### 2. Associação `Biker` - `Pedal` (Muitos-para-Muitos)
* **Descrição:** Um ciclista **participa** de eventos, e eventos possuem participantes.
* **Cardinalidade (0..* : 0..*):** Indica que um `Biker` pode participar de zero ou vários eventos de `Pedal` ao longo do tempo. Simultaneamente, um evento de `Pedal` pode ter a inscrição de zero ou vários ciclistas.
* **Nota Técnica:** Embora o diagrama de classes represente este relacionamento de forma direta (conceitual), sua implementação física em banco de dados relacional exigirá uma tabela associativa intermediária (ex: `Biker_Pedal_Participation`) para resolver a cardinalidade N:N.

### 3. Associação `Pedal` - `Trilha` (Agregação/Composição)
* **Descrição:** Um evento de Pedal **contém** trilhas.
* **Cardinalidade (1 : 0..*):** Um evento de `Pedal` é composto por zero ou várias `Trilhas`. Cada `Trilha`, no entanto, pertence a apenas um evento de `Pedal` específico.
* **Justificativa:** Permite a flexibilidade de cadastrar um evento ainda sem rotas definidas (zero trilhas) ou um evento complexo composto por múltiplos segmentos com dificuldades variadas (várias trilhas).

---

## 1.4. Estratégia de Herança e Realização nos Modelos de API

O diagrama utiliza dois conceitos importantes de Orientação a Objetos para a definição dos contratos de API:

1.  **Herança (`BikerRead <|-- BikerReadWithContacts`):** O sistema aplica o princípio da especialização. O modelo `BikerReadWithContacts` herda todos os atributos de `BikerRead` e adiciona a lista de contatos. Isso evita duplicação de código e padroniza os atributos base de leitura do ciclista.
2.  **Realização/Dependência (Setas tracejadas):** Indicam que a entidade de persistência `Biker` é a fonte da verdade. Ela "realiza" o contrato de leitura (`BikerRead`) ao fornecer dados para a API, e é construída a partir do contrato de entrada (`BikerCreate`) quando dados chegam da API.
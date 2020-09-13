//// { order: 2, compiler: { jsx: 2, esModuleInterop: true } }

//React é uma biblioteca muito popular para criar interfaces de usuário.
//Ela providencia uma abstração do Javascript ao criar visualização de componentes
//utilizando uma extensão da linguagem, chamada JSX.

//TypeScript suporta JSX, e providencia um amplo conjunto de ferramentas de 
//tipagem que modela ricamente como os componentes se conectam.

//Para entender como o TypeScript funciona com os componentes do React
//podemos começar com exemplos genéricos:
//

// - example:generic-functions
// - example:generic-classes

//Primeiro veremos como interfaces genéricas podem ser usadas para
//mapear componentes do React. Este é um exemplo de componente funcional React:

type FauxactFunctionComponent<Props extends {}> =
  (props: Props, context?: any) => FauxactFunctionComponent<any> | null | JSX.Element

//Basicamente:
//
//FauxactFunctionComponent é uma função genérica que depende de outra
//tipagem, Props. Props necessita ser um Objeto (para garantir que não 
//seja passado um valor primitivo) e a tipagem de Props será reutilizada
//como o primeiro argumento na função.

//Para usá-la, é preciso a tipagem das props:

interface DateProps { iso8601Date: string, message: string }

//Podemos portanto criar um DateComponent que utiliza uma interface
//DateProps, e renderiza a data.


const DateComponent: FauxactFunctionComponent<DateProps> =
  (props) => <time dateTime={props.iso8601Date}>{props.message}</time>

//Isto cria uma função que é genérica com uma variável Props que
//necessita ser um Objeto. A função componente retorna uma outra função
//componente ou um valor nulo.

//O outro componente API é um baseado em Classe. Aqui está
//uma versão simplificada desta API:

interface FauxactClassComponent<Props extends {}, State = {}> {
  props: Props
  state: State

  setState: (prevState: State, props: Props) => Props
  callback?: () => void
  render(): FauxactClassComponent<any> | null
}

//Como esta classe pode conter tanto Props como State - ela possui
//dois argumentos genéricos que são utilizados por toda a classe.

//A biblioteca React contém suas próprias definições de tipagem
//como estas, porém muito mais abrangentes. Vamos trazê-las para o
//playground e explorar alguns componentes.

import * as React from 'react';

//Suas props são sua API pública, portanto vale a pena tomar tempo
//utilizando JSDoc para explicar como funciona:

export interface Props {
  /** O nome do usuário */
  name: string;
  /** Renderiza o nome em negrito */
  priority?: boolean
}

const PrintName: React.FC<Props> = (props) => {
  return (
    <div>
      <p style={{ fontWeight: props.priority ? "bold" : "normal" }}>{props.name}</p>
    </div>
  )
}

//Você pode brincar com o uso do novo componente abaixo:

const ShowUser: React.FC<Props> = (props) => {
  return <PrintName name="Ned" />
}

//TypeScript suporta o fornecimento de intellisense dentro do
//{} em um atributo

let username = "Cersei"
const ShowStoredUser: React.FC<Props> = (props) => {
  return <PrintName name={username} priority />
}

//TypeScript também funciona com código React moderno. Aqui você
//pode ver que count e setCount foram induzidos corretamente a usar números
//com base no valor inicial passado para o useState.

import { useState, useEffect } from 'react';

const CounterExample = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
//React e TypeScript é um tópico gigantesco, mas os fundamentos são
//bem simples: TypeScript suporta JSX, e o restante é manipulado
//pelas tipagens do React no Definitely Typed.

//Você pode aprender mais sobre o uso de React e TypeScript nos sites abaixo:
//
// https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
// https://egghead.io/courses/use-typescript-to-develop-react-applications
// https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935

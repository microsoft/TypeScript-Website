type Getters<T> = {
  [K in keyof T as `get${capitalize K}`]: () => T[K]
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;

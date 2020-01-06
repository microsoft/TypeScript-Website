// Mapped types are a way to create new types based
// on another type. Effectively a transformational type.

// Common cases for using a mapped type is dealing with
// partial subsets of an existing type. For example
// an API may return an Artist:

interface Artist {
  id: number;
  name: string;
  bio: string;
}

// However, if you were to send an update to the API which
// only changes a subset of the Artist then you would
// typically have to create an additional type:

interface ArtistForEdit {
  id: number;
  name?: string;
  bio?: string;
}

// It's very likely that this would get out of sync with
// the Artist above. Mapped types let you create a change
// in an existing type.

type MyPartialType<Type> = {
  // For every existing property inside the type of Type
  // convert it to be a ?: version
  [Property in keyof Type]?: Type[Property];
};

// Now we can use the mapped type instead to create
// our edit interface:
type MappedArtistForEdit = MyPartialType<Artist>;

// This is close to perfect, but it does allow id to be null
// which should never happen. So, let's make one quick
// improvement by using an intersection type (see:
// example:union-and-intersection-types )

type MyPartialTypeForEdit<Type> = {
  [Property in keyof Type]?: Type[Property];
} & { id: number };

// This takes the partial result of the mapped type, and
// merges it with an object which has id: number set.
// Effectively forcing id to be in the type.

type CorrectMappedArtistForEdit = MyPartialTypeForEdit<Artist>;

// This is a pretty simple example of how mapped types
// work, but covers most of the basics. If you'd like to
// dive in with more depth, check out the handbook:
//
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types

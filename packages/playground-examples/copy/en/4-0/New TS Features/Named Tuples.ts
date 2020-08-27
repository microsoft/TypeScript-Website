//// { compiler: { ts: "4.0.2" } }
// Tuples are arrays where the order is important to the type system,
// you can learn more about them in example:tuples

// In TypeScript 3.9, the type of a Tuple's gained the ability to give
// a name to the different parts of the array.

// For example, you used to write a Lat Long location via a tuple:

type OldLocation = [number, number]

const locations: OldLocation[] = [
    [40.7144, -74.006],
    [53.6458, -1.785]
]

// Knowing which is Latitude and Longitude is ambiguous, and so you
// would more likely have called it a LatLong tuple.

// With 4.0, you can write:

type NewLocation = [lat: number, long: number]

const newLocations: NewLocation[] = [
    [52.3702, 4.8952],
    [53.3498, -6.2603]
]

// The names now show up in the editor when you hover over
// the 0 and 1 at the end of the next line
const firstLat = newLocations[0][0]
const firstLong = newLocations[0][1]

// While that might seem a tad underwhelming, the main goal 
// is to ensure that information isn't lost when working
// with the type system. For example, when extracting
// parameters from a function using the Parameter 
// utility type:

function centerMap(lng: number, lat: number) {}

// In 4.0, this keeps lng and lat
type CenterMapParams = Parameters<typeof centerMap>

// In 3.9, this would look like
type OldCenterMapParams = [number, number]

// Making some of the more complex type manipulation lossy
// for the parameter information.

//// { compiler: { ts: "4.0.0-beta" } }
// Tuplas são vetores que sua ordem é importante para a tipagem,
// você pode aprender mais sobre eles no exemplo:tuplas

// No TypeScript 3.9, o tipo das uma tupla ganha a abilidade de dar
// nome para diferentes partes do array.


// Por Exemplo, você usou para escreve uma localização de Latitude, Longintude via tupla:

type antigaLocalizacao = [number, number]

const locations: antigaLocalizacao[] = [
    [40.7144, -74.006],
    [53.6458, -1.785]
]

// With 4.0, you can write:

// Sabendo qual a Latitude e Longitude são ambiguas, então você
// saberá mais como terão que ser chamadas as tuplas LatLong.

// Com o 4.0 você pode escrever:

type NovaLocalizacao = [latitude: number, longitude: number]

const novasLocalizacoes: NovaLocalizacao[] = [
    [52.3702, 4.8952],
    [53.3498, -6.2603]
]

// Os nomes agora mostram ao editor quando você passar o mouse
// por cima, o 0 e 1 no fim da próxima linha:
const primeiraLatitude = novasLocalizacoes[0][0]
const primeiraLogintude = novasLocalizacoes[0][1]

// Isso poder parecer um pouco decepcionante, o objetivo
// principal é garantir que a informação não será perdida durante
// o trabalho com os sistemas de tipos. Por exemplo, quando extraido
// os parametros de uma função usando o Parâmetro tipo:

function centroDoMapa(lng: number, lat: number) {}

// No 4.0, são mantidos os lng e lat
type ParametrosDoCentroDoMapa = Parameters<typeof centroDoMapa>

// Na versão 3.9, isso teria que ser feito assim
type AntigosParametrosDoCentroDoMapa = [number, number]

// Fazendo com que uma manipulação de tipos mais complexa
// leve a perdas de informação

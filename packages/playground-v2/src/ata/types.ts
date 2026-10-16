export type SourceFile = {
  path: string
  text: string
}

export type Dependency = {
  specifier: string
  kind: "import" | "types"
  version?: string
}

export type DiscoverDependencies = (file: SourceFile) => readonly Dependency[] | Promise<readonly Dependency[]>

export type AcquisitionOptions = {
  enable?: boolean
  include?: readonly string[]
  exclude?: readonly string[]
}

export type AcquiredPackage = {
  name: string
  version: string
  requestedBy: string
}

export type AcquisitionError = {
  packageName: string
  requestedBy: string
  message: string
}

export type AcquisitionResult = {
  files: ReadonlyMap<string, string>
  ambientTypes: readonly string[]
  packages: readonly AcquiredPackage[]
  errors: readonly AcquisitionError[]
}

export type AcquisitionProgress = {
  downloaded: number
  total: number
  completedPackages: number
  totalPackages: number
  pendingPackages: readonly string[]
}

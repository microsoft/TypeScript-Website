export enum PackageSource {
    Npm = "npm",
    Pnpm = "pnpm",
    Yarn = "yarn"
}

export type Installer = [string, string]

export const Installers: Record<PackageSource, Installer> = {
    [PackageSource.Npm]: ["npm i", "--save-dev"],
    [PackageSource.Pnpm]: ["pnpm add", "--dev"],
    [PackageSource.Yarn]: ["yarn add", "--save-dev"]
}

export const installerOptions = [
    PackageSource.Npm,
    PackageSource.Pnpm,
    PackageSource.Yarn,
] as const

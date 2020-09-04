export enum PackageSource {
    Npm,
    Pnpm,
    Yarn
}

export type Installer = [string, string]

export const Installers: Record<PackageSource, Installer> = {
    [PackageSource.Npm]: ["npm i", "--save-dev"],
    [PackageSource.Pnpm]: ["pnpm add", "--dev"],
    [PackageSource.Yarn]: ["yarn add", "--save-dev"]
}

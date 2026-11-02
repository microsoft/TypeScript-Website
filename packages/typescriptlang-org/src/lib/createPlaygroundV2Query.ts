import type { Sandbox } from "@typescript/sandbox"
import { isNativeCompilerVersion } from "../../../playground-v2/src/compiler-versions"

type HandoffSandbox = Pick<
  Sandbox,
  "ts" | "getCompilerOptions" | "createURLQueryWithCompilerOptions"
>

type ConfigSerializer = {
  convertToTSConfig(
    config: {
      options: ReturnType<Sandbox["getCompilerOptions"]>
      fileNames: string[]
      errors: unknown[]
    },
    fileName: string,
    host: { useCaseSensitiveFileNames: boolean; getCurrentDirectory(): string }
  ): { compilerOptions: Record<string, unknown> }
}

function hasConfigSerializer(
  compiler: Sandbox["ts"]
): compiler is Sandbox["ts"] & ConfigSerializer {
  return (
    "convertToTSConfig" in compiler &&
    typeof compiler.convertToTSConfig === "function"
  )
}

export function createPlaygroundV2Query(
  sandbox: HandoffSandbox,
  search: string
) {
  const requested = new URLSearchParams(search).get("ts")
  if (isNativeCompilerVersion(requested)) {
    return sandbox.createURLQueryWithCompilerOptions(sandbox, { ts: requested })
  }
  const compiler = sandbox.ts
  if (!hasConfigSerializer(compiler))
    throw new Error(
      "The selected compiler cannot serialize its Playground settings"
    )
  const config = compiler.convertToTSConfig(
    { options: sandbox.getCompilerOptions(), fileNames: [], errors: [] },
    "/workspace/tsconfig.json",
    { useCaseSensitiveFileNames: true, getCurrentDirectory: () => "/workspace" }
  )
  return sandbox.createURLQueryWithCompilerOptions(sandbox, {
    ts: requested,
    tsconfig: JSON.stringify({ compilerOptions: config.compilerOptions }),
  })
}

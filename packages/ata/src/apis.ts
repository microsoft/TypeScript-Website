import { ATABootstrapConfig } from "."

export const getNPMVersionsForModule = (config: ATABootstrapConfig, moduleName: string) => {
  const url = `https://data.jsdelivr.com/v1/package/npm/${moduleName}`
  return api<{ tags: Record<string, string>; versions: string[] }>(config, url)
}

export type NPMTreeMeta = { default: string; files: Array<{ name: string }> }

export const getFiletreeForModuleWithVersion = (config: ATABootstrapConfig, moduleName: string, version: string) => {
  const url = `https://data.jsdelivr.com/v1/package/npm/${moduleName}@${version}/flat`
  return api<NPMTreeMeta>(config, url)
}

function api<T>(config: ATABootstrapConfig, url: string): Promise<T | Error> {
  const f = config.fetcher || fetch
  return f(url, { headers: { "User-Agent": `Type Acquisition ${config.projectName}` } }).then(res => {
    if (res.ok) {
      return res.json().then(f => f as T)
    } else {
      return new Error("OK")
    }
  })
}

function createDTSQueue(maxNumOfWorkers = 4) {
  var numOfWorkers = 0
  var taskIndex = 0

  return new Promise(done => {
    const handleResult = index => result => {
      tasks[index] = result
      numOfWorkers--
      getNextTask()
    }
    const getNextTask = () => {
      console.log("getNextTask numOfWorkers=" + numOfWorkers)
      if (numOfWorkers < maxNumOfWorkers && taskIndex < tasks.length) {
        tasks[taskIndex]().then(handleResult(taskIndex)).catch(handleResult(taskIndex))
        taskIndex++
        numOfWorkers++
        getNextTask()
      } else if (numOfWorkers === 0 && taskIndex === tasks.length) {
        done(tasks)
      }
    }
    getNextTask()
  })
}

const createTask = value => () => {
  if (value === 6) return Promise.reject(new Error("sorry"))
  return new Promise(resolve => setTimeout(() => resolve(value), value))
}

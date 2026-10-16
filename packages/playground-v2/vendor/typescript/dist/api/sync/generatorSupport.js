export function cacheGeneratorMethod(owner, name, sync, gen) {
    const method = Object.assign(sync, { gen });
    Object.defineProperty(owner, name, { configurable: true, value: method });
    return method;
}
export function* apiRequest(method, params) {
    return yield { method, params };
}
const deferredGeneratorMarker = Symbol();
const allGeneratorMarker = Symbol();
export function all(...requestGenerators) {
    return new AllRequestGenerator(requestGenerators);
}
/**
 * This single-message iterator avoids native generator setup/resumption overhead.
 * Keeping pending children on the instance also lets the executor collapse nested
 * all helpers without allocating a scheduler group for each wrapper.
 */
class AllRequestGenerator {
    [allGeneratorMarker] = true;
    generators;
    done = false;
    constructor(generators) {
        this.generators = generators;
    }
    next(value) {
        if (this.generators) {
            const generators = this.generators;
            this.generators = undefined;
            return { done: false, value: { method: "__all", generators } };
        }
        if (this.done)
            return { done: true, value: undefined };
        this.done = true;
        return { done: true, value: value };
    }
    return(value) {
        this.generators = undefined;
        this.done = true;
        return { done: true, value };
    }
    throw(error) {
        this.generators = undefined;
        this.done = true;
        throw error;
    }
    [Symbol.iterator]() {
        return this;
    }
    [Symbol.dispose]() {
        this.return(undefined);
    }
}
export function executeRequestGenerators(requestGenerators, executeRequests) {
    const registeredGenerators = new WeakSet();
    let firstGenerator;
    let lastGenerator;
    const root = startGroup(requestGenerators);
    if (root.failed)
        throw root.error;
    while (firstGenerator) {
        const requests = [];
        const responseIndexByDeduplicationKey = new Map();
        const addRequest = (request) => {
            const deduplicationKey = getRequestDeduplicationKey(request);
            let responseIndex = deduplicationKey === undefined ? undefined : responseIndexByDeduplicationKey.get(deduplicationKey);
            if (responseIndex === undefined) {
                responseIndex = requests.length;
                requests.push(request);
                if (deduplicationKey !== undefined)
                    responseIndexByDeduplicationKey.set(deduplicationKey, responseIndex);
            }
            return responseIndex;
        };
        const roundGenerators = [];
        const responseIndices = [];
        for (let state = firstGenerator; state; state = state.next) {
            if (state.request === undefined)
                continue;
            roundGenerators.push(state);
            responseIndices.push(isRequestGroup(state.request) ? state.request.map(addRequest) : addRequest(state.request));
        }
        const responses = requests.length ? executeRequests(requests) : [];
        for (let index = 0; index < roundGenerators.length; index++) {
            const state = roundGenerators[index];
            if (!state.active)
                continue;
            const responseIndex = responseIndices[index];
            if (typeof responseIndex === "number") {
                const response = responses[responseIndex];
                advanceGenerator(state, response.result, response.error ? { error: new Error(response.error) } : undefined);
            }
            else {
                advanceGenerator(state, responseIndex.map(index => responses[index]));
            }
        }
    }
    return getGroupResults(root);
    function advanceGenerator(state, value, failure) {
        state.request = undefined;
        state.group = undefined;
        while (true) {
            let next;
            try {
                next = failure ? state.generator.throw(failure.error) : state.generator.next(value);
            }
            catch (error) {
                removeGenerator(state);
                if (!state.parent)
                    throw error;
                failGroup(state.parent, error);
                return;
            }
            value = undefined;
            failure = undefined;
            if (next.done) {
                removeGenerator(state);
                const parent = state.parent;
                if (parent) {
                    if (state.resultIndex !== -1)
                        parent.results[state.resultIndex] = next.value;
                    if (--parent.remaining === 0 && !parent.initializing) {
                        const results = getGroupResults(parent);
                        if (parent.parent)
                            advanceGenerator(parent.parent, results);
                    }
                }
                return;
            }
            const request = next.value;
            if (isRequestGroup(request)) {
                state.request = request;
                return;
            }
            switch (request.method) {
                case "__defer":
                    addGenerator(request.deferred);
                    break;
                case "__all": {
                    const group = startGroup(request.generators, state);
                    if (!group.failed && group.remaining)
                        return;
                    state.group = undefined;
                    value = group.failed ? undefined : getGroupResults(group);
                    failure = group.failed ? { error: group.error } : undefined;
                    break;
                }
                default:
                    state.request = request;
                    return;
            }
        }
    }
    function addGenerator(generator, parent) {
        if (registeredGenerators.has(generator)) {
            const error = new Error("Cannot execute the same generator instance more than once");
            if (!parent)
                throw error;
            failGroup(parent, error);
            return;
        }
        registeredGenerators.add(generator);
        const next = parent?.parent;
        const previous = next ? next.previous : lastGenerator;
        const state = {
            generator,
            parent,
            resultIndex: parent && !isDeferredGenerator(generator) ? parent.results.push(undefined) - 1 : -1,
            previous,
            next,
            active: true,
        };
        if (previous)
            previous.next = state;
        else
            firstGenerator = state;
        if (next)
            next.previous = state;
        else
            lastGenerator = state;
        parent?.children.push(state);
        advanceGenerator(state);
    }
    function removeGenerator(state) {
        if (!state.active)
            return;
        if (state.previous)
            state.previous.next = state.next;
        else
            firstGenerator = state.next;
        if (state.next)
            state.next.previous = state.previous;
        else
            lastGenerator = state.previous;
        state.previous = undefined;
        state.next = undefined;
        state.active = false;
    }
    function startGroup(generators, parent) {
        const group = { parent, children: [], results: [], remaining: generators.length, initializing: true, failed: false };
        if (parent)
            parent.group = group;
        while (parent && generators.length === 1) {
            const generator = generators[0];
            if (!(allGeneratorMarker in generator))
                break;
            const wrapper = generator;
            const pending = wrapper.generators;
            if (!pending)
                break;
            if (registeredGenerators.has(wrapper)) {
                failGroup(group, new Error("Cannot execute the same generator instance more than once"));
                group.initializing = false;
                return group;
            }
            registeredGenerators.add(wrapper);
            wrapper.next();
            (group.wrappers ??= []).push(wrapper);
            generators = pending;
        }
        group.remaining = generators.length;
        for (const generator of generators) {
            addGenerator(generator, group);
            if (group.failed)
                break;
        }
        group.initializing = false;
        if (!group.failed && !group.remaining)
            getGroupResults(group);
        return group;
    }
    function getGroupResults(group) {
        let results = group.results;
        if (group.wrappers) {
            for (let index = group.wrappers.length - 1; index >= 0; index--) {
                results = [group.wrappers[index].next(results).value];
            }
            group.results = results;
            group.wrappers = undefined;
        }
        return results;
    }
    function failGroup(group, error) {
        group.failed = true;
        group.error = error;
        cancelGroup(group);
        if (group.wrappers) {
            for (let index = group.wrappers.length - 1; index >= 0; index--) {
                try {
                    group.wrappers[index].throw(error);
                }
                catch (failure) {
                    error = failure;
                }
            }
            group.error = error;
        }
        if (!group.initializing) {
            if (!group.parent)
                throw error;
            advanceGenerator(group.parent, undefined, { error });
        }
    }
    function cancelGroup(group) {
        for (const child of group.children) {
            removeGenerator(child);
            if (child.group)
                cancelGroup(child.group);
        }
    }
}
function isDeferredGenerator(generator) {
    return deferredGeneratorMarker in generator;
}
function isRequestGroup(request) {
    return Array.isArray(request);
}
function getRequestDeduplicationKey(request) {
    switch (request.method) {
        case "initialize":
            return request.method;
        default:
            return undefined;
    }
}
export function defer(gen) {
    return new DeferredRequestGenerator(gen);
}
/**
 * The API comparison benchmarks show this single-message iterator is cheaper than
 * wrapping and branding a native generator, even with a shared generator factory.
 * Shared prototype methods also avoid creating a generator function per defer call.
 */
class DeferredRequestGenerator {
    [deferredGeneratorMarker] = true;
    generator;
    constructor(generator) {
        this.generator = generator;
    }
    next() {
        if (this.generator) {
            const generator = this.generator;
            this.generator = undefined;
            return { done: false, value: { method: "__defer", deferred: generator } };
        }
        return { done: true, value: undefined };
    }
    return(value) {
        this.generator = undefined;
        return { done: true, value };
    }
    throw(error) {
        this.generator = undefined;
        throw error;
    }
    [Symbol.iterator]() {
        return this;
    }
    [Symbol.dispose]() {
        this.return(undefined);
    }
}
//# sourceMappingURL=generatorSupport.js.map
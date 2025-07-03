//import { URL, URLSearchParams} from "whatwg-url/index";
//import { AbortSignal, AbortController } from '@supabase/abortcontroller-polyfill/abortcontroller'
//
class MemoryStorage {
    private store = new Map<string, string>();
    
    public getItem(key: string): string | null {
        const value = this.store.get(key);
        return value === undefined ? null : value;
    }
    
    public setItem(key: string, value: string): void {
        // The Web Storage API stores everything as strings.
        this.store.set(key, String(value));
    }
    
    public removeItem(key: string): void {
        this.store.delete(key);
    }
};

export const console = {
    log: (...args: any[]): void => {
        print("[LOG] " + args.map(arg => String(arg)).join(" "));
    },
    warn: (...args: any[]): void => {
        print("[WARN] " + args.map(arg => String(arg)).join(" "));
    },
    error: (...args: any[]): void => {
        print("[ERROR] " + args.map(arg => String(arg)).join(" "));
    },
};

class HashedAlgorithmIdentifierPolyfill {
    public name: string;
};

class RsaHashedImportParamsPolyfill {
    public name: string;
    public hash: HashedAlgorithmIdentifierPolyfill;
};

class EcKeyImportParamsPolyfill {
    public name: string;
    public namedCurve: string;
    public hash: HashedAlgorithmIdentifierPolyfill;
};

export function setTimeoutPolyFill(callback, timeMs)  {
    const timerManager = getTimerSceneManager();
    
    const cancelToken = { cancelled: false };
    const delayedEvent = timerManager.createEvent(
        "SceneEvent.DelayedCallbackEvent"
    );
    delayedEvent.reset(timeMs / 1000);
    delayedEvent.bind(() => {
        if (!cancelToken.cancelled) {
        callback();
        }
    });
  return cancelToken;
}

export function clearTimeoutPolyFill(timerId) : void {
    if (timerId !== undefined && timerId.cancelled !== undefined) {
        timerId.cancelled = true;
    }
}

export function setIntervalPolyFill(callback, timeMs)  {
    return setTimeoutPolyFill(callback, timeMs);
}

export function clearIntervalPolyFill(timerId) : void {
    clearTimeoutPolyFill(timerId);
}

let internetModule: any = null;
function getInternetModule() {
  if (!internetModule) {
    try {
      internetModule = require("LensStudio:InternetModule");
    } catch (e) {
      print("Failed to load LensStudio:InternetModule. Ensure it is available in this context.");
      // Return a dummy object to prevent further crashes
      return { request: () => { print("InternetModule not available."); } };
    }
  }
  return internetModule;
}

let timerSceneManager: any = null;
function getTimerSceneManager() {
  if (!timerSceneManager) {
    const sceneObject = global.scene.createSceneObject("TimerSceneManager");
    timerSceneManager = sceneObject.createComponent("ScriptComponent");
  }
  return timerSceneManager;
}

export function fetchPolyFill(url, args) : Promise<Response> {
    print("custom fetch");
    print(url)
    const internetModule = getInternetModule();
    if(!args.headers["Content-Type"])
        args.headers["Content-Type"] = 'application/json'
    let options = {
        headers: {
        "Content-Type": args.headers["Content-Type"],
        Authorization: args.headers["Authorization"],
        apikey: args.headers["apikey"],
        },
        method: args['method'],
    }
    if (args.body)
        options["body"] = args.body;
    let request = new Request(url, options);
    print(request)
    return internetModule.fetch(request);
}

const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function btoaPolyfill(input: string) : string {
    const str = String(input);
      let output = '';
      for (
        // initialize result and counters
        let block: number, charCode: number, idx = 0, map = chars;
        // get next character
        str.charAt(idx | 0) || (map = '=', idx % 1);
        // append relevant character from chars
        output += map.charAt(63 & (block >> (8 - (idx % 1) * 8)))
      ) {
        charCode = str.charCodeAt((idx += 3 / 4));
        if (charCode > 0xff) {
          throw new Error(
            "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
          );
        }
        block = (block << 8) | charCode;
      }
      return output;
};

// if (typeof console !== 'undefined') {
//   console.log("[INFO] Custom global polyfills loaded.");
// } else {
//   (globalThis as any).console = Console;
// }


declare global {
    const Storage : typeof MemoryStorage;
    type Storage = MemoryStorage;
    
    type BodyInit =
        | Blob
//        | URLSearchParams
        | ArrayBuffer
        | string;

    const HashedAlgorithmIdentifier : typeof HashedAlgorithmIdentifierPolyfill;
    type HashedAlgorithmIdentifier = HashedAlgorithmIdentifierPolyfill;
    const RsaHashedImportParams : typeof RsaHashedImportParamsPolyfill;
    type RsaHashedImportParams = RsaHashedImportParamsPolyfill;
    const EcKeyImportParams : typeof EcKeyImportParamsPolyfill;
    type EcKeyImportParams = EcKeyImportParamsPolyfill; 

    // const console : Console;
    
//    const setTimeout : typeof setTimeoutPolyFill;
//    
//    const clearTimeout : typeof clearTimeoutPolyFill;
//    
//    const setInterval : typeof setIntervalPolyFill;
//    
//    const clearInterval : typeof clearIntervalPolyFill;
//    
//    const fetch : typeof fetchPolyFill;
    
    const btoa : typeof btoaPolyfill;
    
};

export {
};


// React Native/Expo WebSocket implementation
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

export default class WebSocketPolyfill {
    private webSocket: WebSocket;
    public constructor(address: string) {
        const internetModule = getInternetModule();
        this.webSocket = internetModule.createWebSocket(address);
        print("WebSocket constructor called" + this.webSocket.readyState + this.webSocket.url);
    }
    
    set binaryType(value: string) {
        // Commenting this out because ArrayBuffer binary type is not supported in the original code
        // this.webSocket.binaryType = value;
    }

    get binaryType(): string {
        return this.webSocket.binaryType;
    }

    get readyState(): number {
        return this.webSocket.readyState;
    }

    get url(): string {
        return this.webSocket.url;
    }

    set onopen(callback) {
        this.webSocket.addEventListener("open", callback);
    }

    set onclose(callback) {
        this.webSocket.addEventListener("close", callback);
    }

    set onerror(callback) {
        this.webSocket.addEventListener("error", callback);
    }

    set onmessage(callback) {
        this.webSocket.addEventListener("message", callback);
    }

    addEventListener(eventType, callback): void {
        print("WebSocket addEventListener called");
        this.webSocket.addEventListener(eventType, callback);
    }

    send(data: any): void {
        this.webSocket.send(data);
        print("WebSocket send called");
    }

    close(code?: number, reason?: string): void {
        this.webSocket.close();
        print("WebSocket close called");
    }
};

//const WebSocketImpl = typeof WebSocketPolyfill;
//type WebSocketImpl = WebSocketPolyfill;
//
//export default WebSocketImpl

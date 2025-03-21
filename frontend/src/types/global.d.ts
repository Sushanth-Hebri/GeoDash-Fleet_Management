export {}; // Ensure this is a module

declare global {
  interface Window {
    pendo: {
      initialize: (config: {
        visitor: { id: string; email?: string; role?: string };
        account?: { id: string; name?: string };
      }) => void;
      identify: (visitorData: { id: string; email?: string }) => void;
      track: (eventName: string, eventData?: object) => void;
    };
  }
}

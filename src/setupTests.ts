import '@testing-library/jest-dom';

// Provide a real function for matchMedia and attach to both window and global
function createMatchMedia() {
  return (query: string) => {
    const mql = {
      matches: false,
      media: query,
      onchange: null as any,
      addListener: (cb: (e: MediaQueryListEvent) => void) => {},
      removeListener: (cb: (e: MediaQueryListEvent) => void) => {},
      addEventListener: (type: string, cb: EventListenerOrEventListenerObject) => {},
      removeEventListener: (type: string, cb: EventListenerOrEventListenerObject) => {},
      dispatchEvent: (event: Event) => false,
    };
    return mql;
  };
}

const matchMediaImpl = createMatchMedia();

// Ensure both window and global have the function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaImpl,
});

(global as any).matchMedia = matchMediaImpl;

// Mock for HTMLElement.prototype.scrollIntoView
HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

export interface Farm {
  id: number;
  name: string;
}

declare global {
  interface Window {
    api: {
      farms: {
        list: () => Promise<Farm[]>;
        getById: (id: number) => Promise<Farm>;
      };
    };
  }
}

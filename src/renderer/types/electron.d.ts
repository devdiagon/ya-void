export interface Farm {
  id: number;
  name: string;
}

declare global {
  interface Window {
    api: {
      getFarms: () => Promise<Farm[]>;
      createFarm: (name: string) => Promise<void>;
    };
  }
}

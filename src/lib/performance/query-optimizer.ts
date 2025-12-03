// Advanced Query Optimizer
export const queryOptimizer = {
  // Batch multiple queries
  batch: async <T>(queries: (() => Promise<T>)[]): Promise<T[]> => {
    return Promise.all(queries.map(q => q()));
  },

  // Parallel execution
  parallel: async <T>(queries: Record<string, () => Promise<T>>): Promise<Record<string, T>> => {
    const entries = Object.entries(queries);
    const results = await Promise.all(entries.map(([_, fn]) => fn()));
    return Object.fromEntries(entries.map(([key], i) => [key, results[i]]));
  },

  // Debounce queries
  debounce: <T>(fn: (...args: any[]) => Promise<T>, delay: number = 300) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]): Promise<T> => {
      return new Promise((resolve) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => resolve(fn(...args)), delay);
      });
    };
  }
};

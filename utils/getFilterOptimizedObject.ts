export const getFilterOptimizedObject = (filters: Record<string, any>) => {
  const optimizedFilter = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => {
      if (value === "" || value === undefined || value === null) return false;
      if (Array.isArray(value) || typeof value === "string")
        return value.length !== 0;
      return true;
    })
  );
  return optimizedFilter;
};

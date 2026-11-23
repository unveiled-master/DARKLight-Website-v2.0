type ModuleStyles = Record<string, string>;

const hashClass = (name: string) => {
  let hash = 2166136261;
  for (let index = 0; index < name.length; index += 1) {
    hash ^= name.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `u${(hash >>> 0).toString(36)}`;
};

const collect = (value: unknown, output: string[]) => {
  if (typeof value === 'string') {
    output.push(...value.split(/\s+/).filter(Boolean));
  } else if (Array.isArray(value)) {
    value.forEach((item) => collect(item, output));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, enabled]) => enabled && output.push(key));
  }
};

/** Resolves local CSS Module utility selectors while retaining conditional class composition. */
export const classNames = (styles: ModuleStyles, ...values: unknown[]) => {
  const names: string[] = [];
  values.forEach((value) => collect(value, names));
  return names.map((name) => styles[hashClass(name)] ?? styles[name] ?? name).join(' ');
};

type ExtractedAttributes = {
  [key: string]: string | object;
};

export function extractDataParams(elementId: string, names: string[]): ExtractedAttributes {
  /**
   * Extract parameters from data attributes
   *
   * @param elementId The id of the element
   * @param names The names of the attributes to extract and return (camelCase)
   */
  const el = document.getElementById(elementId);
  if (el) {
    const attributes = names.reduce<ExtractedAttributes>((acc, name) => {
      const hyphenatedName = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      const attrValue = el.getAttribute(`data-${hyphenatedName}`);

      if (attrValue) {
        try {
          const parsedValue = JSON.parse(attrValue);
          acc[name] = parsedValue;
        } catch (error) {
          acc[name] = attrValue;
        }
      }
      return acc;
    }, {});
    return attributes;
  } else {
    return {};
  }
}

export function extractIdFromPath(
  path: string,
  prefix: string,
  suffix: string = "edit"
): string | undefined {
  /**
   * Extract resource id from path
   *
   * @param path The path to extract the id (usually window.location.pathname)
   * @param prefix The prefix of the path (e.g. "codebases", "events")
   * @param suffix="edit" The suffix of the path (e.g. "edit")
   */
  const re = new RegExp(`/${prefix}/([0-9a-zA-Z-]+)/${suffix}/`);
  const match = path.match(re);
  return match ? match[1] : undefined;
}

export function parseDates(data: any, keys: string[]) {
  /**
   * Parse dates (with Date.parse) in data object
   * @param data The data object to parse
   * @param keys The keys of the data object to parse
   * @returns The data object with parsed dates
   */
  for (const key of keys) {
    const parsedDate = Date.parse(data[key]);
    if (!isNaN(parsedDate)) {
      data[key] = new Date(parsedDate);
    }
  }
}

export function isEmpty(object: any) {
  /**
   * Check if object is empty (or null/undefined)
   */
  if (!object) return true;
  return Object.keys(object).length === 0;
}
export interface ExtractedEvent<T> {
  eventId: number;
  jsonObject: T;
}

export function extractJsonAndEventId<T = unknown> (inputString: string): ExtractedEvent<T> | null {
  // Extract the integer at the front of the string
  const eventId = parseInt(inputString, 10);

  // Find the index of the first '{' and the last '}' to extract the JSON part
  const startIndex = inputString.indexOf('{');
  const endIndex = inputString.lastIndexOf('}');
  const jsonString = inputString.slice(startIndex, endIndex + 1);

  try {
    const jsonObject = JSON.parse(jsonString);

    return { eventId, jsonObject };
  } catch (error) {
    return null;
  }
}

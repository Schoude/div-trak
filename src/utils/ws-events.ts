export function extractJsonAndEventId<T = {eventId: number; jsonObject: unknown}> (inputString: string): T | null {
  // Extract the integer at the front of the string
  const eventId = parseInt(inputString, 10);

  // Find the index of the first '{' and the last '}' to extract the JSON part
  const startIndex = inputString.indexOf('{');
  const endIndex = inputString.lastIndexOf('}');
  const jsonString = inputString.slice(startIndex, endIndex + 1);

  try {
    const jsonObject = JSON.parse(jsonString);

    return { eventId, jsonObject } as T;
  } catch (error) {
    return null;
  }
}

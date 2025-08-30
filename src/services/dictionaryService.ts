import axios from 'axios';

interface DictionaryResponse {
  word: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
    }>;
  }>;
}

export const validateWord = async (word: string): Promise<{ isValid: boolean; definition?: string }> => {
  try {
    const response = await axios.get<DictionaryResponse[]>(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    );
    
    if (response.data && response.data.length > 0) {
      const firstMeaning = response.data[0];
      const definition = firstMeaning.meanings[0]?.definitions[0]?.definition || 'Valid English word';
      
      return {
        isValid: true,
        definition
      };
    }
    
    return { isValid: false };
  } catch (error) {
    console.error('Dictionary API error:', error);
    return { isValid: false };
  }
};
import { capitalize } from 'lodash';
import axios from 'axios';

const URL_WTF = 'https://yesno.wtf/api';
export const WTF = {
  wait: 'Thinking...',
  hint: 'Questions only... which usually contain a question mark. ;-)',
  error: 'Error! Could not reach the API ',
};

export async function callWtfApi(): Promise<string> {
  const response = await axios.get(URL_WTF);
  return capitalize(response.data.answer);
}

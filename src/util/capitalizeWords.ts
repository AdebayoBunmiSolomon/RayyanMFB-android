import capitalize from './capitalize';

function capitalizeWords(sentence: string): string {
  return sentence
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

export default capitalizeWords;

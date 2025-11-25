import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample data with correct English column names
const sampleData = [
  {
    'QuestionText': 'What is the capital city of France?',
    'OptionA': 'London',
    'OptionB': 'Berlin', 
    'OptionC': 'Paris',
    'OptionD': 'Madrid',
    'CorrectOption': 'C'
  },
  {
    'QuestionText': 'Which programming language is commonly used for web development?',
    'OptionA': 'Python',
    'OptionB': 'JavaScript',
    'OptionC': 'C++', 
    'OptionD': 'Java',
    'CorrectOption': 'B'
  },
  {
    'QuestionText': 'What does HTML stand for?',
    'OptionA': 'Hyperlink Text Markup Language',
    'OptionB': 'Home Tool Markup Language',
    'OptionC': 'HyperText Markup Language',
    'OptionD': 'Hyperlink and Text Markup Language',
    'CorrectOption': 'C'
  }
];

// Create workbook
const wb = XLSX.utils.book_new();

// Create worksheet from data
const ws = XLSX.utils.json_to_sheet(sampleData);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Quiz Questions');

// Save file
const outputPath = path.join(__dirname, '..', 'public', 'quiz-template.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('English Excel template created successfully at:', outputPath);
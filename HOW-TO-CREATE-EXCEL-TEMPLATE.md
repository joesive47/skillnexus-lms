# 📊 How to Create Excel Template

## Quick Method: Convert CSV to Excel

### Step 1: Use the CSV Template
1. Download: `/skills-assessment-template-new.csv`
2. Open with Excel
3. Save As → Excel Workbook (.xlsx)
4. Name it: `skills-assessment-template-new.xlsx`
5. Place in `/public/` folder

### Step 2: Format in Excel
1. **Bold the header row**
2. **Auto-fit columns** (double-click column borders)
3. **Add data validation** for correct_answer (1-4 only)
4. **Add example rows** (5 questions minimum)

## Excel Template Structure

### Headers (Row 1):
```
question_id | career_title | skill_name | question_text | option_1 | option_2 | option_3 | option_4 | correct_answer | score | difficulty_level
```

### Example Data (Rows 2-6):
```
Q001 | Full Stack Developer | JavaScript | What is a closure in JavaScript? | A function that has access to variables in its outer scope | A loop structure for iterating arrays | A data type for storing objects | An operator for comparing values | 1 | 5 | Intermediate

Q002 | Full Stack Developer | React | Which React Hook is used for side effects? | useState | useEffect | useContext | useReducer | 2 | 5 | Intermediate

Q003 | Full Stack Developer | Node.js | What is the correct way to handle errors in async/await? | Using .catch() method | Using try-catch block | Using callback functions | Using Promise.reject() | 2 | 5 | Advanced

Q004 | Full Stack Developer | Database Design | Which SQL JOIN returns all records from both tables? | INNER JOIN | LEFT JOIN | RIGHT JOIN | FULL OUTER JOIN | 4 | 5 | Intermediate

Q005 | Full Stack Developer | Git | What Git command is used to combine branches? | git combine | git merge | git join | git unite | 2 | 3 | Beginner
```

## Data Validation Rules

### For correct_answer column:
- **Type**: Whole number
- **Data**: between 1 and 4
- **Error message**: "Please enter a number between 1 and 4"

### For difficulty_level column:
- **Type**: List
- **Source**: Beginner,Intermediate,Advanced
- **Error message**: "Please select from the list"

### For score column:
- **Type**: Whole number
- **Data**: between 1 and 10
- **Error message**: "Please enter a score between 1 and 10"

## Formatting

### Colors:
- **Header row**: Blue background (#4472C4), White text, Bold
- **Correct answer column**: Light green background (#E2EFDA)
- **Example rows**: Alternating white and light gray (#F2F2F2)

### Column Widths:
- question_id: 10
- career_title: 20
- skill_name: 15
- question_text: 50
- option_1-4: 40 each
- correct_answer: 15
- score: 8
- difficulty_level: 15

## Protection (Optional)

1. **Protect headers**: Lock row 1
2. **Allow editing**: Rows 2 onwards
3. **Password**: (optional)

## Final Checklist

- [ ] Headers in English
- [ ] Example data (5 rows minimum)
- [ ] Data validation for correct_answer (1-4)
- [ ] Data validation for difficulty_level (list)
- [ ] Data validation for score (1-10)
- [ ] Formatted and colored
- [ ] Column widths adjusted
- [ ] Saved as .xlsx
- [ ] Placed in /public/ folder
- [ ] File name: skills-assessment-template-new.xlsx

## Alternative: Use Google Sheets

1. Create new Google Sheet
2. Add headers and data
3. Apply formatting
4. Download as Excel (.xlsx)
5. Place in /public/ folder

---

**Note**: The CSV template is already created and working. The Excel version is optional but provides better user experience with data validation and formatting.

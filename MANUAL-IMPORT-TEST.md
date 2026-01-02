# 🧪 Manual Import Testing Guide

## 🎯 Browser-Based Testing Steps

### Step 1: Start Development Server
```bash
npm run dev
```

### Step 2: Access Admin Dashboard
```
URL: http://localhost:3000/dashboard/admin/skills-assessment
Login: admin@skillnexus.com / Admin@123!
```

### Step 3: Test Import Functionality

#### 3.1 Create New Assessment
1. Click "สร้างการประเมินใหม่"
2. Fill basic info:
   - Title: "Test Import Assessment"
   - Description: "Testing import functionality"
   - Category: "programming"
   - Time: 30 minutes
   - Passing Score: 70%

#### 3.2 Download Template
1. In "เพิ่มคำถาม" section
2. Click "Excel Template" button
3. Verify file downloads: `Skills_Assessment_Template.xlsx`

#### 3.3 Test Import Process
1. Click "Import File" button
2. Select the downloaded template (or test file)
3. Verify validation messages appear
4. Check preview shows correctly
5. Click "เพิ่มคำถาม" to add imported questions

#### 3.4 Complete Assessment Creation
1. Verify questions appear in list
2. Click "สร้างการประเมิน"
3. Check success message
4. Verify assessment appears in main list

### Step 4: Test Public Access
```
URL: http://localhost:3000/skills-assessment
```
1. Verify new assessment appears
2. Click "เริ่มประเมิน"
3. Complete assessment
4. Check results page

## ✅ Expected Results

### Import Validation
- ✅ File upload works
- ✅ Excel/CSV parsing works
- ✅ Validation messages appear
- ✅ Preview shows data correctly
- ✅ Error handling works

### Assessment Creation
- ✅ Questions imported successfully
- ✅ Assessment saves to database
- ✅ Assessment appears in admin list
- ✅ Assessment available publicly

### User Experience
- ✅ No page redirects needed
- ✅ All functionality in one dashboard
- ✅ Clear error messages
- ✅ Intuitive workflow

## 🐛 Common Issues & Solutions

### Issue: File Upload Fails
**Solution:** Check file format (.xlsx, .csv only)

### Issue: Validation Errors
**Solution:** Check template format matches exactly

### Issue: Questions Not Appearing
**Solution:** Verify "เพิ่มคำถาม" was clicked after import

### Issue: Assessment Not Public
**Solution:** Check "เปิดใช้งาน" toggle is enabled

## 📊 Test Checklist

- [ ] Admin dashboard loads
- [ ] Create assessment form works
- [ ] Template download works
- [ ] File upload accepts Excel/CSV
- [ ] Validation shows errors/success
- [ ] Preview displays correctly
- [ ] Questions import successfully
- [ ] Assessment saves to database
- [ ] Assessment appears in admin list
- [ ] Public page shows assessment
- [ ] Assessment can be completed
- [ ] Results display correctly

## 🎉 Success Criteria

**All tests pass = Import system working correctly!**

---

**Test Date:** ${new Date().toLocaleDateString('th-TH')}  
**Tester:** [Your Name]  
**Status:** [ ] PASS / [ ] FAIL  
**Notes:** ___________________________
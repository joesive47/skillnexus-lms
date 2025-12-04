# 🎯 Manual Deploy Steps

Build สำเร็จแล้ว! ทำตามขั้นตอน:

## 1. Configure AWS (ถ้ายังไม่ได้ทำ)
```powershell
aws configure
# AWS Access Key ID: YOUR_KEY
# AWS Secret Access Key: YOUR_SECRET
# Default region: ap-southeast-1
```

## 2. Create ECR Repository
```powershell
aws ecr create-repository --repository-name skillnexus-lms --region ap-southeast-1
```

## 3. Get Account ID
```powershell
$ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text).Trim()
Write-Host "Account ID: $ACCOUNT_ID"
```

## 4. Login to ECR
```powershell
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com"
```

## 5. Tag Image
```powershell
docker tag skillnexus-lms:latest "$ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/skillnexus-lms:latest"
```

## 6. Push to ECR
```powershell
docker push "$ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/skillnexus-lms:latest"
```

## 7. Deploy to App Runner
1. Go to: https://console.aws.amazon.com/apprunner
2. Click "Create service"
3. Source: ECR → Select image
4. Configure:
   - CPU: 2 vCPU
   - Memory: 4 GB
   - Port: 3000
5. Add env vars from `.env.production`
6. Deploy!

✅ Done!

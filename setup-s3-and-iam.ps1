# setup-s3-and-iam.ps1
param(
  [string]$BucketName = $(Read-Host "Bucket name (e.g. your-skillnexus-bucket)"),
  [string]$Region = $(Read-Host "AWS region (e.g. eu-west-1)"),
  [string]$IamUser = "skillnexus-uploader"
)

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
  Write-Error "AWS CLI not found. Install and run 'aws configure' first."
  exit 1
}

# Create bucket (special-case us-east-1)
if ($Region -eq "us-east-1") {
  aws s3api create-bucket --bucket $BucketName --region $Region | Out-Null
} else {
  aws s3api create-bucket --bucket $BucketName --region $Region --create-bucket-configuration LocationConstraint=$Region | Out-Null
}
Write-Host "Created bucket $BucketName in $Region (or it already exists)."

# Create IAM policy JSON
$policy = @{
  Version = "2012-10-17"
  Statement = @(
    @{
      Effect = "Allow"
      Action = @("s3:PutObject","s3:PutObjectAcl","s3:GetObject","s3:ListBucket")
      Resource = @("arn:aws:s3:::$BucketName","arn:aws:s3:::$BucketName/*")
    }
  )
} | ConvertTo-Json -Depth 5

$policyFile = "$PWD\s3-policy.json"
$policy | Out-File -Encoding utf8 -FilePath $policyFile
Write-Host "Wrote policy to $policyFile"

# Create IAM policy
$createPolicy = aws iam create-policy --policy-name SkillNexusS3Policy --policy-document file://$policyFile 2>$null | ConvertFrom-Json
if ($createPolicy -and $createPolicy.Policy -and $createPolicy.Policy.Arn) {
  $policyArn = $createPolicy.Policy.Arn
  Write-Host "Created policy: $policyArn"
} else {
  # If already exists, try to find ARN
  $policyArn = (aws iam list-policies --scope Local | ConvertFrom-Json).Policies | Where-Object { $_.PolicyName -eq "SkillNexusS3Policy" } | Select-Object -ExpandProperty Arn
  Write-Host "Policy exists: $policyArn"
}

# Create IAM user (ignore error if exists)
aws iam create-user --user-name $IamUser 2>$null | Out-Null
Write-Host "Created/ensured IAM user: $IamUser"

# Attach policy
aws iam attach-user-policy --user-name $IamUser --policy-arn $policyArn
Write-Host "Attached policy to $IamUser"

# Create access key
$access = aws iam create-access-key --user-name $IamUser | ConvertFrom-Json
$AccessKeyId = $access.AccessKey.AccessKeyId
$SecretAccessKey = $access.AccessKey.SecretAccessKey

Write-Host ""
Write-Host "===== COPY THESE CREDENTIALS (KEEP SECRET) ====="
Write-Host "AWS_ACCESS_KEY_ID = $AccessKeyId"
Write-Host "AWS_SECRET_ACCESS_KEY = $SecretAccessKey"
Write-Host "AWS_REGION = $Region"
Write-Host "S3_BUCKET = $BucketName"
Write-Host "==============================================="
Write-Host ""

# (Optional) Add permissive bucket policy to allow public GET of objects
$bucketPolicy = @{
  Version = "2012-10-17"
  Statement = @(
    @{
      Sid = "PublicReadForGetBucketObjects"
      Effect = "Allow"
      Principal = "*"
      Action = @("s3:GetObject")
      Resource = @("arn:aws:s3:::$BucketName/*")
    }
  )
} | ConvertTo-Json -Depth 5

$bucketPolicyFile = "$PWD\bucket-policy.json"
$bucketPolicy | Out-File -Encoding utf8 -FilePath $bucketPolicyFile

aws s3api put-bucket-policy --bucket $BucketName --policy file://$bucketPolicyFile 2>$null
Write-Host "Applied (optional) public-read bucket policy to $BucketName"

Write-Host ""
Write-Host "NEXT STEPS:"
Write-Host "1) In Vercel Project → Settings → Environment Variables (Production), add:"
Write-Host "   AWS_REGION = $Region"
Write-Host "   AWS_ACCESS_KEY_ID = $AccessKeyId"
Write-Host "   AWS_SECRET_ACCESS_KEY = $SecretAccessKey"
Write-Host "   S3_BUCKET = $BucketName"
Write-Host "2) After saving env vars, run on your machine:"
Write-Host "   $env:VERCEL_TOKEN = 'YOUR_VERCEL_TOKEN'  # or set via system environment"
Write-Host "   git push origin main"
Write-Host "   npx vercel --prod --confirm --token $env:VERCEL_TOKEN"
Write-Host ""
Write-Host "Do NOT share the printed credentials publicly. Rotate/delete keys if exposed."
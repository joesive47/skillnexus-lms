import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export interface ScormContent {
  title: string
  description?: string
  htmlContent: string
  duration?: number
  passingScore?: number
}

export class ScormBuilder {
  private outputDir = join(process.cwd(), 'public', 'scorm-packages')

  async createPackage(id: string, content: ScormContent): Promise<string> {
    const packageDir = join(this.outputDir, id)
    await mkdir(packageDir, { recursive: true })

    // 1. สร้าง imsmanifest.xml
    await writeFile(join(packageDir, 'imsmanifest.xml'), this.generateManifest(id, content))

    // 2. สร้าง index.html
    await writeFile(join(packageDir, 'index.html'), this.generateHTML(content))

    // 3. สร้าง scorm_api.js
    await writeFile(join(packageDir, 'scorm_api.js'), this.generateScormAPI())

    return `/scorm-packages/${id}`
  }

  private generateManifest(id: string, content: ScormContent): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${id}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                      http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                      http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ORG-${id}">
    <organization identifier="ORG-${id}">
      <title>${content.title}</title>
      <item identifier="ITEM-${id}" identifierref="RES-${id}">
        <title>${content.title}</title>
        <adlcp:masteryscore>${content.passingScore || 80}</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-${id}" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="scorm_api.js"/>
    </resource>
  </resources>
</manifest>`
  }

  private generateHTML(content: ScormContent): string {
    return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
  <script src="scorm_api.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; max-width: 1200px; margin: 0 auto; }
    h1 { color: #1e40af; margin-bottom: 1rem; }
    .content { line-height: 1.6; }
    .complete-btn { 
      background: #10b981; color: white; border: none; padding: 1rem 2rem; 
      border-radius: 0.5rem; cursor: pointer; font-size: 1rem; margin-top: 2rem;
    }
    .complete-btn:hover { background: #059669; }
  </style>
</head>
<body>
  <h1>${content.title}</h1>
  ${content.description ? `<p style="color: #6b7280; margin-bottom: 2rem;">${content.description}</p>` : ''}
  <div class="content">${content.htmlContent}</div>
  <button class="complete-btn" onclick="completeCourse()">✅ เสร็จสิ้นบทเรียน</button>
  
  <script>
    // Initialize SCORM
    window.API = new ScormAPI();
    API.LMSInitialize("");
    API.LMSSetValue("cmi.core.lesson_status", "incomplete");
    API.LMSSetValue("cmi.core.score.min", "0");
    API.LMSSetValue("cmi.core.score.max", "100");
    
    function completeCourse() {
      API.LMSSetValue("cmi.core.lesson_status", "completed");
      API.LMSSetValue("cmi.core.score.raw", "100");
      API.LMSCommit("");
      alert("✅ บันทึกความคืบหน้าเรียบร้อย!");
    }
    
    window.addEventListener('beforeunload', () => {
      API.LMSFinish("");
    });
  </script>
</body>
</html>`
  }

  private generateScormAPI(): string {
    return `class ScormAPI {
  constructor() {
    this.data = {};
    this.initialized = false;
  }

  LMSInitialize(param) {
    this.initialized = true;
    console.log("SCORM: Initialized");
    return "true";
  }

  LMSGetValue(key) {
    return this.data[key] || "";
  }

  LMSSetValue(key, value) {
    this.data[key] = value;
    console.log("SCORM Set:", key, "=", value);
    
    // Send to parent window
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'scorm',
        action: 'setValue',
        key: key,
        value: value
      }, '*');
    }
    return "true";
  }

  LMSCommit(param) {
    console.log("SCORM: Commit", this.data);
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'scorm',
        action: 'commit',
        data: this.data
      }, '*');
    }
    return "true";
  }

  LMSFinish(param) {
    this.initialized = false;
    console.log("SCORM: Finished");
    return "true";
  }

  LMSGetLastError() { return "0"; }
  LMSGetErrorString(errorCode) { return "No error"; }
  LMSGetDiagnostic(errorCode) { return ""; }
}

// Make API available globally
if (typeof window !== 'undefined') {
  window.API = new ScormAPI();
}`
  }
}

export const scormBuilder = new ScormBuilder()

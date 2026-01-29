@echo off
echo Creating SCORM courses 1-6...

REM Copy shared template to all courses
for %%c in (1-ai-chatgpt-business 2-data-analytics-bi 3-digital-marketing 4-cybersecurity-pdpa 5-financial-literacy 6-ai-software-innovator) do (
    echo Processing %%c...
    xcopy /E /I /Y c:\API\The-SkillNexus\scorm-courses\shared-template c:\API\The-SkillNexus\scorm-courses\%%c\shared
)

echo Done!
pause

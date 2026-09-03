-- ============================================================================
-- Phase 3 Test Data: Video 80% → SCORM Unlock
-- ============================================================================
-- Purpose: Test the video progress requirement for SCORM access
-- Requirement: User must watch video to 80% or more to unlock SCORM content
-- ============================================================================

-- Clean up any existing test data for Phase 3
DELETE FROM watch_history WHERE "lessonId" LIKE 'test-lesson-scorm-%';
DELETE FROM scorm_packages WHERE "lessonId" LIKE 'test-lesson-scorm-%';
DELETE FROM lessons WHERE id LIKE 'test-lesson-scorm-%';
DELETE FROM enrollments WHERE "courseId" = 'test-course-phase3';
DELETE FROM modules WHERE id = 'test-module-phase3';
DELETE FROM courses WHERE id = 'test-course-phase3';

-- Get a test user
DO $$
DECLARE
    v_user_id TEXT;
    v_course_id TEXT := 'test-course-phase3';
    v_module_id TEXT := 'test-module-phase3';
BEGIN
    -- Get a student user from seed data
    SELECT id INTO v_user_id FROM users WHERE role = 'STUDENT' LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'No student user found. Please run seed data first.';
    END IF;

    -- Create test course
    INSERT INTO courses (id, title, description, published, price, "createdAt", "updatedAt")
    VALUES (
        v_course_id,
        'Test Course: Video to SCORM Flow',
        'Course for testing Phase 3: Video 80% → SCORM Unlock',
        true,
        0,
        NOW(),
        NOW()
    );

    -- Create test module
    INSERT INTO modules (id, title, "order", "courseId", "createdAt")
    VALUES (
        v_module_id,
        'Module 1: Interactive Learning',
        1,
        v_course_id,
        NOW()
    );

    -- Enroll user in course
    INSERT INTO enrollments (id, "userId", "courseId", "createdAt")
    VALUES (
        'test-enrollment-phase3',
        v_user_id,
        v_course_id,
        NOW()
    );

    -- ========================================================================
    -- Test Scenario 1: Video watched 50% (SCORM LOCKED)
    -- ========================================================================
    INSERT INTO lessons (
        id, "courseId", "moduleId", title, type, "lessonType", "order",
        "youtubeUrl", duration, "requiredCompletionPercentage", "createdAt"
    ) VALUES (
        'test-lesson-scorm-locked',
        v_course_id,
        v_module_id,
        'Lesson A: Introduction (50% watched - SCORM Locked)',
        'VIDEO',
        'VIDEO',
        1,
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        600,
        80,
        NOW()
    );

    INSERT INTO scorm_packages (
        id, "lessonId", "packagePath", title, version, identifier, "createdAt", "updatedAt"
    ) VALUES (
        'test-scorm-pkg-locked',
        'test-lesson-scorm-locked',
        '/scorm/test-package-locked',
        'Interactive Content A (Locked)',
        '1.2',
        'test-scorm-locked',
        NOW(),
        NOW()
    );

    INSERT INTO watch_history (
        id, "userId", "lessonId", "watchTime", "totalTime", completed, "updatedAt"
    ) VALUES (
        'test-watch-history-50',
        v_user_id,
        'test-lesson-scorm-locked',
        300,
        600,
        false,
        NOW()
    );

    -- ========================================================================
    -- Test Scenario 2: Video watched 85% (SCORM UNLOCKED)
    -- ========================================================================
    INSERT INTO lessons (
        id, "courseId", "moduleId", title, type, "lessonType", "order",
        "youtubeUrl", duration, "requiredCompletionPercentage", "createdAt"
    ) VALUES (
        'test-lesson-scorm-unlocked',
        v_course_id,
        v_module_id,
        'Lesson B: Main Content (85% watched - SCORM Unlocked)',
        'VIDEO',
        'VIDEO',
        2,
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        720,
        80,
        NOW()
    );

    INSERT INTO scorm_packages (
        id, "lessonId", "packagePath", title, version, identifier, "createdAt", "updatedAt"
    ) VALUES (
        'test-scorm-pkg-unlocked',
        'test-lesson-scorm-unlocked',
        '/scorm/test-package-unlocked',
        'Interactive Content B (Unlocked)',
        '1.2',
        'test-scorm-unlocked',
        NOW(),
        NOW()
    );

    INSERT INTO watch_history (
        id, "userId", "lessonId", "watchTime", "totalTime", completed, "updatedAt"
    ) VALUES (
        'test-watch-history-85',
        v_user_id,
        'test-lesson-scorm-unlocked',
        612,
        720,
        true,
        NOW()
    );

    -- ========================================================================
    -- Test Scenario 3: Video NOT watched (0% - SCORM LOCKED)
    -- ========================================================================
    INSERT INTO lessons (
        id, "courseId", "moduleId", title, type, "lessonType", "order",
        "youtubeUrl", duration, "requiredCompletionPercentage", "createdAt"
    ) VALUES (
        'test-lesson-scorm-zero',
        v_course_id,
        v_module_id,
        'Lesson C: Advanced Topics (0% watched - SCORM Locked)',
        'VIDEO',
        'VIDEO',
        3,
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        480,
        80,
        NOW()
    );

    INSERT INTO scorm_packages (
        id, "lessonId", "packagePath", title, version, identifier, "createdAt", "updatedAt"
    ) VALUES (
        'test-scorm-pkg-zero',
        'test-lesson-scorm-zero',
        '/scorm/test-package-zero',
        'Interactive Content C (Locked - No Progress)',
        '1.2',
        'test-scorm-zero',
        NOW(),
        NOW()
    );

    -- No watch history for Lesson C (0% progress)

    RAISE NOTICE '✅ Phase 3 test data created successfully!';
    RAISE NOTICE '📊 Test User ID: %', v_user_id;
    RAISE NOTICE '📚 Test Course ID: %', v_course_id;
    RAISE NOTICE '';
    RAISE NOTICE '🧪 Test Scenarios:';
    RAISE NOTICE '  1. Lesson A (test-lesson-scorm-locked): 50%% watched → SCORM LOCKED ❌';
    RAISE NOTICE '  2. Lesson B (test-lesson-scorm-unlocked): 85%% watched → SCORM UNLOCKED ✅';
    RAISE NOTICE '  3. Lesson C (test-lesson-scorm-zero): 0%% watched → SCORM LOCKED ❌';

END $$;

-- ============================================================================
-- Verification Query: Check test data
-- ============================================================================
SELECT 
    l.id AS lesson_id,
    l.title AS lesson_title,
    COALESCE(wh."watchTime", 0) AS watch_time_seconds,
    COALESCE(wh."totalTime", 0) AS total_time_seconds,
    CASE 
        WHEN wh."totalTime" > 0 THEN ROUND((wh."watchTime" / wh."totalTime") * 100)
        ELSE 0
    END AS video_progress_pct,
    CASE 
        WHEN wh."totalTime" > 0 AND (wh."watchTime" / wh."totalTime") * 100 >= 80 THEN '✅ UNLOCKED'
        ELSE '❌ LOCKED'
    END AS scorm_status,
    sp.id AS scorm_package_id,
    sp.title AS scorm_title
FROM lessons l
LEFT JOIN watch_history wh ON l.id = wh."lessonId"
LEFT JOIN scorm_packages sp ON l.id = sp."lessonId"
WHERE l.id LIKE 'test-lesson-scorm-%'
ORDER BY l."order";

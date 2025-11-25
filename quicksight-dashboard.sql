-- QuickSight Analytics Queries for SkillNexus LMS

-- 1. User Engagement Metrics
SELECT 
  DATE_TRUNC('day', wh.updated_at) as date,
  COUNT(DISTINCT wh.user_id) as active_users,
  AVG(wh.watch_time) as avg_watch_time,
  COUNT(CASE WHEN wh.completed = true THEN 1 END) as completed_lessons
FROM watch_history wh
WHERE wh.updated_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', wh.updated_at)
ORDER BY date;

-- 2. Course Performance Dashboard
SELECT 
  c.title as course_name,
  COUNT(DISTINCT e.user_id) as enrolled_users,
  COUNT(DISTINCT cert.user_id) as certified_users,
  ROUND(COUNT(DISTINCT cert.user_id)::numeric / COUNT(DISTINCT e.user_id) * 100, 2) as completion_rate,
  AVG(c.price) as avg_price,
  SUM(c.price) as total_revenue
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
LEFT JOIN certificates cert ON c.id = cert.course_id
WHERE c.is_published = true
GROUP BY c.id, c.title
ORDER BY completion_rate DESC;

-- 3. Revenue Analytics
SELECT 
  DATE_TRUNC('month', e.created_at) as month,
  COUNT(e.id) as new_enrollments,
  SUM(c.price) as monthly_revenue,
  COUNT(DISTINCT e.user_id) as unique_customers
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', e.created_at)
ORDER BY month;

-- 4. Student Progress Tracking
SELECT 
  u.name as student_name,
  c.title as course_title,
  COUNT(l.id) as total_lessons,
  COUNT(CASE WHEN wh.completed = true THEN 1 END) as completed_lessons,
  ROUND(COUNT(CASE WHEN wh.completed = true THEN 1 END)::numeric / COUNT(l.id) * 100, 2) as progress_percentage
FROM users u
JOIN enrollments e ON u.id = e.user_id
JOIN courses c ON e.course_id = c.id
JOIN modules m ON c.id = m.course_id
JOIN lessons l ON m.id = l.module_id
LEFT JOIN watch_history wh ON u.id = wh.user_id AND l.id = wh.lesson_id
WHERE u.role = 'STUDENT'
GROUP BY u.id, u.name, c.id, c.title
HAVING COUNT(l.id) > 0
ORDER BY progress_percentage DESC;

-- 5. Quiz Performance Analysis
SELECT 
  q.title as quiz_name,
  COUNT(ss.id) as total_attempts,
  COUNT(CASE WHEN ss.passed = true THEN 1 END) as passed_attempts,
  ROUND(COUNT(CASE WHEN ss.passed = true THEN 1 END)::numeric / COUNT(ss.id) * 100, 2) as pass_rate,
  AVG(ss.score) as average_score
FROM quizzes q
LEFT JOIN student_submissions ss ON q.id = ss.quiz_id
GROUP BY q.id, q.title
ORDER BY pass_rate DESC;
json.set! :task do
  json.id @task.id
  json.title @task.title
  json.deadline @task.deadline
  json.description @task.description
  json.created_at @task.created_at.to_s(:ymd)
  json.progress @task.progress
  json.status @task.status
end
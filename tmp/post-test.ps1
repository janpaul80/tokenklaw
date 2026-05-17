$body = @{
  prompt = "explain this repo architecture"
  context = "TokenKlaw test request"
  provider = "local"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:9999/v1/request" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json -Depth 8

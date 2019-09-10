# next version
add cherry-picking option (similar to v2.0.0) having `subject`, `from`, `to`, `cc`, `bcc`, and `message-id` in the object. 

# 2.2.0
Fixes bug in the original code (v2.1.0), as some attachments are not correctly recognized as attachments 
Tests added
Forked from `https://github.com/EmilTholin/gmail-api-parse-message`, v2.1.0, some parts converted to typescript, as necessary

# 2.1.0
Added `inline` attachments to the result, and added indexed headers to the `attachments` objects.

# 2.0.0
All headers are now put in `headers` instead of just cherry-picking `subject`, `from`, `to`, `cc`, `bcc`, and `message-id`.

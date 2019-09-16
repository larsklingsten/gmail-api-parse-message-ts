# Versions

## 2.2.16
- updates klingsten-snippets dependency to 1.0.24 (no code changes necessary)

## 2.2.13
- adds cherry-picking option (similar to v2.0.0) having `subject`, `from`, `to`, `cc`, `bcc`, and `message-id` in the object.
- adds IReceiver interface {name: '', email:''}
- uses 'klingsten snippets' as dependency (Strings.splitByCommaSemicolon, Strings.removeNonPrintingCharsAndSpaces)
- moves Compare.arrays, Compare.objects, Compare.printErrors to klingsten-snippets

## 2.2.12
BugFix: pictures embeded into HTML, were included as attachments [without a name]. 

## 2.2.11
BugFix: all file names are now lower case, to avoid problems with case-sensitive operating systems, such as linux.

## 2.2.0 (ts)
Fixes bug in the original code (v2.1.0), as some attachments are not correctly recognized as attachments 
Tests added
Forked from `https://github.com/EmilTholin/gmail-api-parse-message`, v2.1.0, some parts converted to typescript, as necessary

## 2.1.0 (org version)
Added `inline` attachments to the result, and added indexed headers to the `attachments` objects.

## 2.0.0 (org version)
All headers are now put in `headers` instead of just cherry-picking `subject`, `from`, `to`, `cc`, `bcc`, and `message-id`.

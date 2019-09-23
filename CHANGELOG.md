# Versions

## 2.2.27
add  isEmailValid: boolean function, check whether or not an email is valid

## 2.2.26
add  isValid?: boolean to interface IReceiver. comments: Optional. Possible to marked users non-valid emails, as not valid, for later evaluation 

## 2.2.25
bugFix, checks for undefined values indexHeaders(), causing runtime errors in certain cases

## 2.2.24
updates removeUnwantedCharsFromName(), now removes also ',' from IReceiver {name}

## 2.2.23
BugFix. Headers may be undefined for deleted 'email'

## 2.2.22
Removes @ParseApiGmail function this.ensureNameFromSplit() -> IReceiver {name} can be empty string

## 2.2.21
Adds removeUnwantedCharsFromName()

## 2.2.19
Adds getEmptyEmail() to exported functions 

## 2.2.19
- DateStr renamed to SentDate and stored as number
- SendDate gets updated header('date') or if missing from internalDate (gmail timestmap) 
- adds attribute isUnread: boolean to IEmail (set by labelIds containing "unread"

## 2.2.18
updates klingsten-snippets dependency to 1.0.25 to bugfix @klingsten-snippets @String.splitNameFromEmail 

## 2.2.16
- updates klingsten-snippets dependency to 1.0.24 (no code changes necessary)

## 2.2.13
- adds cherry-picking option (similar to versions prior to  v2.0.0) having `subject`, `from`, `to`, `cc`, `bcc`, and `message-id` in the object.
- adds IReceiver interface {name: '', email:''}
- uses 'klingsten snippets' as dependency (Strings.splitExceptQuotes, Strings.removeNonPrintingCharsAndSpaces)
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

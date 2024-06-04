test:
	npm test

publish:
	npm login
	npm version patch
	npm publish

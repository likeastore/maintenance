MOCHA_PATH=node_modules/mocha/bin/mocha

test:
	NODE_ENV=test $(MOCHA_PATH) -w --reporter spec

test-debug:
	NODE_ENV=test $(MOCHA_PATH) -w --reporter spec debug

test-once:
	NODE_ENV=test $(MOCHA_PATH) --reporter spec

.PHONY: test test-coverage test-coveralls
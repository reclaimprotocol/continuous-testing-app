#!/bin/bash

npm run detox:start &

METRO_BUNDLER_PID=$!

npm run e2e:test -- --headless

DETOX_EXIT_CODE=$?

kill $METRO_BUNDLER_PID

exit $DETOX_EXIT_CODE
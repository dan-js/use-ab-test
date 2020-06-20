set -euf -o pipefail

yarn test --coverage --coverageReporters=\"json-summary\"

jest-coverage-badges output ./badges

node "$(dirname "$0")/generateBadges.js"

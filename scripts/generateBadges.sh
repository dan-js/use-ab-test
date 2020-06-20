set -euf -o pipefail

yarn test:badges

node "$(dirname "$0")/generateBadges.js"

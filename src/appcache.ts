import * as appCacheNanny from 'appcache-nanny';

if (!('serviceWorker' in navigator)) {
  appCacheNanny.start();
}
